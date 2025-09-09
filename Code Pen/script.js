document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        html: document.getElementById('html-editor'),
        css: document.getElementById('css-editor'),
        preview: document.getElementById('preview-iframe')
    };

    const getPreviewTemplate = (css, html) => `
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Preview</title>
        <style>${css}</style>
        <style>body {margin:0; padding:10px; box-sizing: border-box;}</style>
    </head>
    <body>${html}</body>
    </html>`;

    let renderTimeout;
    const updatePreview = () => {
        clearTimeout(renderTimeout);
        renderTimeout = setTimeout(() => {
            const doc = elements.preview.contentWindow.document;
            doc.open();
            doc.write(getPreviewTemplate(elements.css.value, elements.html.value));
            doc.close();
        }, 300);
    };

    const saveCode = () => {
        localStorage.setItem('liveEditorHTML', elements.html.value);
        localStorage.setItem('liveEditorCSS', elements.css.value);
    };

    const loadCode = () => {
        const savedHTML = localStorage.getItem('liveEditorHTML');
        const savedCSS = localStorage.getItem('liveEditorCSS');

        if (savedHTML) elements.html.value = savedHTML;
        if (savedCSS) elements.css.value = savedCSS;
        updatePreview();
    };

    const init = () => {
        [elements.html, elements.css].forEach(editor => {
            editor.addEventListener('input', updatePreview);
            editor.addEventListener('input', saveCode);
        });
    };

    init();
    loadCode();
});
