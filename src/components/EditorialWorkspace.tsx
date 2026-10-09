import React, { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Typography from '@tiptap/extension-typography';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { useDocumentStore } from '../store/useDocumentStore';
import { 
  Bold, Italic, Heading1, Heading2, Heading3, Quote, 
  ImageIcon, AlignLeft, AlignCenter, AlignJustify,
  Download, BookOpen, Newspaper, FileBarChart, 
  FileText, GraduationCap, Camera, Palette
} from 'lucide-react';

type TemplateType = 'informe' | 'revista' | 'libro' | 'periodico' | 'academico' | 'fotografia' | 'clarin' | 'lanacion' | 'pagina12';

export default function EditorialWorkspace() {
  const { title, template, content, setTitle, setContent } = useDocumentStore();
  const viewerRef = useRef<HTMLIFrameElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Typography,
      Placeholder.configure({ placeholder: 'Comenzá a escribir tu obra maestra editorial...' }),
      Image.configure({ inline: false, allowBase64: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: content,
    editorProps: {
      attributes: { class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] p-8' },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  useEffect(() => {
    useDocumentStore.getState().loadFromLocal();
  }, []);

  const getEditorialCSS = (tpl: TemplateType): string => {
    const base = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Source+Serif+Pro:wght@400;600;700&family=Inter:wght@300;400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
      body { margin: 0; padding: 0; }
      img { max-width: 100%; height: auto; display: block; margin: 16pt 0; }
    `;

    const templates: Record<TemplateType, string> = {
      informe: `
        @page { size: A4; margin: 25mm 20mm; }
        body { font-family: 'Inter', sans-serif; color: #1a1a1a; line-height: 1.6; }
        h1 { font-family: 'Inter', sans-serif; font-size: 28pt; font-weight: 700; color: #0f172a; margin-bottom: 16pt; border-bottom: 3px solid #3b82f6; padding-bottom: 12pt; }
        h2 { font-family: 'Inter', sans-serif; font-size: 18pt; font-weight: 600; color: #1e293b; margin-top: 24pt; margin-bottom: 12pt; }
        h3 { font-family: 'Inter', sans-serif; font-size: 14pt; font-weight: 600; color: #334155; margin-top: 20pt; margin-bottom: 10pt; }
        p { font-size: 11pt; line-height: 1.7; text-align: justify; margin-bottom: 12pt; color: #334155; }
        blockquote { font-family: 'Source Serif Pro', serif; font-size: 13pt; border-left: 4px solid #3b82f6; margin: 20pt 0; padding: 12pt 0 12pt 20pt; font-style: italic; color: #475569; background: #f8fafc; }
      `,
      revista: `
        @page { size: A4; margin: 15mm 15mm; }
        body { font-family: 'Playfair Display', serif; color: #1a1a1a; }
        h1 { font-family: 'Playfair Display', serif; font-size: 42pt; font-weight: 900; color: #c41e3a; text-align: center; margin-bottom: 24pt; letter-spacing: -0.02em; line-height: 1.1; }
        h2 { font-family: 'Inter', sans-serif; font-size: 12pt; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; margin-top: 24pt; margin-bottom: 12pt; }
        p { font-family: 'Source Serif Pro', serif; font-size: 11pt; line-height: 1.8; column-count: 2; column-gap: 20pt; text-align: justify; margin-bottom: 14pt; color: #334155; }
        p:first-of-type::first-letter { font-size: 48pt; float: left; line-height: 1; margin-right: 8pt; margin-top: 4pt; font-family: 'Playfair Display', serif; font-weight: 900; color: #c41e3a; }
        blockquote { font-family: 'Playfair Display', serif; font-size: 16pt; text-align: center; margin: 24pt 0; padding: 20pt; border-top: 2px solid #c41e3a; border-bottom: 2px solid #c41e3a; font-style: italic; color: #1e293b; column-span: all; }
        img { column-span: all; margin: 20pt 0; }
      `,
      libro: `
        @page { size: A5; margin: 20mm 25mm; }
        body { font-family: 'Crimson Text', serif; color: #2c2c2c; }
        h1 { font-family: 'Playfair Display', serif; font-size: 24pt; font-weight: 700; text-align: center; margin-top: 40pt; margin-bottom: 20pt; color: #1a1a1a; }
        h2 { font-family: 'Playfair Display', serif; font-size: 16pt; font-weight: 600; margin-top: 24pt; margin-bottom: 12pt; color: #333; }
        p { font-size: 11pt; line-height: 1.7; text-indent: 14pt; text-align: justify; margin-bottom: 10pt; color: #333; }
        p:first-of-type { text-indent: 0; }
        blockquote { font-family: 'Crimson Text', serif; font-size: 12pt; margin: 20pt 20pt; padding: 12pt 20pt; border-left: 3px solid #8b7355; font-style: italic; color: #555; background: #faf8f5; }
      `,
      periodico: `
        @page { size: A3; margin: 10mm 15mm; }
        body { font-family: 'Georgia', serif; color: #111; }
        h1 { font-family: 'Playfair Display', serif; font-size: 36pt; font-weight: 900; text-align: center; margin-bottom: 8pt; line-height: 1.1; border-bottom: 2px solid #000; padding-bottom: 12pt; }
        h2 { font-family: 'Inter', sans-serif; font-size: 10pt; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #666; margin
