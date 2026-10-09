# VERSIA — Estudio Editorial Inteligente

MVP independiente para crear y maquetar libros, revistas e informes. Construido con React, TypeScript y Vite.

## Iniciar

Requiere Node.js 20 o superior.

```bash
npm install
npm run dev
```

Abrir la URL local que muestra Vite. Para comprobar la compilación: `npm run build`.

## Funciones incluidas

- Crear proyectos de libro, revista e informe.
- Escribir y aplicar estilos a títulos, subtítulos, párrafos, listas y citas.
- Agregar imágenes locales comprimidas (se incrustan en el proyecto).
- Agregar y eliminar páginas; navegación entre páginas.
- Guardado automático en `localStorage` del navegador.
- Exportar e importar una copia de seguridad JSON del proyecto.
- Exportar PDF con el diálogo **Imprimir → Guardar como PDF** del navegador.
- Interfaz adaptable a móvil y escritorio.

## Limitaciones importantes

Esta es una **versión inicial funcional**, no un maquetador de imprenta terminado. El PDF se obtiene desde el navegador, no con Vivliostyle. El contenido se guarda **en este dispositivo y navegador**, no se sincroniza entre equipos. No se incluye IA, colaboración multiusuario, importación Word ni exportación EPUB todavía. El editor enriquecido usa comandos del navegador como MVP; se migrará a Tiptap en una etapa posterior. El guardado local tiene límites de tamaño; **exportar copias JSON regularmente**. No introducir contenido HTML de origen no confiable: el importador JSON requiere sanitización y validación más estricta antes de exponerlo a terceros.

## Próximos hitos

1. Tiptap con modelo de documentos y sanitización.
2. Vivliostyle para paginación avanzada, márgenes, páginas enfrentadas y PDF.
3. Almacenamiento persistente con autenticación y biblioteca multimedia.
4. Plantillas editoriales premium y preflight de impresión.
5. Asistentes de IA opcionales.

## GitHub / Vercel

Crear un repositorio `versia-studio`, subir los archivos del ZIP a la raíz y conectar a Vercel como proyecto Vite. Build: `npm run build`. Directorio de salida: `dist`. No se requieren variables de entorno para el MVP.

## Importación de documentos

El botón **Importar** admite proyectos VERSIA (.json), Word (.docx), PDF (.pdf), texto (.txt), Markdown (.md) y HTML (.html). DOCX utiliza Mammoth; PDF utiliza PDF.js y extrae texto (no reconstruye fielmente el diseño ni realiza OCR). Los proyectos se guardan localmente en el navegador. Para generar un PDF usá **Exportar PDF** y el diálogo de impresión.

**Despliegue:** reemplazar los archivos del repositorio con los de este ZIP, sin crear una carpeta `versia-studio` adicional dentro del repositorio. Vercel ejecuta `npm install` y `npm run build`.
