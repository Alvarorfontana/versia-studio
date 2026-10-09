import React, { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Typography from '@tiptap/extension-typography';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { useDocumentStore } from '../store/useDocumentStore';
import { Bold, Italic, Heading1, Heading2, Quote, ImageIcon, AlignLeft, AlignCenter, Download, BookOpen, Newspaper, FileBarChart } from 'lucide-react';

export default function EditorialWorkspace() {
  const { title, template, content, setTitle, setContent } = useDocumentStore();
  const viewerRef = useRef<HTMLIFrameElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2] } }),
      Typography,
      Placeholder.configure({ placeholder: 'Escribí o pegá tu manuscrito aquí. Usá la barra de herramientas para dar formato editorial.' }),
      Image.configure({ inline: false, allowBase64: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: content,
    editorProps: {
      attributes: { class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] p-6' },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
      updateVivliostyle(html);
    },
  });

  useEffect(() => {
    useDocumentStore.getState().loadFromLocal();
  }, []);

  const updateVivliostyle = (htmlContent: string) => {
    if (viewerRef.current && viewerRef.current.contentWindow) {
      const doc = viewerRef.current.contentWindow.document;
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;0,900;1,400&family=Georgia&display=swap" rel="stylesheet">
          <style>
            @page { size: A4; margin: 25mm 20mm; }
            body { font-family: 'Georgia', serif; color: #111; }
            h1 { font-family: 'Merriweather', serif; font-size: 26pt; font-weight: 900; line-height: 1.1; margin-bottom: 12pt; page-break-after: avoid; }
            h2 { font-family: 'Merriweather', serif; font-size: 14pt; font-weight: 700; margin-top: 24pt; margin-bottom: 12pt; text-transform: uppercase; letter-spacing: 0.05em; page-break-after: avoid; }
            p { font-size: 11.5pt; line-height: 1.65; text-align: justify; margin-bottom: 14pt; hyphens: auto; }
            blockquote { font-family: 'Merriweather', serif; font-size: 13pt; border-left: 4pt solid #c00; margin: 20pt 0; padding: 10pt 0 10pt 16pt; font-style: italic; color: #444; background: #fafafa; }
            img { max-width: 100%; height: auto; margin: 16pt 0 8pt 0; display: block; page-break-inside: avoid; }
            
            ${template === 'revista' ? `
              @page { margin: 15mm 15mm; }
              p { column-count: 2; column-gap: 16pt; }
              h1 { font-size: 34pt; color: #c00; column-span: all; text-align: center; margin-bottom: 24pt; border-bottom: 2pt solid #c00; padding-bottom: 12pt; }
              img { column-span: all; margin: 20pt 0; }
            ` : ''}
            ${template === 'libro' ? `
              @page { margin: 25mm 30mm; }
              p { text-indent: 14pt; }
              p:first-of-type { text-indent: 0; }
              h1 { text-align: center; margin-top: 40pt; }
            ` : ''}
          </style>
        </head>
        <body>${htmlContent}</body>
        </html>
      `);
      doc.close();
    }
  };

  useEffect(() => {
    if (content) updateVivliostyle(content);
  }, [template, content]);

  const handleExportPDF = () => {
    if (viewerRef.current && viewerRef.current.contentWindow) {
      viewerRef.current.contentWindow.print();
    }
  };

  if (!editor) return null;

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      <div className="w-1/2 flex flex-col border-r border-gray-200 bg-white shadow-xl z-10">
        <div className="bg-gray-900 text-white p-4 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <FileBarChart className="text-blue-400" size={20} /> Versia Studio
          </div>
          <input 
            type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            className="bg-gray-800 text-gray-200 text-sm px-3 py-1.5 rounded border border-gray-700 focus:outline-none focus:border-blue-500 w-56 text-right"
            placeholder="Nombre del proyecto"
          />
        </div>

        <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
          <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200 text-blue-700' : 'text-gray-700'}`} title="Negrita"><Bold size={18}/></button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200 text-blue-700' : 'text-gray-700'}`} title="Cursiva"><Italic size={18}/></button>
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 text-blue-700' : 'text-gray-700'}`} title="Título 1"><Heading1 size={18}/></button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-blue-700' : 'text-gray-700'}`} title="Título 2"><Heading2 size={18}/></button>
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-200 text-blue-700' : 'text-gray-700'}`} title="Cita"><Quote size={18}/></button>
          <button onClick={() => { const url = window.prompt('URL de la imagen:'); if(url) editor.chain().focus().setImage({ src: url }).run(); }} className="p-2 rounded hover:bg-gray-200 text-gray-700" title="Imagen"><ImageIcon size={18}/></button>
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200 text-blue-700' : 'text-gray-700'}`} title="Izquierda"><AlignLeft size={18}/></button>
          <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200 text-blue-700' : 'text-gray-700'}`} title="Centro"><AlignCenter size={18}/></button>
        </div>

        <div className="flex-1 overflow-auto bg-white">
          <EditorContent editor={editor} />
        </div>
      </div>

      <div className="w-1/2 flex flex-col bg-gray-200 relative">
        <div className="bg-white border-b border-gray-200 p-3 flex items-center justify-between shadow-sm z-10">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button onClick={() => useDocumentStore.getState().setTemplate('informe')} className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold transition ${template === 'informe' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}><FileBarChart size={14}/> Informe</button>
            <button onClick={() => useDocumentStore.getState().setTemplate('revista')} className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold transition ${template === 'revista' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}><Newspaper size={14}/> Revista</button>
            <button onClick={() => useDocumentStore.getState().setTemplate('libro')} className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold transition ${template === 'libro' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}><BookOpen size={14}/> Libro</button>
          </div>
          <button onClick={handleExportPDF} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-bold transition shadow-md">
            <Download size={16} /> Exportar PDF
          </button>
        </div>

        <div className="flex-1 overflow-auto p-8 flex justify-center bg-gray-300">
          <iframe 
            ref={viewerRef}
            className="bg-white shadow-2xl border border-gray-400"
            style={{ width: '210mm', height: '297mm', border: 'none' }}
            title="Vista previa de maquetación"
          />
        </div>
      </div>
    </div>
  );
}
