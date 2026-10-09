export const TEMPLATE_IDS = [
  'informe',
  'revista',
  'libro',
  'periodico',
  'academico',
  'fotografia',
  'clarin',
  'lanacion',
  'pagina12',
] as const;

export type TemplateId = (typeof TEMPLATE_IDS)[number];

export const isTemplateId = (value: unknown): value is TemplateId =>
  typeof value === 'string' && (TEMPLATE_IDS as readonly string[]).includes(value);

export interface TemplateDef {
  id: TemplateId;
  name: string;
  size: 'A3' | 'A4' | 'A5';
  margin: string;
  /** CSS propio de la plantilla. Las columnas se aplican al <article>, no a cada párrafo. */
  css: string;
}

export const PAGE_MM = {
  A3: { width: 297, height: 420 },
  A4: { width: 210, height: 297 },
  A5: { width: 148, height: 210 },
} as const;

export const TEMPLATES: Record<TemplateId, TemplateDef> = {
  informe: {
    id: 'informe',
    name: 'Informe',
    size: 'A4',
    margin: '25mm 20mm',
    css: `
      body { font-family: 'Inter', sans-serif; color: #1a1a1a; }
      h1 { font-size: 28pt; font-weight: 700; border-bottom: 3px solid #3b82f6; padding-bottom: 12pt; }
      p { font-size: 11pt; line-height: 1.7; text-align: justify; }
    `,
  },
  revista: {
    id: 'revista',
    name: 'Revista',
    size: 'A4',
    margin: '15mm',
    css: `
      body { font-family: 'Playfair Display', serif; }
      article { column-count: 2; column-gap: 20pt; }
      h1 { font-size: 42pt; font-weight: 900; color: #c41e3a; text-align: center; column-span: all; }
      p { font-size: 11pt; text-align: justify; }
    `,
  },
  libro: {
    id: 'libro',
    name: 'Libro',
    size: 'A5',
    margin: '20mm 25mm',
    css: `
      body { font-family: 'Crimson Text', serif; }
      h1 { font-size: 24pt; text-align: center; margin-top: 40pt; }
      p { font-size: 11pt; text-indent: 14pt; text-align: justify; margin: 0; }
    `,
  },
  periodico: {
    id: 'periodico',
    name: 'Periódico',
    size: 'A3',
    margin: '10mm 15mm',
    css: `
      body { font-family: Georgia, serif; }
      article { column-count: 3; column-gap: 16pt; }
      h1 { font-size: 36pt; text-align: center; border-bottom: 2px solid #000; column-span: all; }
      p { font-size: 10pt; text-align: justify; }
    `,
  },
  academico: {
    id: 'academico',
    name: 'Académico',
    size: 'A4',
    margin: '30mm 25mm',
    css: `
      body { font-family: 'Source Serif 4', serif; }
      h1 { font-size: 20pt; margin-top: 30pt; }
      p { font-size: 11pt; line-height: 1.8; text-align: justify; }
    `,
  },
  fotografia: {
    id: 'fotografia',
    name: 'Fotografía',
    size: 'A4',
    margin: '0',
    css: `
      body { font-family: 'Inter', sans-serif; }
      h1 { font-size: 32pt; font-weight: 300; text-align: center; margin: 40pt 20pt; }
      p { font-size: 10pt; text-align: center; margin: 20pt 40pt; }
      img { width: 100%; margin: 0; }
    `,
  },
  clarin: {
    id: 'clarin',
    name: 'Clarín',
    size: 'A3',
    margin: '8mm 10mm',
    css: `
      body { font-family: Arial, sans-serif; }
      article { column-count: 6; column-gap: 12pt; }
      h1 { font-family: 'Arial Black', Arial, sans-serif; font-size: 64pt; text-align: center; line-height: 0.95; column-span: all; }
      h2 { font-size: 11pt; color: #c41e3a; text-align: center; text-transform: uppercase; column-span: all; }
      p { font-size: 9.5pt; text-align: justify; }
    `,
  },
  lanacion: {
    id: 'lanacion',
    name: 'La Nación',
    size: 'A3',
    margin: '15mm 20mm',
    css: `
      body { font-family: Georgia, serif; }
      article { column-count: 5; column-gap: 16pt; }
      h1 { font-size: 42pt; text-align: center; column-span: all; }
      h2 { font-size: 10pt; color: #64748b; text-align: center; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; column-span: all; }
      p { font-size: 10pt; text-align: justify; }
    `,
  },
  pagina12: {
    id: 'pagina12',
    name: 'Página/12',
    size: 'A3',
    margin: '10mm 12mm',
    css: `
      body { font-family: Arial, sans-serif; }
      article { column-count: 5; column-gap: 14pt; }
      h1 { font-family: 'Arial Black', Arial, sans-serif; font-size: 48pt; color: #c41e3a; column-span: all; }
      h2 { font-size: 12pt; text-transform: uppercase; column-span: all; }
      p { font-size: 9.5pt; text-align: justify; }
    `,
  },
};

const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Source+Serif+4:wght@400;600;700&family=Inter:wght@300;400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap';

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Documento HTML completo para la vista previa y para imprimir/exportar a PDF. */
export function buildDocument(tpl: TemplateDef, title: string, html: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>${escapeHtml(title || 'Documento')}</title>
<style>
  @import url('${FONTS_URL}');
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  @page { size: ${tpl.size}; margin: ${tpl.margin}; }
  @media screen { body { padding: ${tpl.margin}; } }
  img { max-width: 100%; height: auto; display: block; margin: 16pt 0; }
  blockquote { border-left: 3px solid #94a3b8; margin: 14pt 0; padding-left: 14pt; font-style: italic; color: #475569; }
  h1, h2, h3 { break-after: avoid; }
  ${tpl.css}
</style>
</head>
<body><article>${html}</article></body>
</html>`;
}
