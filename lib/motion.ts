// Motion runtime for the Indigo admissions guide.
// Grammar: velira-sites/knowledge/SYNTHESIS.md §3 (measured on xeno.now and 21st.dev), re-tuned in runs/indigo-premium-mobile/motion.md.
// Everything that moves lives inside gsap.matchMedia("(prefers-reduced-motion: no-preference)");
// outside it the content is simply visible. Initial hidden states are applied only by JS via the
// `motion` class set on <html> before first paint (index.html), never by plain CSS.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, CustomEase);

export const ease = {
  // entrances: cubic-bezier(0.2, 0.7, 0.2, 1)
  enter: CustomEase.create("indigo-enter", "0.2,0.7,0.2,1"),
  // small shifts (switches, hovers): cubic-bezier(0.23, 1, 0.32, 1)
  shift: CustomEase.create("indigo-shift", "0.23,1,0.32,1"),
  // camera moves between countries / scenes
  move: CustomEase.create("indigo-move", "0.65,0,0.2,1"),
};

export const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger };
