// Build-time prerender: one page per country, so ?country=de|nl links paint the right guide before JS loads.
import { renderToString } from 'react-dom/server';
import Home from './app/page';
import type { Country } from './app/admissions';

export function render(country: Country = 'at') {
  return renderToString(<Home initialCountry={country} />);
}
