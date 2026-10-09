import { useMemo, useRef, type ChangeEvent } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Typography from '@tiptap/extension-typography';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import {
  Bold, Italic, Heading1, Heading2, Heading3, Quote,
  ImageIcon, Upload, AlignLeft, AlignCenter, AlignJustify,
  Download, BookOpen, Newspaper, FileBarChart,
  FileText, GraduationCap, Camera, Palette,
  type LucideIcon,
} from 'lucide-react';
import { useDocumentStore } from '../store/useDocumentStore';
import { TEMPLATES, TEMPLATE_IDS, PAGE_MM, buildDocument, type TemplateId } from '../templates';

const TEMPLATE_ICONS: Record<TemplateId, LucideIcon> = {
  informe: FileBarChart,
  revista: Palette,
  libro: BookOpen,
  periodico: Newspaper,
  academico: GraduationCap,
  fotografia: Camera,
  clarin: Newspaper,
  lanacion: Newspaper,
  pagina12: Newspaper,
};

/** Reduce la imagen local para que quepa en el guardado del navegador. */
function compressImage(file: File, maxSize = 1600, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = () => reject(new Error('No se pudo leer la imagen'));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas no disponible'));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

interface ToolButtonProps {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function ToolButton({ label, active = false, onClick, children }: ToolButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`p-2.5 rounded-lg hover:bg-slate-200 ${active ? 'bg-blue-100 text-blue-700' : 'text-slate-700'}`}
    >
      {children}
    </button>
  );
}

const Divider = () => <div className="w-px h-8 bg-slate-300 mx-1" />;

export default function EditorialWorkspace() {
  const title = useDocumentStore((s) => s.title);
  const template = useDocumentStore((s) => s.template);
  const content = useDocumentStore((s) => s.content);
  const setTitle = useDocumentStore((s) => s.setTitle);
  const setTemplate = useDocumentStore((s) => s.setTemplate);
  const setContent = useDocumentStore((s) => s.setContent);

  const viewerRef = useRef<HTMLIFrameElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Typography,
      Placeholder.configure({ placeholder: 'Comenzá a escribir...' }),
      Image.configure({ inline: false, allowBase64: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content,
    editorProps: {
      attributes: { class: 'focus:outline-none min-h-[500px]' },
    },
    onUpdate: ({ editor }) => setContent(editor.getHTML()),
  });

  const tpl = TEMPLATES[template];
  const page = PAGE_MM[tpl.size];
  const srcDoc = useMemo(() => buildDocument(tpl, title, content), [tpl, title, content]);

  const handleExportPDF = () => {
    const win = viewerRef.current?.contentWindow;
    if (!win) return;
    win.focus();
    win.print();
  };

  const handleImageUrl = () => {
    const url = window.prompt('URL de la imagen (https://...):')?.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) {
      window.alert('La URL debe empezar con http:// o https://');
      return;
    }
    editor?.chain().focus().setImage({ src: url }).run();
  };

  const handleImageFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !file.type.startsWith('image/')) return;
    try {
      const src = await compressImage(file);
      editor?.chain().focus().setImage({ src }).run();
    } catch {
      window.alert('No se pudo cargar la imagen.');
    }
  };

  if (!editor) return null;

  const align = (value: 'left' | 'center' | 'justify') => () =>
    editor.chain().focus().setTextAlign(value).run();

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans overflow-hidden">
      {/* Panel del editor */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col border-b md:border-b-0 md:border-r border-slate-200 bg-white shadow-2xl z-10">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 flex items-center justify-between gap-3 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shrink-0">
              <FileText className="text-white" size={20} />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg tracking-tight">Versia Studio</h1>
              <p className="text-xs text-slate-400">Editorial Profesional</p>
            </div>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-slate-800 text-slate-200 text-sm px-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 w-full max-w-xs text-right"
            placeholder="Título del proyecto"
          />
        </div>

        <div className="flex flex-wrap gap-1 p-3 border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
          <ToolButton label="Negrita" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
            <Bold size={18} />
          </ToolButton>
          <ToolButton label="Cursiva" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
            <Italic size={18} />
          </ToolButton>
          <Divider />
          <ToolButton label="Título 1" active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
            <Heading1 size={18} />
          </ToolButton>
          <ToolButton label="Título 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
            <Heading2 size={18} />
          </ToolButton>
          <ToolButton label="Título 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
            <Heading3 size={18} />
          </ToolButton>
          <Divider />
          <ToolButton label="Cita" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
            <Quote size={18} />
          </ToolButton>
          <ToolButton label="Imagen por URL" onClick={handleImageUrl}>
            <ImageIcon size={18} />
          </ToolButton>
          <ToolButton label="Subir imagen" onClick={() => fileInputRef.current?.click()}>
            <Upload size={18} />
          </ToolButton>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
          <Divider />
          <ToolButton label="Alinear a la izquierda" active={editor.isActive({ textAlign: 'left' })} onClick={align('left')}>
            <AlignLeft size={18} />
          </ToolButton>
          <ToolButton label="Centrar" active={editor.isActive({ textAlign: 'center' })} onClick={align('center')}>
            <AlignCenter size={18} />
          </ToolButton>
          <ToolButton label="Justificar" active={editor.isActive({ textAlign: 'justify' })} onClick={align('justify')}>
            <AlignJustify size={18} />
          </ToolButton>
        </div>

        <div className="flex-1 overflow-auto bg-white">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Panel de vista previa */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col bg-slate-100 relative">
        <div className="bg-white border-b border-slate-200 p-4 shadow-sm z-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3 max-h-40 overflow-y-auto">
            {TEMPLATE_IDS.map((id) => {
              const Icon = TEMPLATE_ICONS[id];
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTemplate(id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    template === id
                      ? 'bg-blue-100 text-blue-700 shadow-md ring-2 ring-blue-500'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Icon size={14} /> {TEMPLATES[id].name}
                </button>
              );
            })}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleExportPDF}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg hover:shadow-xl"
            >
              <Download size={16} /> Exportar PDF
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center bg-gradient-to-br from-slate-200 to-slate-300">
          <iframe
            ref={viewerRef}
            srcDoc={srcDoc}
            sandbox="allow-same-origin allow-modals"
            className="bg-white shadow-2xl rounded-lg shrink-0"
            style={{ width: `${page.width}mm`, height: `${page.height}mm`, border: 'none' }}
            title="Vista previa editorial"
          />
        </div>
      </div>
    </div>
  );
}
