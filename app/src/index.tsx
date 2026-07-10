import React from 'react';
import ReactDOM from 'react-dom/client';
import * as monaco from 'monaco-editor';
import { loader } from '@monaco-editor/react';
// Self-hosted fonts — keep the app running fully offline.
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource/jetbrains-mono/600.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Use the bundled monaco-editor instead of the default jsdelivr CDN, so the
// editor works with no network access (and starts faster after the first build).
loader.config({ monaco });

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
