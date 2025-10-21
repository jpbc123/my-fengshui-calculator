import { createRoot, hydrateRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import './index.css'

const rootElement = document.getElementById("root")!;

// Check if the app was pre-rendered by react-snap
if (rootElement.hasChildNodes()) {
  // Hydrate the pre-rendered content
  hydrateRoot(rootElement, (
    <HelmetProvider>
      <App />
    </HelmetProvider>
  ));
} else {
  // Normal render for development mode
  createRoot(rootElement).render(
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
}