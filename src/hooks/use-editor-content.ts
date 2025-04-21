/**
 * Feature: TipTap Editor Content Hook
 * Description: Custom hook for managing TipTap editor content with API integration
 */

import { useState, useCallback, useEffect } from "react";
import { Editor, JSONContent } from "@tiptap/react";
import { EditorService } from "@/lib/services/editor-service";
import { EditorContentResponse } from "@/types/editor";
import { useToast } from "@/hooks/use-toast";

interface EditorContentOptions {
  initialId?: string;
  initialTitle?: string;
  initialContent?: JSONContent;
  autoSaveInterval?: number; // in milliseconds
}

interface EditorContentState {
  id: string | null;
  title: string;
  content: JSONContent;
  published: boolean;
  isSaving: boolean;
  isLoading: boolean;
  lastSaved: Date | null;
  error: Error | null;
}

// Create a valid empty TipTap document structure
const createEmptyDocument = (): JSONContent => ({
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [],
    },
  ],
});

/**
 * Ensures the content has a valid TipTap document structure
 * @param content Content to validate
 * @returns Validated content with proper structure
 */
const ensureValidDocumentStructure = (content: JSONContent): JSONContent => {
  // If content is null/undefined, return empty document
  if (!content) {
    return createEmptyDocument();
  }

  // If content already has the correct root structure, return as is
  if (content.type === "doc" && Array.isArray(content.content)) {
    return content;
  }

  // If content has content array but wrong type, fix the type
  if (Array.isArray(content.content)) {
    return {
      type: "doc",
      content: content.content,
    };
  }

  // If content is invalid, wrap it in a proper document structure
  return {
    type: "doc",
    content: [content],
  };
};

/**
 * Custom hook for managing editor content with API integration
 */
