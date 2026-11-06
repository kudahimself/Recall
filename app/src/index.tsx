import React from 'react';
import ReactDOM from 'react-dom/client';
import { loader } from '@monaco-editor/react';
// Self-hosted fonts (IBM Plex Sans and Mono), so the app runs fully offline.
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/400-italic.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-sans/700.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
// Design tokens and base styles first, so every stylesheet after them can read them.
import './styles/tokens.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Serve monaco-editor's prebuilt bundle from the app (public/monaco/vs, copied by scripts/copy-monaco.js)
// instead of the default jsdelivr CDN, so the editor works with no network access.
// Importing 'monaco-editor' here instead pulled ~2,200 modules through webpack and ran the build out of memory.
loader.config({ paths: { vs: `${process.env.PUBLIC_URL}/monaco/vs` } });

// Suppress Monaco Editor hit-test errors (known bug with text selection/copy)
const originalError = window.onerror;
window.onerror = (message, source, lineno, colno, error) => {
  if (typeof message === 'string' && message.includes('offsetNode')) {
    return true; // swallow the error
  }
  if (originalError) return originalError(message, source!, lineno!, colno!, error!);
  return false;
};

// Suppress the benign "ResizeObserver loop" warning that Monaco can trigger
// when its container flex-resizes faster than the observer can deliver
// notifications. The loop self-recovers; the warning is browser noise that
// CRA's webpack-dev-server overlay otherwise upgrades to a blocking error.
//
// Must register in CAPTURE phase (third arg = true) so this runs before
// webpack-dev-server/client/overlay.js's own bubble-phase listener.
const swallowResizeObserverNoise = (event: ErrorEvent) => {
  if (
    event.message &&
    (event.message.includes('ResizeObserver loop completed') ||
      event.message.includes('ResizeObserver loop limit exceeded'))
  ) {
    event.stopImmediatePropagation();
    event.stopPropagation();
    event.preventDefault();
  }
};
window.addEventListener('error', swallowResizeObserverNoise, true);

// Same noise also fires as an unhandledrejection in some browsers.
window.addEventListener(
  'unhandledrejection',
  (event) => {
    const reason = (event as PromiseRejectionEvent).reason;
    const msg = typeof reason === 'string' ? reason : reason?.message;
    if (
      msg &&
      (msg.includes('ResizeObserver loop completed') ||
        msg.includes('ResizeObserver loop limit exceeded'))
    ) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  },
  true,
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
