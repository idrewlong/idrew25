import { _ as _export_sfc, b as useNuxtApp, u as useHead, d as __nuxt_component_0 } from './server.mjs';
import { useSSRContext, defineComponent, ref, mergeProps } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderStyle, ssrRenderClass, ssrRenderComponent, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import '../nitro/nitro.mjs';
import 'lru-cache';
import '@unocss/core';
import '@unocss/preset-wind';
import 'devalue';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'consola/core';
import 'node:url';
import '@iconify/utils';
import 'ipx';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import '@unhead/addons';
import '@unhead/schema-org/vue';
import '@iconify/vue';
import 'gsap';
import '@iconify/utils/lib/css/icon';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useNuxtApp();
    useHead({
      title: "Contact",
      meta: [
        { property: "og:title", content: "Get in Touch with Andrew Long" },
        { name: "description", content: "Connect with Andrew Long, a full stack developer specializing in web development and marketing. Reach out for collaboration, or just to say hello!" },
        { property: "og:description", content: "Connect with Andrew Long, a full stack developer specializing in web development and marketing. Reach out for collaboration, or just to say hello!" },
        { property: "og:image", content: "/images/OG.webp" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Contact" },
        { name: "twitter:description", content: "Connect with Andrew Long, a full stack developer specializing in web development and marketing. Reach out for collaboration, or just to say hello!." }
      ]
    });
    const form = ref({ name: "", email: "", message: "" });
    const isSubmitting = ref(false);
    const result = ref("");
    const status = ref("");
    const contactSection = ref(null);
    ref(null);
    ref(null);
    ref(null);
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({
        ref_key: "contactSection",
        ref: contactSection,
        class: "contact-page max-w-6xl mx-auto px-4 sm:px-6"
      }, _attrs))} data-v-b764e382><div class="flex items-center gap-3 mb-6 sm:mb-10 md:mb-14" data-v-b764e382><span class="text-[10px] font-bold tracking-[0.25em] uppercase text-stone-400" data-v-b764e382>Contact</span><div class="flex-1 h-px bg-stone-200" data-v-b764e382></div><span class="text-[9px] font-mono tracking-[0.15em] uppercase text-stone-300" data-v-b764e382>Say Hello</span></div><div class="mb-10 sm:mb-16" data-v-b764e382><h1 class="contact-title font-serif italic text-stone-900 leading-[0.92] tracking-tight" data-v-b764e382> Let&#39;s build<br data-v-b764e382>something great. </h1><p class="mt-5 text-sm text-stone-500 leading-relaxed max-w-md" data-v-b764e382> Have a project in mind, want to collaborate, or just want to connect? Drop me a line \u2014 I&#39;d love to hear from you. </p></div><div class="flex flex-col md:flex-row border-t border-stone-200" data-v-b764e382><div class="flex-1 py-10 md:py-14 md:pr-14 md:border-r border-stone-200" data-v-b764e382><form class="space-y-8" data-v-b764e382><div class="form-field" data-v-b764e382><label class="form-label" data-v-b764e382><span class="text-orange-500 mr-1.5" data-v-b764e382>\u2726</span>Name </label><input type="text" required${ssrRenderAttr("value", form.value.name)} class="form-input" placeholder="Your name" data-v-b764e382></div><div class="form-field" data-v-b764e382><label class="form-label" data-v-b764e382><span class="text-orange-500 mr-1.5" data-v-b764e382>\u2726</span>Email </label><input type="email" required${ssrRenderAttr("value", form.value.email)} class="form-input" placeholder="you@example.com" data-v-b764e382></div><div class="form-field" data-v-b764e382><label class="form-label" data-v-b764e382><span class="text-orange-500 mr-1.5" data-v-b764e382>\u2726</span>Message </label><textarea required rows="5" class="form-input resize-none" placeholder="Tell me about your project..." data-v-b764e382>${ssrInterpolate(form.value.message)}</textarea></div><input type="checkbox" name="botcheck" class="hidden" style="${ssrRenderStyle({ "display": "none" })}" data-v-b764e382>`);
      if (result.value) {
        _push(`<div class="${ssrRenderClass([
          "status-message",
          status.value === "success" ? "status-success" : status.value === "error" ? "status-error" : "status-info"
        ])}" data-v-b764e382>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: status.value === "success" ? "heroicons:check-circle" : status.value === "error" ? "heroicons:exclamation-circle" : "heroicons:arrow-path",
          class: ["w-4 h-4 shrink-0", { "animate-spin": status.value === "info" }]
        }, null, _parent));
        _push(`<span data-v-b764e382>${ssrInterpolate(result.value)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="submit"${ssrIncludeBooleanAttr(isSubmitting.value) ? " disabled" : ""} class="submit-btn group" data-v-b764e382><span class="text-[10px] tracking-[0.25em] uppercase font-mono" data-v-b764e382>${ssrInterpolate(isSubmitting.value ? "Sending..." : "Send Message")}</span>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "heroicons:arrow-up-right-20-solid",
        class: "w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      }, null, _parent));
      _push(`</button></form></div><div class="w-full md:w-72 lg:w-80 py-10 md:py-14 md:pl-12" data-v-b764e382><div class="sidebar-block" data-v-b764e382><div class="flex items-center gap-2 mb-2" data-v-b764e382><span class="text-orange-500 text-[10px]" data-v-b764e382>\u2726</span><span class="text-[9px] tracking-[0.25em] uppercase text-stone-400 font-mono" data-v-b764e382>Email</span></div><a href="mailto:idrewlong@gmail.com" class="text-xs text-stone-700 font-mono hover:text-orange-500 transition-colors duration-200" data-v-b764e382> idrewlong@gmail.com </a></div><div class="h-px bg-stone-200 my-7" data-v-b764e382></div><div class="sidebar-block" data-v-b764e382><div class="flex items-center gap-2 mb-4" data-v-b764e382><span class="text-orange-500 text-[10px]" data-v-b764e382>\u2726</span><span class="text-[9px] tracking-[0.25em] uppercase text-stone-400 font-mono" data-v-b764e382>Connect</span></div><div class="flex items-center gap-2" data-v-b764e382><a href="https://github.com/idrewlong" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="GitHub" data-v-b764e382>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "ph:github-logo-fill",
        class: "w-4 h-4"
      }, null, _parent));
      _push(`</a><a href="https://www.linkedin.com/in/idrewlong/" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="LinkedIn" data-v-b764e382>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "ph:linkedin-logo-fill",
        class: "w-4 h-4"
      }, null, _parent));
      _push(`</a></div></div><div class="h-px bg-stone-200 my-7" data-v-b764e382></div><div class="sidebar-block" data-v-b764e382><div class="flex items-center gap-2 mb-2" data-v-b764e382><span class="text-orange-500 text-[10px]" data-v-b764e382>\u2726</span><span class="text-[9px] tracking-[0.25em] uppercase text-stone-400 font-mono" data-v-b764e382>Based In</span></div><p class="text-xs text-stone-700 font-mono" data-v-b764e382>Long Beach, MS</p></div><div class="h-px bg-stone-200 my-7" data-v-b764e382></div><div class="sidebar-block" data-v-b764e382><div class="flex items-center gap-2 mb-2" data-v-b764e382><span class="text-orange-500 text-[10px]" data-v-b764e382>\u2726</span><span class="text-[9px] tracking-[0.25em] uppercase text-stone-400 font-mono" data-v-b764e382>Status</span></div><div class="flex items-center gap-2" data-v-b764e382><span class="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" data-v-b764e382></span><p class="text-xs text-stone-700 font-mono" data-v-b764e382>Open to opportunities</p></div></div><div class="h-px bg-stone-900 my-7" data-v-b764e382></div><a href="/resume.pdf" download class="resume-btn group" data-v-b764e382><span class="text-[10px] tracking-[0.25em] uppercase font-mono" data-v-b764e382>Download Resume</span>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "heroicons:arrow-down-tray",
        class: "w-4 h-4 transition-transform duration-200 group-hover:translate-y-0.5"
      }, null, _parent));
      _push(`</a></div></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/contact/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b764e382"]]);

export { index as default };
//# sourceMappingURL=index-BAUm4wa_.mjs.map
