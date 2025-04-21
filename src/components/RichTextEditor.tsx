// "use client";
// import React from 'react';
// import { useEditor, EditorContent, Editor } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Image from '@tiptap/extension-image';
// import Placeholder from '@tiptap/extension-placeholder';
// import Link from '@tiptap/extension-link';
// import { Button } from '@/components/ui/button';
// import { cn } from '@/lib/utils';

// interface RichTextEditorProps {
//   content: string;
//   onChange: (content: string) => void;
//   placeholder?: string;
// }

// const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
//   content, 
//   onChange,
//   placeholder = 'Start writing your story...' 
// }) => {
//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Image,
//       Link.configure({
//         openOnClick: false,
//       }),
//       Placeholder.configure({
//         placeholder,
//       }),
//     ],
//     content,
//     onUpdate: ({ editor }) => {
//       onChange(editor.getHTML());
//     },
//     editorProps: {
//       attributes: {
//         class: 'prose dark:prose-invert prose-slate max-w-none focus:outline-none min-h-[200px]',
//       },
//     },
//   });

//   if (!editor) {
//     return null;
//   }

//   // Helper function for toolbar buttons
//   const ToolbarButton = ({ 
//     isActive = false, 
//     onClick, 
//     children 
//   }: { 
//     isActive?: boolean; 
//     onClick: () => void; 
//     children: React.ReactNode 
//   }) => {
//     return (
//       <Button
//         type="button"
//         variant={isActive ? "secondary" : "ghost"}
//         size="sm"
//         onClick={onClick}
//         className={cn(
//           "h-8 px-2.5",
//           isActive && "bg-slate-200 dark:bg-slate-700"
//         )}
//       >
//         {children}
//       </Button>
//     );
//   };

//   // Add image handler
//   const addImage = () => {
//     const url = window.prompt('Enter image URL');
//     if (url) {
//       editor.chain().focus().setImage({ src: url }).run();
//     }
//   };

//   // Add link handler
//   const setLink = () => {
//     const previousUrl = editor.getAttributes('link').href;
//     const url = window.prompt('Enter link URL', previousUrl);
    
//     if (url === null) {
//       return;
//     }
    
//     if (url === '') {
//       editor.chain().focus().extendMarkRange('link').unsetLink().run();
//       return;
//     }
    
//     editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
//   };

//   return (
//     <div className="rich-text-editor w-full">
//       <div className="editor-toolbar flex flex-wrap gap-1 mb-3 pb-2 border-b dark:border-slate-700">
//         {/* Text formatting */}
//         <div className="flex gap-1 mr-2">
//           <ToolbarButton 
//             onClick={() => editor.chain().focus().toggleBold().run()}
//             isActive={editor.isActive('bold')}
//           >
//             <span className="font-bold">B</span>
//           </ToolbarButton>
          
//           <ToolbarButton 
//             onClick={() => editor.chain().focus().toggleItalic().run()}
//             isActive={editor.isActive('italic')}
//           >
//             <span className="italic">I</span>
//           </ToolbarButton>
          
//           <ToolbarButton 
//             onClick={() => editor.chain().focus().toggleStrike().run()}
//             isActive={editor.isActive('strike')}
//           >
//             <span className="line-through">S</span>
//           </ToolbarButton>
          
//           <ToolbarButton 
//             onClick={() => editor.chain().focus().toggleCode().run()}
//             isActive={editor.isActive('code')}
//           >
//             <span className="font-mono">{'<>'}</span>
//           </ToolbarButton>
//         </div>
        
//         {/* Headings */}
//         <div className="flex gap-1 mr-2">
//           <ToolbarButton 
//             onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
//             isActive={editor.isActive('heading', { level: 1 })}
//           >
//             H1
//           </ToolbarButton>
          
//           <ToolbarButton 
//             onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
//             isActive={editor.isActive('heading', { level: 2 })}
//           >
//             H2
//           </ToolbarButton>
          
//           <ToolbarButton 
//             onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
//             isActive={editor.isActive('heading', { level: 3 })}
//           >
//             H3
//           </ToolbarButton>
//         </div>
        
//         {/* Lists */}
//         <div className="flex gap-1 mr-2">
//           <ToolbarButton 
//             onClick={() => editor.chain().focus().toggleBulletList().run()}
//             isActive={editor.isActive('bulletList')}
//           >
//             • List
//           </ToolbarButton>
          
//           <ToolbarButton 
//             onClick={() => editor.chain().focus().toggleOrderedList().run()}
//             isActive={editor.isActive('orderedList')}
//           >
//             1. List
//           </ToolbarButton>
//         </div>
        
//         {/* Quote & Divider */}
//         <div className="flex gap-1 mr-2">
//           <ToolbarButton 
//             onClick={() => editor.chain().focus().toggleBlockquote().run()}
//             isActive={editor.isActive('blockquote')}
//           >
//             Quote
//           </ToolbarButton>
          
//           <ToolbarButton 
//             onClick={() => editor.chain().focus().setHorizontalRule().run()}
//           >
//             Divider
//           </ToolbarButton>
//         </div>
        
//         {/* Media & Links */}
//         <div className="flex gap-1">
//           <ToolbarButton onClick={addImage}>
//             Image
//           </ToolbarButton>
          
//           <ToolbarButton 
//             onClick={setLink}
//             isActive={editor.isActive('link')}
//           >
//             Link
//           </ToolbarButton>
//         </div>
//       </div>
      
//       <div className="border rounded-md dark:border-slate-700 p-3">
//         <EditorContent editor={editor} className="min-h-[300px]" />
//       </div>
//     </div>
//   );
// };

// export default RichTextEditor;

'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const RichTextEditor = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Hello World! 🌎️</p>',
  })

  return <EditorContent editor={editor} />
}

export default RichTextEditor
