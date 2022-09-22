import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { load, save } from './storage';
import './Editor.css';
import Focus from '@tiptap/extension-focus';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import Image from '@tiptap/extension-image';

const PLACEHOLDER_TEXT = `Welcome to your TabSpace!
Treat this as your own little scratchspace in the comfort of your new tab page.
Markdown-like syntax is supported and notes are saved in real-time.

This is your new digital home, set it up however you'd like!
`

const Editor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'highlight'
          }
        }
      }),
      Focus.configure({
        mode: 'deepest',
      }),
      Link.configure({
        protocols: ['mailto'],
      }),
      Placeholder.configure({
        placeholder: PLACEHOLDER_TEXT,
      }),
      Typography,
      Image,
    ],
    content: load(),
    onUpdate: ({ editor }) => save(editor.getJSON())
  });


  useEffect(() => {
    const updateClosure = (event: StorageEvent) => {
      if (event.storageArea !== localStorage) return;
      if (event.key === 'blocks' && event.newValue !== null) {
        if (editor) {
          editor.commands.setContent(JSON.parse(event.newValue));
        }
      }
    };
    window.addEventListener('storage', updateClosure);
    return () => window.removeEventListener('storage', updateClosure);
  }, [editor]);

  if (!editor) {
    return null
  }

  return (
    <EditorContent editor={editor} />
  )
}

export default Editor
