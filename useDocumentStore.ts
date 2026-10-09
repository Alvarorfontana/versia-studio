import { create } from 'zustand';
import { isTemplateId, type TemplateId } from '../templates';

const KEYS = {
  content: 'versia-content',
  title: 'versia-title',
  template: 'versia-template',
} as const;

const DEFAULT_CONTENT = '<h1>Título del Documento</h1><p>Comenzá a escribir...</p>';
const DEFAULT_TITLE = 'Nuevo Manuscrito';

// localStorage puede fallar (modo privado, cuota llena): nunca debe romper la app.
const read = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const write = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.warn('No se pudo guardar en el navegador (¿almacenamiento lleno?)', err);
  }
};

interface DocumentState {
  title: string;
  template: TemplateId;
  content: string;
  setTitle: (title: string) => void;
  setTemplate: (template: TemplateId) => void;
  setContent: (content: string) => void;
}

const savedTemplate = read(KEYS.template);

export const useDocumentStore = create<DocumentState>((set) => ({
  title: read(KEYS.title) ?? DEFAULT_TITLE,
  template: isTemplateId(savedTemplate) ? savedTemplate : 'informe',
  content: read(KEYS.content) ?? DEFAULT_CONTENT,

  setTitle: (title) => {
    set({ title });
    write(KEYS.title, title);
  },
  setTemplate: (template) => {
    set({ template });
    write(KEYS.template, template);
  },
  setContent: (content) => {
    set({ content });
    write(KEYS.content, content);
  },
}));
