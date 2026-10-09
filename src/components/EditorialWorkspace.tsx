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

type TemplateType = 'informe' | 'revista' | 'libro' | 'periodico' | 'academico' | 'fotografia';

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
    { id: 'fotografia', name: 'Fotografía', icon: Camera, color: 'slate' }
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans overflow-hidden">
      {/* PANEL IZQUIERDO: Editor Premium */}
      <div className="w-1/2 flex flex-col border-r border-slate-200 bg-white shadow-2xl z-10">
        {/* Header */}
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
            className="bg-slate-800 text-slate-200 text-sm px-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 w-64 text-right transition-all"
            placeholder="Título del proyecto"
          />
        </div>

        {/* Barra de Herramientas Premium */}
        <div className="flex flex-wrap gap-1 p-3 border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
          <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2.5 rounded-lg hover:bg-slate-200 transition ${editor.isActive('bold') ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-slate-700'}`} title="Negrita"><Bold size={18}/></button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2.5 rounded-lg hover:bg-slate-200 transition ${editor.isActive('italic') ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-slate-700'}`} title="Cursiva"><Italic size={18}/></button>
          <div className="w-px h-8 bg-slate-300 mx-1"></div>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-2.5 rounded-lg hover:bg-slate-200 transition ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-slate-700'}`} title="Título 1"><Heading1 size={18}/></button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2.5 rounded-lg hover:bg-slate-200 transition ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-slate-700'}`} title="Título 2"><Heading2 size={18}/></button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`p-2.5 rounded-lg hover:bg-slate-200 transition ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-slate-700'}`} title="Título 3"><Heading3 size={18}/></button>
          <div className="w-px h-8 bg-slate-300 mx-1"></div>
          <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-2.5 rounded-lg hover:bg-slate-200 transition ${editor.isActive('blockquote') ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-slate-700'}`} title="Cita"><Quote size={18}/></button>
          <button onClick={() => { const url = window.prompt('URL de la imagen:'); if(url) editor.chain().focus().setImage({ src: url }).run(); }} className="p-2.5 rounded-lg hover:bg-slate-200 text-slate-700 transition" title="Imagen"><ImageIcon size={18}/></button>
          <div className="w-px h-8 bg-slate-300 mx-1"></div>
          <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`p-2.5 rounded-lg hover:bg-slate-200 transition ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-slate-700'}`} title="Izquierda"><AlignLeft size={18}/></button>
          <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`p-2.5 rounded-lg hover:bg-slate-200 transition ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-slate-700'}`} title="Centro"><AlignCenter size={18}/></button>
          <button onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={`p-2.5 rounded-lg hover:bg-slate-200 transition ${editor.isActive({ textAlign: 'justify' }) ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-slate-700'}`} title="Justificado"><AlignJustify size={18}/></button>
        </div>

        {/* Área de Edición */}
        <div className="flex-1 overflow-auto bg-white">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* PANEL DERECHO: Vista Previa Premium */}
      <div className="w-1/2 flex flex-col bg-slate-100 relative">
        {/* Selector de Plantillas */}
        <div className="bg-white border-b border-slate-200 p-4 shadow-sm z-10">
          <div className="grid grid-cols-3 gap-2 mb-3">
            {templates.map((tpl) => {
              const Icon = tpl.icon;
              return (
                <button 
                  key={tpl.id}
                  onClick={() => useDocumentStore.getState().setTemplate(tpl.id as TemplateType)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    template === tpl.id 
                      ? `bg-${tpl.color}-100 text-${tpl.color}-700 shadow-md ring-2 ring-${tpl.color}-500` 
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

        {/* Vista Previa */}
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
