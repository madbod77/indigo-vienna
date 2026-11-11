import { createRoot, hydrateRoot } from 'react-dom/client';
import Home from './app/page';
import './app/journey.css';

const root = document.getElementById('root')!;
// The HTML is prerendered for each country (index.html swaps in ?country=de|nl before the first paint).
if (root.hasChildNodes()) hydrateRoot(root, <Home />);
else createRoot(root).render(<Home />);
