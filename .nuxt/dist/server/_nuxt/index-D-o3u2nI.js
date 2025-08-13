import { u as useHead, b as __nuxt_component_0 } from "../server.mjs";
import { defineComponent, ref, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrRenderStyle, ssrIncludeBooleanAttr } from "vue/server-renderer";
import "ofetch";
import "#internal/nuxt/paths";
import "hookable";
import "unctx";
import "h3";
import "unhead";
import "@unhead/shared";
import "vue-router";
import "radix3";
import "defu";
import "ufo";
import "destr";
import "klona";
import "@unhead/addons";
import "scule";
import "@unhead/schema-org/vue";
import "devalue";
import "@iconify/vue";
import "gsap";
import "gsap/ScrollTrigger.js";
import "@iconify/utils/lib/css/icon";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Contact",
      meta: [
        { property: "og:title", content: "Get in Touch with Andrew Long" },
        { name: "description", content: "Connect with Andrew Long, a full stack developer specializing in web development and marketing. Reach out for collaboration, or just to say hello!" },
        { property: "og:description", content: "Connect with Andrew Long, a full stack developer specializing in web development and marketing. Reach out for collaboration, or just to say hello!" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Contact" },
        { name: "twitter:description", content: "Connect with Andrew Long, a full stack developer specializing in web development and marketing. Reach out for collaboration, or just to say hello!." }
      ]
    });
    const form = ref({
      name: "",
      email: "",
      message: ""
    });
    const isSubmitting = ref(false);
    const result = ref("");
    const status = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "max-w-7xl mx-auto my-8 p-6" }, _attrs))}><div class="max-w-4xl mx-auto"><div class="text-center mb-12"><h1 class="text-4xl font-bold mb-4">Let&#39;s Connect</h1><p class="text-gray-600 max-w-2xl mx-auto"> Have a question or want to collaborate? I&#39;m always excited to connect with other developers and businesses. </p></div><div class="bg-white rounded-2xl shadow-xl p-8 md:p-12"><div class="grid md:grid-cols-2 gap-8 mb-12"><div class="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "heroicons:envelope",
        class: "w-8 h-8 mx-auto mb-4 text-orange-500"
      }, null, _parent));
      _push(`<h3 class="font-semibold mb-2">Email</h3><a href="mailto:idrewlong@gmail.com" class="text-orange-500 hover:text-orange-600 transition-colors"> idrewlong@gmail.com </a></div><div class="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "heroicons:chat-bubble-left-right",
        class: "w-8 h-8 mx-auto mb-4 text-orange-500"
      }, null, _parent));
      _push(`<h3 class="font-semibold mb-2">Social</h3><div class="flex justify-center gap-4"><a href="https://github.com/idrewlong" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-orange-500 transition-colors">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:github",
        class: "w-6 h-6"
      }, null, _parent));
      _push(`</a><a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-orange-500 transition-colors">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "mdi:linkedin",
        class: "w-6 h-6"
      }, null, _parent));
      _push(`</a></div></div></div><form class="space-y-6"><div class="relative"><input type="text" required${ssrRenderAttr("value", unref(form).name)} class="${ssrRenderClass([{ "border-orange-500": unref(form).name }, "w-full px-4 py-3 border-b-2 border-gray-300 focus:border-orange-500 rounded-lg bg-gray-50 text-gray-900 focus:outline-none transition-colors"])}" placeholder="Your Name"><label class="sr-only">Name</label></div><div class="relative"><input type="email" required${ssrRenderAttr("value", unref(form).email)} class="${ssrRenderClass([{ "border-orange-500": unref(form).email }, "w-full px-4 py-3 border-b-2 border-gray-300 focus:border-orange-500 rounded-lg bg-gray-50 text-gray-900 focus:outline-none transition-colors"])}" placeholder="Your Email"><label class="sr-only">Email</label></div><div class="relative"><textarea required rows="5" class="${ssrRenderClass([{ "border-orange-500": unref(form).message }, "w-full px-4 py-3 border-b-2 border-gray-300 focus:border-orange-500 rounded-lg bg-gray-50 text-gray-900 focus:outline-none transition-colors"])}" placeholder="Your Message">${ssrInterpolate(unref(form).message)}</textarea><label class="sr-only">Message</label></div><input type="checkbox" name="botcheck" class="hidden" style="${ssrRenderStyle({ "display": "none" })}">`);
      if (unref(result)) {
        _push(`<div class="${ssrRenderClass([
          "text-center p-4 rounded-lg",
          unref(status) === "success" ? "bg-green-100 text-green-700" : unref(status) === "error" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-800"
        ])}">${ssrInterpolate(unref(result))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="submit"${ssrIncludeBooleanAttr(unref(isSubmitting)) ? " disabled" : ""} class="w-full md:w-auto px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-lg hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"><span>${ssrInterpolate(unref(isSubmitting) ? "Sending..." : "Send Message")}</span>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "heroicons:paper-airplane",
        class: "w-5 h-5"
      }, null, _parent));
      _push(`</button></form></div></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/contact/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-D-o3u2nI.js.map
