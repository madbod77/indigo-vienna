// Build-time prerender of the default (Austria) page so the first screen paints before JS loads.
import { renderToString } from 'react-dom/server';
import Home from './app/page';

export function render() {
  return renderToString(<Home />);
}
