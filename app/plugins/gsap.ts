import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default defineNuxtPlugin(() => {
  gsap.registerPlugin(ScrollTrigger);

  if (import.meta.client) {
    // ScrollTrigger measures start/end positions once and only re-measures on
    // window resize. When content above a trigger changes height later (web
    // fonts swapping in, images, the hero scene), pins fire at stale offsets:
    // the launch section pinned over About. Re-measure whenever the page's
    // height actually changes, and once fonts have finished loading.
    let lastHeight = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const refreshOnHeightChange = () => {
      const h = document.body.scrollHeight;
      if (h === lastHeight) return;
      lastHeight = h;
      clearTimeout(timer);
      timer = setTimeout(() => ScrollTrigger.refresh(), 150);
    };
    new ResizeObserver(refreshOnHeightChange).observe(document.body);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }

  return {
    provide: {
      gsap,
      ScrollTrigger,
    },
  };
});
