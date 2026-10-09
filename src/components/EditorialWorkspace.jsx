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

export default function EditorialWorkspace() {
  const { title, template, content, setTitle, setContent } = useDocumentStore();
  const viewerRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Typography,
      Placeholder.configure({ placeholder: 'Comenzá a escribir...' }),
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

  function getEditorialCSS(tpl) {
    const base = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Source+Serif+Pro:wght@400;600;700&family=Inter:wght@300;400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
      body { margin: 0; padding: 0; }
      img { max-width: 100%; height: auto; display: block; margin: 16pt 0; }
    `;

    if (tpl === 'informe') {
      return base + `
        @page { size: A4; margin: 25mm 20mm; }
        body { font-family: 'Inter', sans-serif; color: #1a1a1a; }
        h1 { font-size: 28pt; font-weight: 700; border-bottom: 3px solid #3b82f6; padding-bottom: 12pt; }
        p { font-size: 11pt; line-height: 1.7; text-align: justify; }
      `;
    }
    if (tpl === 'revista') {
      return base + `
        @page { size: A4; margin: 15mm 15mm; }
        body { font-family: 'Playfair Display', serif; }
        h1 { font-size: 42pt; font-weight: 900; color: #c41e3a; text-align: center; }
        p { font-size: 11pt; column-count: 2; column-gap: 20pt; text-align: justify; }
      `;
    }
    if (tpl === 'libro') {
      return base + `
        @page { size: A5; margin: 20mm 25mm; }
        body { font-family: 'Crimson Text', serif; }
        h1 { font-size: 24pt; text-align: center; margin-top: 40pt; }
        p { font-size: 11pt; text-indent: 14pt; text-align: justify; }
      `;
    }
    if (tpl === 'periodico') {
      return base + `
        @page { size: A3; margin: 10mm 15mm; }
        body { font-family: 'Georgia', serif; }
        h1 { font-size: 36pt; text-align: center; border-bottom: 2px solid #000; }
        p { font-size: 10pt; column-count: 3; column-gap: 16pt; text-align: justify; }
      `;
    }
    if (tpl === 'academico') {
      return base + `
        @page { size: A4; margin: 30mm 25mm; }
        body { font-family: 'Source Serif Pro', serif; }
        h1 { font-size: 20pt; margin-top: 30pt; }
        p { font-size: 11pt; line-height: 1.8; text-align: justify; }
      `;
    }
    if (tpl === 'fotografia') {
      return base + `
        @page { size: A4; margin: 0; }
        body { font-family: 'Inter', sans-serif; }
        h1 { font-size: 32pt; font-weight: 300; text-align: center; margin: 40pt 20pt; }
        p { font-size: 10pt; text-align: center; margin: 20pt 40pt; }
        img { width: 100%; margin: 0; }
      `;
    }
    if (tpl === 'clarin') {
      return base + `
        @page { size: A3; margin: 8mm 10mm; }
        body { font-family: 'Arial', sans-serif; }
        h1 { font-family: 'Arial Black'; font-size: 64pt; text-align: center; line-height: 0.95; }
        h2 { font-size: 11pt; color: #c41e3a; text-align: center; text-transform: uppercase; }
        p { font-size: 9.5pt; column-count: 6; column-gap: 12pt; text-align: justify; }
      `;
    }
    if (tpl === 'lanacion') {
      return base + `
        @page { size: A3; margin: 15mm 20mm; }
        body { font-family: 'Georgia', serif; }
        h1 { font-size: 42pt; text-align: center; }
        h2 { font-size: 10pt; color: #64748b; text-align: center; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; }
        p { font-size: 10pt; column-count: 5; column-gap: 16pt; text-align: justify; }
      `;
    }
    if (tpl === 'pagina12') {
      return base + `
        @page { size: A3; margin: 10mm 12mm; }
        body { font-family: 'Arial', sans-serif; }
        h1 { font-family: 'Arial Black'; font-size: 48pt; color: #c41e3a; }
        h2 { font-size: 12pt; text-transform: uppercase; }
        p { font-size: 9.5pt; column-count: 5; column-gap: 14pt; text-align: justify; }
      `;
    }
    return base;
  }

  const updateViewer = (htmlContent) => {
    if (viewerRef.current && viewerRef.current.contentWindow) {
      const doc = viewerRef.current.contentWindow.document;
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>${getEditorialCSS(template)}</style>
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

  const templatesList = [
    { id: 'informe', name: 'Informe', icon: FileBarChart },
    { id: 'revista', name: 'Revista', icon: Palette },
    { id: 'libro', name: 'Libro', icon: BookOpen },
    { id: 'periodico', name: 'Periódico', icon: Newspaper },
    { id: 'academico', name: 'Académico', icon: GraduationCap },
    { id: 'fotografia', name: 'Fotografía', icon: Camera },
    { id: 'clarin', name: 'Clarín', icon: Newspaper },
    { id: 'lanacion', name: 'La Nación', icon: Newspaper },
    { id: 'pagina12', name: 'Página/12', icon: Newspaper }
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans overflow-hidden">
      <div className="w-1/2 flex flex-col border-r border-slate-200 bg-white shadow-2xl z-10">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <FileText className="text-white" size={20} />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">Versia Studio</h1>
              <p className="text-xs text-slate-400">Editorial Profesional</p>
            </div>
          </div>
          <input 
            type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            className="bg-slate-800 text-slate-200 text-sm px-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 w-64 text-right"
            placeholder="Título del proyecto"
          />
        </div>

        <div className="flex flex-wrap gap-1 p-3 border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
          <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2.5 rounded-lg hover:bg-slate-200 ${editor.isActive('bold') ? 'bg-blue-100 text-blue-700' : 'text-slate-700'}`}><Bold size={18}/></button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2.5 rounded-lg hover:bg-slate-200 ${editor.isActive('italic') ? 'bg-blue-100 text-blue-700' : 'text-slate-700'}`}><Italic size={18}/></button>
          <div className="w-px h-8 bg-slate-300 mx-1"></div>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-2.5 rounded-lg hover:bg-slate-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-100 text-blue-700' : 'text-slate-700'}`}><Heading1 size={18}/></button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2.5 rounded-lg hover:bg-slate-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-700' : 'text-slate-700'}`}><Heading2 size={18}/></button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`p-2.5 rounded-lg hover:bg-slate-200 ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-100 text-blue-700' : 'text-slate-700'}`}><Heading3 size={18}/></button>
          <div className="w-px h-8 bg-slate-300 mx-1"></div>
          <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-2.5 rounded-lg hover:bg-slate-200 ${editor.isActive('blockquote') ? 'bg-blue-100 text-blue-700' : 'text-slate-700'}`}><Quote size={18}/></button>
          <button onClick={() => { const url = window.prompt('URL de la imagen:'); if(url) editor.chain().focus().setImage({ src: url }).run(); }} className="p-2.5 rounded-lg hover:bg-slate-200 text-slate-700"><ImageIcon size={18}/></button>
          <div className="w-px h-8 bg-slate-300 mx-1"></div>
          <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`p-2.5 rounded-lg hover:bg-slate-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-100 text-blue-700' : 'text-slate-700'}`}><AlignLeft size={18}/></button>
          <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`p-2.5 rounded-lg hover:bg-slate-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-100 text-blue-700' : 'text-slate-700'}`}><AlignCenter size={18}/></button>
          <button onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={`p-2.5 rounded-lg hover:bg-slate-200 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-blue-100 text-blue-700' : 'text-slate-700'}`}><AlignJustify size={18}/></button>
        </div>

        <div className="flex-1 overflow-auto bg-white">
          <EditorContent editor={editor} />
        </div>
      </div>

      <div className="w-1/2 flex flex-col bg-slate-100 relative">
        <div className="bg-white border-b border-slate-200 p-4 shadow-sm z-10">
          <div className="grid grid-cols-3 gap-2 mb-3 max-h-48 overflow-y-auto">
            {templatesList.map((tpl) => {
              const Icon = tpl.icon;
              return (
                <button 
                  key={tpl.id}
                  onClick={() => useDocumentStore.getState().setTemplate(tpl.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    template === tpl.id 
                      ? 'bg-blue-100 text-blue-700 shadow-md ring-2 ring-blue-500' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Icon size={14}/> {tpl.name}
                </button>
              );
            })}
          </div>
          <div className="flex justify-end">
            <button onClick={handleExportPDF} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg hover:shadow-xl">
              <Download size={16} /> Exportar PDF
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-8 flex justify-center bg-gradient-to-br from-slate-200 to-slate-300">
          <iframe 
            ref={viewerRef}
            className="bg-white shadow-2xl rounded-lg"
            style={{ width: '210mm', height: '297mm', border: 'none' }}
            title="Vista previa editorial"
          />
        </div>
      </div>
    </div>
  );
}
