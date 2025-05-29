const script = document.createElement('script');
script.src = 'https://unpkg.com/turndown/dist/turndown.js';
script.onload = () => console.log('Turndown loaded');
document.head.appendChild(script);