export function useEditorContent({
  initialId,
  initialTitle = "",
  initialContent,
  autoSaveInterval = 30000, // Default: 30 seconds
}: EditorContentOptions = {}) {
  // Ensure initial content has valid structure
  const validatedInitialContent = ensureValidDocumentStructure(
    initialContent || createEmptyDocument()
  );

  // State for editor content and metadata
  const [state, setState] = useState<EditorContentState>({
    id: initialId || null,
    title: initialTitle,
    content: validatedInitialContent,
    published: false,
    isSaving: false,
    isLoading: !!initialId,
    lastSaved: null,
    error: null,
  });

  // Get toast notification functionality
  const { toast } = useToast();

  // Reference to the editor instance
  const [editor, setEditor] = useState<Editor | null>(null);

  /**
   * Load content from API if an ID is provided
   */
  useEffect(() => {
    if (initialId) {
      setState((prev) => ({ ...prev, isLoading: true }));

      EditorService.getContentById(initialId)
        .then((response) => {
          // Ensure loaded content has valid document structure
          const validatedContent = ensureValidDocumentStructure(
            response.content as JSONContent
          );

          setState({
            id: response.id,
            title: response.title,
            content: validatedContent,
            published: response.published,
            isSaving: false,
            isLoading: false,
            lastSaved: new Date(response.updatedAt),
            error: null,
          });

          // Update editor content if editor instance exists
          if (editor && !editor.isDestroyed) {
            editor.commands.setContent(validatedContent);
          }
        })
        .catch((error) => {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error:
              error instanceof Error
                ? error
                : new Error("Failed to load content"),
          }));
          toast({
            title: "Error loading content",
            description: error.message,
            variant: "destructive",
          });
        });
    }
  }, [initialId, editor, toast]);

  /**
   * Update editor reference when it changes
   */
  const bindEditor = useCallback(
    (editorInstance: Editor | null) => {
      setEditor(editorInstance);

      // Set initial content if we have an editor but no initialId
      if (editorInstance && !initialId && !editorInstance.isDestroyed) {
        editorInstance.commands.setContent(state.content);
      }
    },
    [initialId, state.content]
  );

  /**
   * Update title in state
   */
  const setTitle = useCallback((title: string) => {
    setState((prev) => ({ ...prev, title }));
  }, []);

  /**
   * Update publication status
   */
  const setPublished = useCallback((published: boolean) => {
    setState((prev) => ({ ...prev, published }));
  }, []);

  /**
   * Save or update content through API
   */
  const saveContent = useCallback(
    async (forceSave = false) => {
      // Skip saving if there's no editor, or if it's already saving
      if (!editor || state.isSaving || (!forceSave && !editor.isEditable)) {
        return;
      }

      // Get current content from editor and ensure it has valid structure
      const rawContent = editor.getJSON();
      const validContent = ensureValidDocumentStructure(rawContent);

      // Set saving state
      setState((prev) => ({ ...prev, isSaving: true, error: null }));

      try {
        let response: EditorContentResponse;

        // Create new content if there's no ID, otherwise update existing
        if (!state.id) {
          response = await EditorService.createContent({
            title: state.title,
            content: validContent,
            published: state.published,
          });

          toast({
            title: "Content created",
            description: "Your content has been saved successfully.",
          });
        } else {
          response = await EditorService.updateContent(state.id, {
            title: state.title,
            content: validContent,
            published: state.published,
          });

          toast({
            title: "Content updated",
            description: "Your changes have been saved successfully.",
          });
        }

        // Update state with response
        setState({
          id: response.id,
          title: response.title,
          content: ensureValidDocumentStructure(
            response.content as JSONContent
          ),
          published: response.published,
          isSaving: false,
          isLoading: false,
          lastSaved: new Date(response.updatedAt),
          error: null,
        });

        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to save content";

        setState((prev) => ({
          ...prev,
          isSaving: false,
          error: error instanceof Error ? error : new Error(errorMessage),
        }));

        toast({
          title: "Error saving content",
          description: errorMessage,
          variant: "destructive",
        });

        throw error;
      }
    },
    [editor, state.id, state.title, state.published, state.isSaving, toast]
  );

  /**
   * Set up auto-save functionality
   */
  useEffect(() => {
    if (!autoSaveInterval || !editor) {
      return;
    }

    let autoSaveTimer: NodeJS.Timeout;

    // Handler for editor changes
    const handleUpdate = ({ editor }: { editor: Editor }) => {
      clearTimeout(autoSaveTimer);
      autoSaveTimer = setTimeout(() => {
        if (editor.isEmpty) return;
        saveContent();
      }, autoSaveInterval);
    };

    // Add transaction listener
    if (editor) {
      editor.on("update", handleUpdate);
    }

    // Clean up
    return () => {
      clearTimeout(autoSaveTimer);
      if (editor) {
        editor.off("update", handleUpdate);
      }
    };
  }, [editor, autoSaveInterval, saveContent]);

  /**
   * Delete content through API
   */
  const deleteContent = useCallback(async () => {
    if (!state.id) {
      return;
    }

    try {
      await EditorService.deleteContent(state.id);

      // Reset state after deletion
      setState({
        id: null,
        title: "",
        content: createEmptyDocument(),
        published: false,
        isSaving: false,
        isLoading: false,
        lastSaved: null,
        error: null,
      });

      // Clear editor content if it exists
      if (editor && !editor.isDestroyed) {
        editor.commands.clearContent();
      }

      toast({
        title: "Content deleted",
        description: "Your content has been deleted successfully.",
      });

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete content";

      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error : new Error(errorMessage),
      }));

      toast({
        title: "Error deleting content",
        description: errorMessage,
        variant: "destructive",
      });

      throw error;
    }
  }, [state.id, editor, toast]);

  /**
   * Handle image uploads for the editor
   */
  const uploadImage = useCallback(
    async (file: File) => {
      try {
        const response = await EditorService.uploadImage(file);
        return response.url;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to upload image";

        toast({
          title: "Error uploading image",
          description: errorMessage,
          variant: "destructive",
        });

        throw error;
      }
    },
    [toast]
  );

  return {
    ...state,
    bindEditor,
    setTitle,
    setPublished,
    saveContent,
    deleteContent,
    uploadImage,
  };
}

/**
 * Summary:
 * 1. Added validation for TipTap document structure to fix "Schema is missing its top node type" error
 * 2. Implemented helper functions to create empty documents and ensure valid structure
 * 3. Applied structure validation at all key points: initialization, content loading, and saving
 * 4. Maintained backward compatibility with existing implementation
 *
 * Technical improvements:
 * - Added defensive programming to prevent schema errors
 * - Created pure functions for content validation and transformation
 * - Preserved all existing functionality while enhancing reliability
 */
