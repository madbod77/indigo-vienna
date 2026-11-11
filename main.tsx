import { createRoot, hydrateRoot } from 'react-dom/client';
import Home from './app/page';
import './app/journey.css';

const root = document.getElementById('root')!;
const country = new URLSearchParams(window.location.search).get('country');
// The HTML is prerendered for Austria (the default). Other countries render on the client.
if (root.hasChildNodes() && country !== 'de' && country !== 'nl') hydrateRoot(root, <Home />);
else {
  root.textContent = '';
  createRoot(root).render(<Home />);
}
