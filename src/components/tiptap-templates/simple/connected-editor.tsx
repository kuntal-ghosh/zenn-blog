/**
 * Feature: TipTap Editor with API Connection
 * Description: Enhanced version of SimpleEditor that connects with the backend API
 */

"use client";

import * as React from "react";
import { useEditor, Extensions } from "@tiptap/react";
import { SimpleEditor } from "./simple-editor";
import { useEditorContent } from "@/hooks/use-editor-content";
import { Button } from "@/components/tiptap-ui-primitive/button";
import { handleImageUpload as defaultHandleImageUpload } from "@/lib/tiptap-utils";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, Save, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Underline } from "@tiptap/extension-underline";

// --- Custom Extensions ---
import { Link } from "@/components/tiptap-extension/link-extension";
import { Selection } from "@/components/tiptap-extension/selection-extension";
import { TrailingNode } from "@/components/tiptap-extension/trailing-node-extension";
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";
import { ZoomableImage } from "@/components/tiptap-node/zoomable-image-node/zoomable-image-node-extension";
import { MAX_FILE_SIZE } from "@/lib/tiptap-utils";

interface ConnectedEditorProps {
  postId?: string;
  initialTitle?: string;
  autoSave?: boolean;
  className?: string;
  showControls?: boolean;
  onSaved?: (id: string) => void;
  onDeleted?: () => void;
}

// Standard set of TipTap extensions to ensure consistent behavior
const createExtensions = (
  handleImageUpload: (file: File) => Promise<string>
): Extensions => [
  StarterKit,
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Underline,
  TaskList,
  TaskItem.configure({ nested: true }),
  Highlight.configure({ multicolor: true }),
  Image,
  Typography,
  Superscript,
  Subscript,
  Selection,
  ImageUploadNode.configure({
    accept: "image/*",
    maxSize: MAX_FILE_SIZE,
    limit: 3,
    upload: handleImageUpload,
    onError: (error) => console.error("Upload failed:", error),
  }),
  ZoomableImage,
  TrailingNode,
  Link.configure({ openOnClick: false }),
];

export function ConnectedEditor({
  postId,
  initialTitle = "",
  autoSave = true,
  className = "",
  showControls = true,
  onSaved,
  onDeleted,
}: ConnectedEditorProps) {
  // Use our custom hook to manage editor content and API interactions
  const {
    id,
    title,
    content,
    published,
    isSaving,
    isLoading,
    lastSaved,
    error,
    bindEditor,
    setTitle,
    setPublished,
    saveContent,
    deleteContent,
    uploadImage,
  } = useEditorContent({
    initialId: postId,
    initialTitle,
    autoSaveInterval: autoSave ? 30000 : 0, // 30 seconds if autoSave is enabled
  });

  // Create custom image upload handler that uses our API
  const handleImageUpload = React.useCallback(
    async (file: File): Promise<string> => {
      try {
        // Use our API-integrated upload function
        return await uploadImage(file);
      } catch (error) {
        // Fall back to the default implementation if API upload fails
        console.error("API image upload failed, using fallback:", error);
        return defaultHandleImageUpload(file);
      }
    },
    [uploadImage]
  );

  // Initialize the editor with our configurations
  const extensions = React.useMemo(
    () => createExtensions(handleImageUpload),
    [handleImageUpload]
  );

  const editor = useEditor({
    extensions,
    content: content, // Our hook ensures this has proper 'doc' structure
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
      },
    },
    onBeforeCreate: ({ editor }) => {
      // This ensures our hook gets the editor instance
      bindEditor(editor);
    },
    onDestroy: () => {
      // Clean up when editor is destroyed
      bindEditor(null);
    },
  });

  // Handler for manual save button
  const handleSave = async () => {
    if (title.trim().length === 0) {
      // Show error for empty title
      return;
    }

    try {
      const result = await saveContent(true);
      if (result && onSaved) {
        onSaved(result.id);
      }
    } catch (error) {
      console.error("Failed to save content:", error);
    }
  };

  // Handler for delete button
  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this content? This action cannot be undone."
      )
    ) {
      try {
        await deleteContent();
        if (onDeleted) {
          onDeleted();
        }
      } catch (error) {
        console.error("Failed to delete content:", error);
      }
    }
  };

  // Format last saved time for display
  const formattedLastSaved = lastSaved
    ? new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(lastSaved)
    : null;

  return (
    <div className={`connected-editor-container ${className}`}>
      {/* Title and controls section */}
      {showControls && (
        <div className="editor-controls mb-4 space-y-4">
          {/* Title input */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="post-title">Title</Label>
            <Input
              id="post-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              className="text-xl font-bold"
            />
          </div>

          {/* Action buttons and status */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleSave}
                disabled={isSaving || isLoading || title.trim().length === 0}
                className="flex items-center gap-2"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {id ? "Update" : "Save"}
              </Button>

              {id && (
                <Button
                  onClick={handleDelete}
                  variant="destructive"
                  disabled={isSaving || isLoading}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              )}

              {/* Publication toggle */}
              <div className="flex items-center gap-2">
                <Switch
                  id="publish-toggle"
                  checked={published}
                  onCheckedChange={setPublished}
                  disabled={isSaving || isLoading}
                />
                <Label htmlFor="publish-toggle">
                  {published ? "Published" : "Draft"}
                </Label>
              </div>
            </div>

            {/* Status information */}
            <div className="text-sm text-muted-foreground">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Loading...
                </span>
              ) : formattedLastSaved ? (
                <span>Last saved: {formattedLastSaved}</span>
              ) : null}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Editor component */}
      <div className="editor-container border rounded-md p-1">
        <SimpleEditor editor={editor} handleImageUpload={handleImageUpload} />
      </div>
    </div>
  );
}
