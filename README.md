# VERSIA — Estudio Editorial Inteligente

MVP para escribir y maquetar libros, revistas, informes y piezas periodísticas. React + TypeScript + Vite + Tiptap + Tailwind.

## Iniciar

Requiere Node.js 20 o superior.

```bash
npm install
npm run dev
```

Para comprobar la compilación: `npm run build`.

## Funciones incluidas

- Editor enriquecido (Tiptap): negrita, cursiva, títulos H1–H3, citas y alineación.
- Imágenes por URL o subidas desde el dispositivo (se comprimen y se incrustan).
- 9 plantillas con vista previa en vivo: Informe, Revista, Libro, Periódico, Académico, Fotografía, Clarín, La Nación y Página/12. El tamaño de la hoja (A3, A4, A5) cambia según la plantilla.
- Guardado automático de contenido, título y plantilla en `localStorage`.
- Exportar PDF desde **Exportar PDF** → diálogo de impresión → *Guardar como PDF*. El título del proyecto se usa como nombre del archivo.
- Interfaz adaptable a móvil y escritorio.

## Limitaciones

- El contenido se guarda solo en este navegador y dispositivo; no se sincroniza.
- Si el almacenamiento se llena (muchas imágenes), el guardado falla sin romper la app: copiá el contenido a otro lado.
- El PDF depende del navegador (se recomienda Chrome). No hay paginación avanzada.
- Todavía no hay importación (Word, PDF, JSON), copia de seguridad JSON, IA ni colaboración.

## Próximos hitos

1. Exportar/importar copia de seguridad JSON.
2. Importación de Word y texto.
3. Vivliostyle para paginación avanzada y PDF.
4. Almacenamiento persistente con cuentas.

## Despliegue en Vercel

Subir los archivos a la raíz de un repositorio y conectarlo a Vercel como proyecto Vite. Build: `npm run build`. Salida: `dist`. No requiere variables de entorno.
