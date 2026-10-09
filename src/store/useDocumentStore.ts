import { create } from 'zustand';

type TemplateType = 'libro' | 'revista' | 'informe';

interface DocumentState {
  title: string;
  template: TemplateType;
  content: string;
  setTitle: (title: string) => void;
  setTemplate: (template: TemplateType) => void;
  setContent: (content: string) => void;
  loadFromLocal: () => void;
  saveToLocal: () => void;
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  title: 'Nuevo Manuscrito',
  template: 'informe',
  content: localStorage.getItem('versia-content') || '<h1>Título del Documento</h1><p>Comenzá a escribir...</p>',
  
  setTitle: (title) => set({ title }),
  setTemplate: (template) => set({ template }),
  setContent: (content) => {
    set({ content });
    localStorage.setItem('versia-content', content);
  },
  
  loadFromLocal: () => {
    const saved = localStorage.getItem('versia-content');
    const savedTitle = localStorage.getItem('versia-title');
    if (saved) set({ content: saved });
    if (savedTitle) set({ title: savedTitle });
  },
  
  saveToLocal: () => {
    const { content, title } = get();
    localStorage.setItem('versia-content', content);
    localStorage.setItem('versia-title', title);
  },
}));
