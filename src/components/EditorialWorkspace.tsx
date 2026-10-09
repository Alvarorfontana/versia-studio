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

  const getEditorialCSS = (tpl: TemplateType) => {
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
        h2 { font-family: 'Inter', sans-serif; font-size: 10pt; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #666; margin-bottom: 16pt; text-align: center; }
        p { font-size: 10pt; line-height: 1.5; column-count: 3; column-gap: 16pt; text-align: justify; margin-bottom: 10pt; color: #222; }
        blockquote { font-family: 'Playfair Display', serif; font-size: 14pt; column-span: all; text-align: center; margin: 16pt 0; padding: 12pt; border-top: 1px solid #000; border-bottom: 1px solid #000; font-style: italic; }
        img { column-span: all; margin: 12pt 0; filter: grayscale(100%); }
      `,
      
      academico: `
        @page { size: A4; margin: 30mm 25mm; }
        body { font-family: 'Source Serif Pro', serif; color: #1a1a1a; }
        h1 { font-family: 'Source Serif Pro', serif; font-size: 20pt; font-weight: 700; margin-top: 30pt; margin-bottom: 16pt; color: #0f172a; }
        h2 { font-family: 'Source Serif Pro', serif; font-size: 14pt; font-weight: 600; margin-top: 24pt; margin-bottom: 12pt; color: #1e293b; }
        h3 { font-family: 'Source Serif Pro', serif; font-size: 12pt; font-weight: 600; font-style: italic; margin-top: 20pt; margin-bottom: 10pt; color: #334155; }
        p { font-size: 11pt; line-height: 1.8; text-align: justify; margin-bottom: 14pt; color: #334155; }
        blockquote { font-family: 'Source Serif Pro', serif; font-size: 10pt; margin: 16pt 30pt; padding: 8pt 16pt; border-left: 2px solid #64748b; font-style: italic; color: #475569; }
      `,
      
      fotografia: `
        @page { size: A4; margin: 0; }
        body { font-family: 'Inter', sans-serif; color: #1a1a1a; }
        h1 { font-family: 'Inter', sans-serif; font-size: 32pt; font-weight: 300; text-align: center; margin: 40pt 20pt 20pt 20pt; letter-spacing: 0.05em; }
        h2 { font-family: 'Inter', sans-serif; font-size: 10pt; font-weight: 500; text-transform: uppercase; letter-spacing: 0.2em; text-align: center; margin-bottom: 30pt; color: #64748b; }
        p { font-size: 10pt; line-height: 1.6; text-align: center; margin: 20pt 40pt; color: #475569; font-weight: 300; }
        blockquote { font-family: 'Inter', sans-serif; font-size: 14pt; text-align: center; margin: 30pt 40pt; font-weight: 300; font-style: italic; color: #334155; }
        img { width: 100%; height: auto; margin: 0; }
      `,

      clarin: `
        @page { size: A3; margin: 8mm 10mm; }
        body { font-family: 'Arial', sans-serif; color: #111; }
        h1 { font-family: 'Arial Black', sans-serif; font-size: 64pt; font-weight: 900; line-height: 0.95; margin-bottom: 8pt; text-align: center; letter-spacing: -0.02em; }
        h2 { font-family: 'Arial', sans-serif; font-size: 11pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #c41e3a; text-align: center; margin-bottom: 4pt; }
        h3 { font-family: 'Arial', sans-serif; font-size: 14pt; font-weight: 700; line-height: 1.3; margin-bottom: 16pt; text-align: center; color: #333; }
        p { font-size: 9.5pt; line-height: 1.4; column-count: 6; column-gap: 12pt; text-align: justify; margin-bottom: 8pt; color: #222; }
        blockquote { font-family: 'Arial', sans-serif; font-size: 12pt; font-weight: 700; background: #fff3cd; border: 2px solid #c41e3a; padding: 12pt; margin: 16pt 0; column-span: all; text-align: left; }
        img { column-span: all; margin: 12pt 0 8pt 0; width: 100%; height: auto; }
      `,

      lanacion: `
        @page { size: A3; margin: 15mm 20mm; }
        body { font-family: 'Georgia', serif; color: #1a1a1a; }
        h1 { font-family: 'Georgia', serif; font-size: 42pt; font-weight: 700; line-height: 1.1; margin-bottom: 12pt; text-align: center; color: #0f172a; }
        h2 { font-family: 'Arial', sans-serif; font-size: 10pt; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; color: #64748b; text-align: center; margin-bottom: 8pt; border-bottom: 1px solid #cbd5e1; padding-bottom: 8pt; }
        h3 { font-family: 'Georgia', serif; font-size: 16pt; font-weight: 400; font-style: italic; line-height: 1.4; margin-bottom: 20pt; text-align: center; color: #334155; }
        p { font-size: 10pt; line-height: 1.6; column-count: 5; column-gap: 16pt; text-align: justify; margin-bottom: 10pt; color: #1e293b; }
        blockquote { font-family: 'Georgia', serif; font-size: 14pt; font-style: italic; border-left: 3px solid #0f172a; padding: 12pt 0 12pt 20pt; margin: 20pt 0; column-span: all; color: #334155; }
        img { column-span: all; margin: 16pt 0 8pt 0; width: 100%; height: auto; }
      `,

      pagina12: `
        @page { size: A3; margin: 10mm 12mm; }
        body { font-family: 'Arial', sans-serif; color: #111; }
        h1 { font-family: 'Arial Black', sans-serif; font-size: 48pt; font-weight: 900; line-height: 1; margin-bottom: 10pt; text-align: left; color: #c41e3a; }
        h2 { font-family: 'Arial', sans-serif; font-size: 12pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #1e293b; margin-bottom: 6pt; }
        h3 { font-family: 'Arial', sans-serif; font-size: 13pt; font-weight: 600; line-height: 1.3; margin-bottom: 16pt; color: #334155; }
        p { font-size: 9.5pt; line-height: 1.5; column-count: 5; column-gap: 14pt; text-align: justify; margin-bottom: 8pt; color: #1e293b; }
        blockquote { font-family: 'Arial', sans-serif; font-size: 11pt; font-weight: 700; background: #1e293b; color: white; padding: 16pt; margin: 16pt 0; column-span: all; }
        img { column-span: all; margin: 12pt 0; width: 100%; height: auto; }
      `
    };

    return base + templates[tpl];
  };

  const updateViewer = (htmlContent: string) => {
    if (viewerRef.current && viewerRef.current.contentWindow) {
      const doc = viewerRef.current.contentWindow.document;
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>${getEditorialCSS(template as TemplateType)}</style>
        </head>
        <body>${htmlContent}</body>
        </html>
      `);
      doc.close();
    }
  };

  useEffect(() => {
    if (content) updateViewer(content);
  }, [template, content]);

  const handleExportPDF = () => {
    if (viewerRef.current && viewerRef.current.contentWindow) {
      viewerRef.current.contentWindow.print();
    }
  };

  if (!editor) return null;

  const templates = [
    { id: 'informe', name: 'Informe Ejecutivo', icon: FileBarChart, color: 'blue' },
    { id: 'revista', name: 'Revista Premium', icon: Palette, color: 'red' },
    { id: 'libro', name: 'Libro Literario', icon: BookOpen, color: 'amber' },
    { id: 'periodico', name: 'Periódico Clásico', icon: Newspaper, color: 'gray' },
    { id: 'academico', name: 'Académico', icon: GraduationCap, color: 'purple' },
    { id: 'fotografia', name: 'Fotografía', icon: Camera, color: 'slate' },
    { id: 'clarin', name: 'Clarín', icon: Newspaper, color: 'red' },
    { id: 'lanacion', name: 'La Nación', icon: Newspaper, color: 'slate' },
    { id: 'pagina12', name: 'Página/12', icon: Newspaper, color: 'red' }
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans overflow-hidden">
      <div className="w-1/2 flex flex-col border-r border-slate-200 bg-white shadow-2xl z-10">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-
