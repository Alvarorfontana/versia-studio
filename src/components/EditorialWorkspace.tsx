import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Typography from '@tiptap/extension-typography';
import Placeholder from '@tiptap/extension-placeholder';
import { Renderer } from '@vivliostyle/react';
import { useDocumentStore } from '../store/useDocumentStore';
import { FileText, Eye, Download, BookOpen, Newspaper, FileBarChart } from 'lucide-react';

export default function EditorialWorkspace() {
  const { title, template, content, setTitle, setContent, saveToLocal } = useDocumentStore();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Typography,
      Placeholder.configure({ placeholder: 'Escribí o pegá tu manuscrito aquí...' }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] p-6',
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  useEffect(() => {
    useDocumentStore.getState().loadFromLocal();
  }, []);

  const getEditorialCSS = () => {
    const base = `
      @page { size: A4; margin: 25mm 20mm; }
      body { font-family: 'Georgia', serif; color: #111; }
      h1 { font-family: 'Merriweather', serif; font-size: 24pt; font-weight: 900; line-height: 1.1; margin-bottom: 12pt; page-break-after: avoid; }
      h2 { font-family: 'Merriweather', serif; font-size: 16pt; font-weight: 700; margin-top: 24pt; margin-bottom: 12pt; page-break-after: avoid; }
      p { font-size: 11pt; line-height: 1.6; text-align: justify; margin-bottom: 12pt; hyphens: auto; }
      blockquote { font-family: 'Merriweather', serif; font-size: 12pt; border-left: 3pt solid #333; margin: 16pt 0; padding-left: 12pt; font-style: italic; color: #444; }
    `;
    
    if (template === 'revista') {
      return base + `
        @page { margin: 15mm 15mm; }
        p { column-count: 2; column-gap: 12pt; text-align: justify; }
        h1 { font-size: 32pt; color: #c00; column-span: all; text-align: center; margin-bottom: 24pt; }
      `;
    }
    if (template === 'libro') {
      return base + `
        @page { margin: 25mm 30mm; }
        p { text-indent: 12pt; text-align: justify; }
        p:first-of-type { text-indent: 0; }
      `;
    }
    return base;
  };

  const handleExportPDF = () => {
    saveToLocal();
    window.print();
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      <div className="w-5/12 flex flex-col border-r border-gray-300 bg-white shadow-sm z-10">
        <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <FileText size={18} /> Versia Studio
          </div>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            className="bg-gray-800 text-white text-sm px-2 py-1 rounded border border-gray-700 focus:outline-none focus:border-blue-500 w-48 text-right"
            placeholder="Nombre del proyecto"
          />
        </div>

        <div className="flex gap-2 p-3 border-b border-gray-200 bg-gray-50">
          <button onClick={() => useDocumentStore.getState().setTemplate('informe')} className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium transition ${template === 'informe' ? 'bg-blue-100 text-blue-800' : 'bg-white text-gray-600 hover:bg-gray-200'}`}><FileBarChart size={14}/> Informe</button>
          <button onClick={() => useDocumentStore.getState().setTemplate('revista')} className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium transition ${template === 'revista' ? 'bg-blue-100 text-blue-800' : 'bg-white text-gray-600 hover:bg-gray-200'}`}><Newspaper size={14}/> Revista</button>
          <button onClick={() => useDocumentStore.getState().setTemplate('libro')} className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium transition ${template === 'libro' ? 'bg-blue-100 text-blue-800' : 'bg-white text-gray-600 hover:bg-gray-200'}`}><BookOpen size={14}/> Libro</button>
        </div>

        <div className="flex-1 overflow-auto">
          <EditorContent editor={editor} />
        </div>
      </div>

      <div className="w-7/12 flex flex-col bg-gray-200 relative">
        <div className="bg-gray-800 text-white p-3 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-2 font-semibold">
            <Eye size={18} /> Vista Previa ({template.toUpperCase()})
          </div>
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm font-medium transition"
          >
            <Download size={16} /> Exportar PDF
          </button>
        </div>

        <div className="flex-1 overflow-auto p-8 flex justify-center bg-gray-300">
          <div 
            className="bg-white shadow-2xl transition-all duration-300" 
            style={{ 
              width: '210mm', 
              minHeight: '297mm',
              WebkitPrintColorAdjust: 'exact',
              printColorAdjust: 'exact'
            }}
          >
            <Renderer 
              html={content} 
              customStyle={getEditorialCSS()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
