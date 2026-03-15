import { u as useHead, b as useNuxtApp, _ as _export_sfc, d as __nuxt_component_0$2, a as __nuxt_component_0$2$1 } from './server.mjs';
import { defineComponent, createElementBlock, ref, provide, mergeProps, useSSRContext, withCtx, createVNode, unref } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderStyle, ssrInterpolate, ssrRenderAttr, ssrRenderClass } from 'vue/server-renderer';
import { p as publicAssetsURL } from '../nitro/nitro.mjs';
import { Icon } from '@iconify/vue';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import '@unhead/addons';
import '@unhead/schema-org/vue';
import 'devalue';
import 'gsap';
import '@iconify/utils/lib/css/icon';
import 'lru-cache';
import '@unocss/core';
import '@unocss/preset-wind';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'consola/core';
import 'node:url';
import '@iconify/utils';
import 'ipx';

const _sfc_main$a = {
  __name: "TechIcons",
  __ssrInlineRender: true,
  setup(__props) {
    useNuxtApp();
    const fieldRef = ref(null);
    ref([]);
    const techIcons = [
      { logo: "logos:react" },
      { logo: "logos:vue" },
      { logo: "logos:nuxt-icon" },
      { logo: "logos:typescript-icon" },
      { logo: "logos:tailwindcss-icon" },
      { logo: "logos:laravel" },
      { logo: "logos:python" },
      // { logo: 'logos:javascript' },
      { logo: "logos:go" },
      { logo: "logos:svelte-icon" },
      { logo: "logos:docker-icon" },
      { logo: "logos:php" },
      { logo: "logos:digital-ocean-icon" },
      { logo: "logos:postgresql" }
    ];
    const homePositions = [
      { x: 10, y: 5 },
      // React
      { x: 42, y: 8 },
      // Vue
      { x: 74, y: 3 },
      // Nuxt
      { x: 76, y: 20 },
      // TypeScript
      { x: 24, y: 20 },
      // Tailwind
      { x: 56, y: 26 },
      // Laravel (behind photo)
      { x: 6, y: 36 },
      // Python
      { x: 68, y: 48 },
      // Go (behind photo)
      { x: 14, y: 58 },
      // Svelte
      { x: 84, y: 62 },
      // Docker
      { x: 48, y: 68 },
      // PHP (behind photo)
      { x: 78, y: 78 },
      // Digital Ocean
      { x: 8, y: 80 }
      // PostgreSQL
    ];
    const getInitialStyle = (index) => {
      const home = homePositions[index];
      return {
        left: `${home.x}%`,
        top: `${home.y}%`,
        opacity: 0
      };
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "fieldRef",
        ref: fieldRef,
        class: "absolute inset-0 overflow-hidden pointer-events-none"
      }, _attrs))} data-v-f4d30c1b><!--[-->`);
      ssrRenderList(techIcons, (icon, index) => {
        _push(`<div class="magnetic-icon" style="${ssrRenderStyle(getInitialStyle(index))}" data-v-f4d30c1b><div class="icon-inner" data-v-f4d30c1b>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: icon.logo,
          class: "w-8 h-8 sm:w-9 sm:h-9",
          "aria-hidden": "true"
        }, null, _parent));
        _push(`</div></div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
};
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TechIcons.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : undefined;
};
const __nuxt_component_2$1 = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-f4d30c1b"]]);
const _imports_0 = publicAssetsURL("/images/me_1.webp");
const _sfc_main$9 = {
  __name: "Hero",
  __ssrInlineRender: true,
  setup(__props) {
    useNuxtApp();
    const currentWord = ref("");
    ref(null);
    ref(null);
    ref(null);
    ref(null);
    ref(null);
    ref(null);
    ref(null);
    const scrollToProjects = () => {
      const projectsSection = (undefined).getElementById("projects");
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: "smooth" });
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2$1;
      const _component_Icon = __nuxt_component_0$2;
      const _component_TechIcons = __nuxt_component_2$1;
      _push(`<section${ssrRenderAttrs(mergeProps({
        ref: "heroSection",
        class: "hero-section"
      }, _attrs))} data-v-6c63ae22><div class="hero-container max-w-6xl mx-auto px-4 sm:px-6" data-v-6c63ae22><div class="flex items-center gap-3 mb-6 sm:mb-10 md:mb-14" data-v-6c63ae22><span class="text-[10px] font-bold tracking-[0.25em] uppercase text-stone-400" data-v-6c63ae22>Portfolio</span><div class="flex-1 h-px bg-stone-200" data-v-6c63ae22></div><span class="text-[9px] font-mono tracking-[0.15em] uppercase text-stone-300" data-v-6c63ae22>2026</span></div><div class="hero-grid" data-v-6c63ae22><div class="hero-content" data-v-6c63ae22><div class="hero-greeting" data-v-6c63ae22><span class="text-[9px] font-mono tracking-[0.25em] uppercase text-orange-400" data-v-6c63ae22>Hi, I&#39;m Andrew</span></div><h1 class="hero-title font-serif" data-v-6c63ae22> I like to build<br data-v-6c63ae22> amazing <span class="typewriter text-orange-500" data-v-6c63ae22>${ssrInterpolate(currentWord.value)}</span></h1><p class="hero-description text-stone-500" data-v-6c63ae22> TypeScript connoisseur. AI nerd. Animation aficionado. Fullstack web, mostly React, Svelte, Next or Nuxt. Backend with Laravel, Node.js, and PHP. Have written a Python bot or two. </p><div class="hero-buttons" data-v-6c63ae22>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/contact",
        class: "hero-btn-primary group"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-[10px] tracking-[0.25em] uppercase font-mono" data-v-6c63ae22${_scopeId}>Get In Touch</span>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "heroicons:arrow-up-right-20-solid",
              class: "w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("span", { class: "text-[10px] tracking-[0.25em] uppercase font-mono" }, "Get In Touch"),
              createVNode(_component_Icon, {
                name: "heroicons:arrow-up-right-20-solid",
                class: "w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                "aria-hidden": "true"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "#projects",
        class: "hero-btn-secondary group",
        onClick: scrollToProjects
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-[10px] tracking-[0.25em] uppercase font-mono" data-v-6c63ae22${_scopeId}>View Projects</span>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "heroicons:arrow-down-20-solid",
              class: "w-4 h-4 transition-transform duration-200 group-hover:translate-y-0.5",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("span", { class: "text-[10px] tracking-[0.25em] uppercase font-mono" }, "View Projects"),
              createVNode(_component_Icon, {
                name: "heroicons:arrow-down-20-solid",
                class: "w-4 h-4 transition-transform duration-200 group-hover:translate-y-0.5",
                "aria-hidden": "true"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="hero-image-area" data-v-6c63ae22>`);
      _push(ssrRenderComponent(_component_TechIcons, null, null, _parent));
      _push(`<div class="hero-photo-wrapper" data-v-6c63ae22><img${ssrRenderAttr("src", _imports_0)} alt="Andrew&#39;s photo" class="hero-photo" loading="lazy" data-v-6c63ae22></div></div></div><div class="hero-scroll hidden md:flex" data-v-6c63ae22><span class="text-[9px] font-mono tracking-[0.3em] uppercase text-stone-400" data-v-6c63ae22>Scroll</span><div class="flex flex-col items-center gap-1" data-v-6c63ae22><div class="w-px h-8 bg-gradient-to-b from-stone-300 to-transparent" data-v-6c63ae22></div>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "heroicons:chevron-down-20-solid",
        class: "w-3 h-3 text-stone-300"
      }, null, _parent));
      _push(`</div></div></div></section>`);
    };
  }
};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Hero.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : undefined;
};
const __nuxt_component_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-6c63ae22"]]);
const _sfc_main$8 = {
  __name: "About",
  __ssrInlineRender: true,
  setup(__props) {
    useNuxtApp();
    const aboutSection = ref(null);
    ref(null);
    ref(null);
    ref(null);
    ref(null);
    ref(null);
    const currently = [
      { label: "Based in", value: "Long Beach, MS" },
      {
        label: "Day job",
        value: "Full-stack Dev & SEO \xB7 Mad Genius",
        link: "https://madg.com/people/andrew-long/"
      },
      { label: "Building", value: "Many Things" },
      { label: "Hobbies", value: "Photography & being outdoors" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        ref_key: "aboutSection",
        ref: aboutSection,
        class: "max-w-6xl mx-auto px-4 sm:px-6"
      }, _attrs))} data-v-fcd0bd49><div class="flex items-center gap-3 mb-10" data-v-fcd0bd49><span class="text-[10px] font-bold tracking-[0.25em] uppercase text-stone-400" data-v-fcd0bd49>About</span><div class="flex-1 h-px bg-stone-200" data-v-fcd0bd49></div></div><blockquote class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif italic text-stone-900 leading-tight mb-10 sm:mb-16 max-w-4xl" data-v-fcd0bd49> &quot;I&#39;ve always been drawn to solving problems and building things that <span class="text-orange-500 not-italic" data-v-fcd0bd49>actually work.</span>&quot; </blockquote><div class="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-20" data-v-fcd0bd49><div class="space-y-5" data-v-fcd0bd49><p class="text-sm md:text-base leading-relaxed text-stone-500" data-v-fcd0bd49> Andrew Long, an Ole Miss graduate living in Long Beach, MS with my wife, and our dog Bo. At Mad Genius, I work as a full-stack developer and SEO strategist with a focus on backend systems: designing databases, building and integrating APIs, connecting CMS platforms, and developing the architecture that holds apps together. I also bring strong frontend experience through various Javascript frameworks and WordPress development. </p><p class="text-sm md:text-base leading-relaxed text-stone-500" data-v-fcd0bd49> What differentiates me is how I think beyond the code. I understand full-scale business logistics and can translate complex technical problems into clear, actionable direction for non-technical stakeholders. I approach every engagement with an entrepreneurial mindset, using data to inform decisions and identify real growth opportunities. I&#39;m a strong researcher by nature: if I don&#39;t know something, I know how to find the answer. </p></div><div class="relative lg:pl-10" data-v-fcd0bd49><div class="absolute left-0 top-0 bottom-0 w-px bg-stone-200 hidden lg:block" aria-hidden="true" data-v-fcd0bd49></div><div class="flex items-center gap-3 mb-6" data-v-fcd0bd49><p class="text-[9px] font-mono tracking-[0.22em] uppercase text-orange-400" data-v-fcd0bd49> Currently </p></div><div class="space-y-0" data-v-fcd0bd49><!--[-->`);
      ssrRenderList(currently, (item) => {
        _push(`<div class="sidebar-item group py-4 border-b border-stone-100 last:border-b-0 cursor-default" data-v-fcd0bd49><span class="block text-[9px] font-mono tracking-[0.18em] uppercase text-stone-300 mb-1" data-v-fcd0bd49>${ssrInterpolate(item.label)}</span>`);
        if (item.link) {
          _push(`<a${ssrRenderAttr("href", item.link)} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-sm leading-snug text-stone-700 hover:text-orange-500 transition-colors duration-200" data-v-fcd0bd49>${ssrInterpolate(item.value)} `);
          _push(ssrRenderComponent(unref(Icon), {
            icon: "heroicons:arrow-up-right-20-solid",
            class: "w-3.5 h-3.5 shrink-0 text-stone-400 group-hover:text-orange-400 transition-colors duration-200",
            "aria-hidden": "true"
          }, null, _parent));
          _push(`</a>`);
        } else {
          _push(`<span class="text-sm leading-snug text-stone-700 group-hover:text-orange-500 transition-colors duration-200" data-v-fcd0bd49>${ssrInterpolate(item.value)}</span>`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div></div></div></section>`);
    };
  }
};
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/About.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : undefined;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-fcd0bd49"]]);
const _sfc_main$7 = {
  __name: "Marquee",
  __ssrInlineRender: true,
  props: {
    reverse: { type: Boolean, default: false }
  },
  setup(__props) {
    const items = [
      "Nuxt",
      "Vue",
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind",
      "GSAP",
      "WordPress",
      "GraphQL",
      "PHP",
      "Laravel",
      "Node.js",
      "Figma",
      "SEO",
      "Python"
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "overflow-hidden py-4 border-y border-stone-200 bg-stone-50/60" }, _attrs))} data-v-2a7a7764><div class="${ssrRenderClass([__props.reverse ? "marquee-reverse" : "marquee-forward", "marquee-track flex items-center whitespace-nowrap"])}" data-v-2a7a7764><!--[-->`);
      ssrRenderList(2, (n) => {
        _push(`<div class="flex items-center gap-8 pr-8 shrink-0" data-v-2a7a7764><!--[-->`);
        ssrRenderList(items, (item) => {
          _push(`<!--[--><span class="text-[11px] font-bold tracking-[0.22em] uppercase text-stone-400" data-v-2a7a7764>${ssrInterpolate(item)}</span><span class="w-1 h-1 rounded-full bg-orange-300 shrink-0 inline-block" data-v-2a7a7764></span><!--]-->`);
        });
        _push(`<!--]--></div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Marquee.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : undefined;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-2a7a7764"]]);
const _sfc_main$6 = {
  __name: "Experience",
  __ssrInlineRender: true,
  setup(__props) {
    useNuxtApp();
    const expSection = ref(null);
    ref(null);
    ref(null);
    ref([]);
    const experiences = [
      {
        period: "June 2024 \u2013 Present",
        title: "SEO Developer",
        company: "Mad Genius",
        description: "Full-stack web development using Nuxt, React, React Native, Laravel, WordPress, and more. Leading SEO initiatives and comprehensive digital marketing strategies for enterprise clients including Yates Construction, Regional Homes, and the Mississippi State Department of Health.",
        achievements: [
          "Develop and execute SEO and digital marketing strategies with in-depth audits covering web presence, AI integration, and social media optimization.",
          "Build and maintain WordPress sites, headless WordPress implementations with Nuxt, React Native mobile applications, and full-stack Laravel web applications."
        ]
      },
      {
        period: "December 2023 \u2013 June 2024",
        title: "Marketing Project Manager",
        company: "Thompson Machinery",
        description: "Led comprehensive marketing and data initiatives across multiple divisions while managing a small team and developing technical solutions.",
        achievements: [
          "Spearheaded multi-channel advertising campaigns including email, PPC, and social media while building custom landing pages using Next.js, TailwindCSS, and WordPress.",
          "Developed internal tools and automation using Microsoft Power Apps, .NET/C#, and Microsoft Dynamics to streamline workflows and customer journeys."
        ]
      },
      {
        period: "September 2022 \u2013 December 2023",
        title: "Marketing Project Manager",
        company: "Finders Guide",
        description: "Led web development and digital marketing initiatives for multiple clients while managing remote teams and implementing comprehensive branding strategies.",
        achievements: [
          "Developed modern web solutions using React, Next.js, and Svelte.js while creating high-converting landing pages and implementing SEO strategies.",
          "Established complete branding strategies for diverse clients including construction, VFX, and manufacturing companies."
        ]
      },
      {
        period: "March 2022 \u2013 January 2023",
        title: "Customer Support Specialist",
        company: "Core Logic",
        description: "Provided expert software support and customer service while collaborating with development teams to enhance product features and user experience.",
        achievements: [
          "Maintained an exceptional 95% customer satisfaction score while providing specialized support for industry-specific software.",
          "Facilitated effective communication between customers and development teams using Jira and Salesforce in an agile SCRUM environment."
        ]
      },
      {
        period: "January 2018 \u2013 December 2020",
        title: "Media Coordinator",
        company: "LMC",
        description: "Managed end-to-end video production projects while coordinating content strategy and advertising campaigns for diverse clients.",
        achievements: [
          "Produced and edited over 100 media projects including music videos and commercials while ensuring consistent quality and client satisfaction.",
          "Orchestrated social media content management using Hootsuite to enhance consumer engagement while maintaining strict project schedules."
        ]
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        ref_key: "expSection",
        ref: expSection,
        class: "max-w-6xl mx-auto px-4 sm:px-6"
      }, _attrs))}><div class="flex items-center gap-3 mb-12"><span class="text-[10px] font-bold tracking-[0.25em] uppercase text-stone-400">Experience</span><div class="flex-1 h-px bg-stone-200"></div></div><div class="relative"><div class="absolute left-2 top-5 bottom-5 w-px bg-stone-100"><div class="w-full h-full bg-stone-300 origin-top"></div></div><div class="space-y-12 md:space-y-14"><!--[-->`);
      ssrRenderList(experiences, (exp, i) => {
        _push(`<div class="flex gap-4 sm:gap-8 items-start"><div class="w-4 shrink-0 pt-1 relative z-10"><div class="w-4 h-4 rounded-full bg-white border-2 border-stone-300 flex items-center justify-center"><div class="w-1.5 h-1.5 rounded-full bg-orange-400"></div></div></div><div class="flex-1 min-w-0 pb-2"><div class="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-6 mb-2"><h3 class="text-lg font-bold font-serif text-stone-900 leading-snug">${ssrInterpolate(exp.title)} <span class="text-orange-500"> @ ${ssrInterpolate(exp.company)}</span></h3><span class="text-xs text-stone-400 font-medium tracking-wide md:ml-auto shrink-0">${ssrInterpolate(exp.period)}</span></div><p class="text-sm text-stone-500 mb-4 leading-relaxed max-w-2xl">${ssrInterpolate(exp.description)}</p><ul class="space-y-2"><!--[-->`);
        ssrRenderList(exp.achievements.slice(0, 2), (ach, j) => {
          _push(`<li class="flex gap-3 items-start text-sm text-stone-400"><span class="text-orange-400 shrink-0 leading-5">\u2014</span><span class="leading-relaxed">${ssrInterpolate(ach)}</span></li>`);
        });
        _push(`<!--]--></ul></div></div>`);
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Experience.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : undefined;
};
const _sfc_main$5 = {
  __name: "Skills",
  __ssrInlineRender: true,
  setup(__props) {
    useNuxtApp();
    const skillsSection = ref(null);
    ref(null);
    ref([]);
    const skillCategories = [
      {
        title: "Frontend",
        skills: [
          "React / Next.js",
          "Vue / Nuxt.js",
          "Svelte / SvelteKit",
          "Tailwind CSS",
          "GSAP",
          "WordPress",
          "Headless CMS"
        ]
      },
      {
        title: "Backend",
        skills: ["PHP", "Laravel", "Node.js", "GraphQL", "Golang", "WP REST API"]
      },
      {
        title: "Dev-Ops",
        skills: ["Docker", "CI/CD", "Git", "Digital Ocean", "Vercel"]
      },
      {
        title: "Data",
        skills: ["Python", "Pandas", "NumPy", "MySQL", "PostgreSQL"]
      },
      {
        title: "Design & SEO",
        skills: [
          "Figma",
          "Adobe Suite",
          "Screaming Frog",
          "SEM Rush",
          "Google Analytics",
          "Google Search Console",
          "Google Tag Manager"
        ]
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        ref_key: "skillsSection",
        ref: skillsSection,
        class: "max-w-6xl mx-auto px-4 sm:px-6"
      }, _attrs))}><div class="flex items-center gap-3 mb-10"><span class="text-[10px] font-bold tracking-[0.25em] uppercase text-stone-400">Skills</span><div class="flex-1 h-px bg-stone-200"></div></div><div class=""><!--[-->`);
      ssrRenderList(skillCategories, (category, i) => {
        _push(`<div class="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-16 py-4 md:py-5 border-b border-stone-100 group"><div class="flex items-center gap-3 md:w-44 shrink-0"><span class="text-[9px] font-mono text-stone-300 tabular-nums select-none" aria-hidden="true">${ssrInterpolate(String(i + 1).padStart(2, "0"))}</span><div class="flex items-center gap-1.5"><span class="w-1 h-1 rounded-full bg-orange-400 shrink-0" aria-hidden="true"></span><span class="text-xs font-mono tracking-[0.15em] uppercase text-orange-400">${ssrInterpolate(category.title)}</span></div></div><p class="text-sm text-stone-600 leading-relaxed"><!--[-->`);
        ssrRenderList(category.skills, (skill, j) => {
          _push(`<!--[-->${ssrInterpolate(skill)}`);
          if (j < category.skills.length - 1) {
            _push(`<span class="text-stone-300 mx-1.5">\xB7</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        });
        _push(`<!--]--></p></div>`);
      });
      _push(`<!--]--></div></section>`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Skills.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : undefined;
};
const _sfc_main$4 = {
  __name: "Education",
  __ssrInlineRender: true,
  setup(__props) {
    useNuxtApp();
    const educationSection = ref(null);
    ref(null);
    ref(null);
    const educationList = [
      {
        degree: "B.A",
        major: "General Studies",
        achievements: [
          "Lyceum Scholar",
          "Lens Collective Program",
          "Chancellor's Leadership Class"
        ],
        school: "University of Mississippi",
        year: "2022",
        logo: "/images/olemiss.webp"
      },
      {
        degree: "A.A",
        major: "Pre-Engineering",
        achievements: ["Phi Theta Kappa President", "Hall of Fame", "NASA Scholar"],
        school: "Mississippi Delta Community College",
        year: "2016",
        logo: "/images/mdcc.webp"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        ref_key: "educationSection",
        ref: educationSection,
        class: "max-w-6xl mx-auto px-4 sm:px-6 w-full"
      }, _attrs))} data-v-039e0a83><div class="flex items-center gap-3 mb-10" data-v-039e0a83><span class="text-[10px] font-bold tracking-[0.25em] uppercase text-stone-400" data-v-039e0a83>Education</span><div class="flex-1 h-px bg-stone-200" data-v-039e0a83></div></div><div class="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm w-full" data-v-039e0a83><div class="hidden md:flex border-b border-stone-100 bg-stone-50/80" data-v-039e0a83><div class="edu-col-institution px-5 py-3" data-v-039e0a83><span class="text-[10px] font-bold tracking-[0.2em] uppercase text-stone-400" data-v-039e0a83>Institution</span></div><div class="edu-col-degree px-4 py-3 border-l border-stone-100" data-v-039e0a83><span class="text-[10px] font-bold tracking-[0.2em] uppercase text-stone-400" data-v-039e0a83>Degree</span></div><div class="edu-col-field px-4 py-3 border-l border-stone-100" data-v-039e0a83><span class="text-[10px] font-bold tracking-[0.2em] uppercase text-stone-400" data-v-039e0a83>Field of Study</span></div><div class="edu-col-highlights px-5 py-3 border-l border-stone-100 flex-1" data-v-039e0a83><span class="text-[10px] font-bold tracking-[0.2em] uppercase text-stone-400" data-v-039e0a83>Highlights</span></div></div><!--[-->`);
      ssrRenderList(educationList, (education) => {
        _push(`<div class="education-item border-b border-stone-100 last:border-b-0 group" data-v-039e0a83><div class="hidden md:flex items-stretch hover:bg-stone-50/40 transition-colors" data-v-039e0a83><div class="edu-col-institution px-5 py-5 flex items-start gap-3" data-v-039e0a83>`);
        if (education.logo) {
          _push(`<img${ssrRenderAttr("src", education.logo)}${ssrRenderAttr("alt", `${education.school} logo`)} class="w-6 h-6 object-contain opacity-50 shrink-0 mt-0.5" data-v-039e0a83>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span class="text-sm text-stone-600 leading-snug" data-v-039e0a83>${ssrInterpolate(education.school)}</span></div><div class="edu-col-degree px-4 py-5 border-l border-stone-100 flex items-start" data-v-039e0a83><span class="text-xl font-bold font-serif text-stone-900" data-v-039e0a83>${ssrInterpolate(education.degree)}</span></div><div class="edu-col-field px-4 py-5 border-l border-stone-100 flex items-start" data-v-039e0a83><span class="text-sm text-orange-500 font-serif italic leading-snug" data-v-039e0a83>${ssrInterpolate(education.major)}</span></div><div class="edu-col-highlights flex-1 px-5 py-5 border-l border-stone-100 flex flex-col gap-2" data-v-039e0a83><!--[-->`);
        ssrRenderList(education.achievements, (ach, j) => {
          _push(`<div class="flex gap-2.5 items-start text-sm text-stone-500" data-v-039e0a83><span class="text-orange-400 shrink-0 leading-5" data-v-039e0a83>\u2014</span><span class="leading-relaxed" data-v-039e0a83>${ssrInterpolate(ach)}</span></div>`);
        });
        _push(`<!--]--></div></div><div class="md:hidden px-5 py-5" data-v-039e0a83><div class="flex items-start justify-between gap-4 mb-4" data-v-039e0a83><div class="flex items-start gap-3" data-v-039e0a83>`);
        if (education.logo) {
          _push(`<img${ssrRenderAttr("src", education.logo)}${ssrRenderAttr("alt", `${education.school} logo`)} class="w-7 h-7 object-contain opacity-60 mt-0.5 shrink-0" data-v-039e0a83>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div data-v-039e0a83><p class="text-xs text-stone-400 mb-0.5" data-v-039e0a83>${ssrInterpolate(education.school)}</p><h2 class="text-xl font-bold font-serif text-stone-900" data-v-039e0a83>${ssrInterpolate(education.degree)}</h2><p class="text-sm text-orange-500 font-serif italic" data-v-039e0a83>${ssrInterpolate(education.major)}</p></div></div></div><div class="flex flex-col gap-2" data-v-039e0a83><!--[-->`);
        ssrRenderList(education.achievements, (ach, j) => {
          _push(`<div class="flex gap-2.5 items-start text-sm text-stone-500" data-v-039e0a83><span class="text-orange-400 shrink-0 leading-5" data-v-039e0a83>\u2014</span><span class="leading-relaxed" data-v-039e0a83>${ssrInterpolate(ach)}</span></div>`);
        });
        _push(`<!--]--></div></div></div>`);
      });
      _push(`<!--]--></div></section>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Education.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : undefined;
};
const __nuxt_component_5 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-039e0a83"]]);
defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const clientOnlySymbol = Symbol.for("nuxt:client-only");
const __nuxt_component_0 = defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  setup(_, { slots, attrs }) {
    const mounted = ref(false);
    provide(clientOnlySymbol, true);
    return (props) => {
      var _a;
      if (mounted.value) {
        return (_a = slots.default) == null ? undefined : _a.call(slots);
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return slot();
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
const _sfc_main$3 = {
  __name: "Projects2",
  __ssrInlineRender: true,
  setup(__props) {
    useNuxtApp();
    const projects = [
      {
        title: "Mad Genius - 5.0",
        description: "Creative agency site redesign; assisted in rebuilding architecture for optimized GSAP transitions and stronger SEO.",
        image: "/images/madgcover.webp",
        link: "https://madg.com/",
        workTypes: ["Web Development", "SEO"],
        isRealWork: true,
        technologies: [
          "logos:nuxt-icon",
          "logos:typescript-icon",
          "logos:tailwindcss-icon",
          "logos:wordpress-icon",
          "logos:graphql"
        ]
      },
      {
        title: "Yates Construction",
        description: "Corporate website for a national construction firm; modular templates and performance/SEO improvements.",
        image: "/images/Yates.webp",
        link: "https://wgyates.com/",
        workTypes: ["Web Development", "SEO"],
        isRealWork: true,
        technologies: [
          "logos:nuxt-icon",
          "logos:tailwindcss-icon",
          "logos:wordpress-icon",
          "logos:graphql",
          "logos:wpengine"
        ]
      },
      {
        title: "Regional Homes",
        description: "Marketing site for a home builder; flexible components and streamlined lead-gen pages. Over 50 sites total.",
        image: "/images/Regional.webp",
        link: "https://regionalhomes.net/",
        workTypes: ["Web Development", "SEO"],
        isRealWork: true,
        technologies: [
          "logos:nuxt-icon",
          "logos:tailwindcss-icon",
          "logos:wordpress-icon",
          "logos:graphql",
          "logos:wpengine"
        ]
      },
      {
        title: "Eley Guild Hardy",
        description: "Architecture portfolio; optimized imagery and page transitions.",
        image: "/images/EGH.webp",
        link: "https://eleyguildhardy.com/",
        workTypes: ["Web Development"],
        isRealWork: true,
        technologies: [
          "logos:wordpress-icon",
          "logos:tailwindcss-icon",
          "logos:wpengine"
        ]
      },
      {
        title: "idrewfilm",
        description: "Photography portfolio; optimized imagery and page transitions. Digital Ocean Droplet, hosted on Cloudflare.",
        image: "/images/idrewfilm.webp",
        link: "https://idrewfilm.com/",
        workTypes: ["Web Development", "Web Design", "Branding", "SEO"],
        isRealWork: false,
        technologies: [
          "logos:nuxt-icon",
          "logos:tailwindcss-icon",
          "logos:wordpress-icon",
          "logos:graphql"
        ]
      },
      {
        title: "Taylor Trolley",
        description: "Brand and marketing site for a charter trolley service in Oxford/Taylor, MS.",
        image: "/images/taylortrolley.webp",
        link: "https://taylortrolley.vercel.app/",
        workTypes: ["Web Development", "Web Design", "Branding"],
        isRealWork: false,
        technologies: ["logos:nuxt-icon", "logos:tailwindcss-icon"]
      }
    ];
    const sectionEl = ref(null);
    ref(null);
    ref([]);
    const openIndex = ref(-1);
    ref(null);
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({
        ref_key: "sectionEl",
        ref: sectionEl,
        id: "projects",
        class: "bg-stone-100/70 border-y border-stone-200 py-16"
      }, _attrs))}><div class="max-w-6xl mx-auto px-4 sm:px-6"><div class="flex items-center gap-4 mb-10 text-[11px] font-mono text-stone-400 uppercase tracking-widest"><span>Selected Work</span><span class="flex-1 h-px bg-stone-200" aria-hidden="true"></span><span>${ssrInterpolate(projects.length)} Projects</span></div><div><!--[-->`);
      ssrRenderList(projects, (project, i) => {
        _push(`<div class="${ssrRenderClass([{ "border-b border-stone-200": i === projects.length - 1 }, "accordion-row border-t border-stone-200"])}"><button class="relative w-full flex items-center gap-3 sm:gap-5 py-5 sm:py-6 group text-left overflow-hidden md:cursor-none"${ssrRenderAttr("aria-expanded", openIndex.value === i)}${ssrRenderAttr("aria-controls", `drawer-${i}`)}><span class="absolute inset-0 z-0 bg-white/60 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out pointer-events-none" aria-hidden="true"></span>`);
        if (openIndex.value !== i) {
          _push(`<div class="absolute right-0 top-0 bottom-0 w-44 z-[1] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" aria-hidden="true"><img${ssrRenderAttr("src", project.image)}${ssrRenderAttr("alt", project.title)} class="h-full w-full object-cover object-left" draggable="false"><div class="absolute inset-0 bg-gradient-to-r from-stone-100 via-stone-100/60 to-transparent"></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span class="${ssrRenderClass([
          openIndex.value === i ? "text-orange-400" : "text-stone-300",
          "relative z-10 font-mono text-[11px] shrink-0 w-6 tabular-nums transition-colors duration-300"
        ])}" aria-hidden="true">${ssrInterpolate(String(i + 1).padStart(2, "0"))}</span><h3 class="${ssrRenderClass([[
          openIndex.value === i ? "text-orange-500" : "text-stone-900 group-hover:text-orange-500",
          "text-2xl sm:text-3xl lg:text-4xl"
        ], "relative z-10 flex-1 font-serif leading-none transition-colors duration-300"])}">${ssrInterpolate(project.title)}</h3><span class="${ssrRenderClass([
          project.isRealWork ? "bg-emerald-400" : "bg-amber-300",
          "relative z-10 w-1.5 h-1.5 rounded-full shrink-0 hidden sm:block"
        ])}"${ssrRenderAttr("title", project.isRealWork ? "Client work" : "Side project")}></span><div class="relative z-10 shrink-0 w-5 h-5 flex items-center justify-center">`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "heroicons:plus-small",
          class: "w-5 h-5 text-stone-400 transition-all duration-300 group-hover:text-orange-500",
          style: {
            transform: openIndex.value === i ? "rotate(45deg)" : "rotate(0deg)"
          }
        }, null, _parent));
        _push(`</div></button><div${ssrRenderAttr("id", `drawer-${i}`)} style="${ssrRenderStyle({ "height": "0", "overflow": "hidden" })}"><div class="pb-6 sm:pb-10 pt-1"><div class="grid md:grid-cols-5 gap-5 sm:gap-8 lg:gap-12"><div class="md:col-span-2 flex flex-col gap-5 drawer-text"><p class="text-sm text-stone-500 leading-relaxed" style="${ssrRenderStyle({ "max-width": "40ch" })}">${ssrInterpolate(project.description)}</p><div class="flex flex-wrap gap-2"><!--[-->`);
        ssrRenderList(project.workTypes, (tag) => {
          _push(`<span class="px-2.5 py-1 rounded-full text-[10px] font-medium text-stone-500 bg-white border border-stone-200">${ssrInterpolate(tag)}</span>`);
        });
        _push(`<!--]--></div><div class="flex items-center gap-4"><div class="flex items-center gap-1.5"><!--[-->`);
        ssrRenderList(project.technologies.slice(0, 5), (tech) => {
          _push(ssrRenderComponent(unref(Icon), {
            key: tech,
            icon: tech,
            class: "w-5 h-5 opacity-50"
          }, null, _parent));
        });
        _push(`<!--]--></div><a${ssrRenderAttr("href", project.link)} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-[11px] font-mono text-stone-600 hover:text-orange-500 border border-stone-300 hover:border-orange-300 rounded-full px-3 py-1.5 transition-colors duration-200"> Visit site `);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "heroicons:arrow-up-right-20-solid",
          class: "w-3.5 h-3.5"
        }, null, _parent));
        _push(`</a></div></div><div class="md:col-span-3 drawer-img overflow-hidden rounded-xl"><img${ssrRenderAttr("src", project.image)}${ssrRenderAttr("alt", project.title)} class="w-full aspect-video object-cover rounded-xl" draggable="false"></div></div></div></div></div>`);
      });
      _push(`<!--]--></div></div>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</section>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Projects2.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : undefined;
};
const _sfc_main$2 = {
  __name: "Articles",
  __ssrInlineRender: true,
  setup(__props) {
    useNuxtApp();
    const articlesSection = ref(null);
    ref(null);
    ref(null);
    const articles = [
      {
        title: "The Modern Marketer's Guide To AI Implementation",
        date: "2025-03-19",
        url: "https://madg.com/2025/03/19/the-modern-marketers-guide-to-ai-implementation/",
        description: "A comprehensive guide on integrating AI tools and strategies into modern marketing workflows, focusing on practical applications and real-world examples.",
        image: "/images/tools.webp",
        bgColor: "from-yellow-400 to-yellow-500"
      },
      {
        title: "SEO in the Age of AI Search Engines",
        date: "2025-01-07",
        url: "https://madg.com/2025/01/07/seo-in-the-age-of-ai-search-engines/",
        description: "Exploring how AI-powered search engines are changing SEO practices and what marketers need to know to stay ahead of the curve.",
        image: "/images/computer.webp",
        bgColor: "from-purple-400 to-purple-500"
      }
    ];
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        ref_key: "articlesSection",
        ref: articlesSection,
        class: "max-w-6xl mx-auto px-4 sm:px-6 py-6",
        id: "articles"
      }, _attrs))}><div class="flex items-center gap-3 mb-10"><span class="text-[10px] font-bold tracking-[0.25em] uppercase text-stone-400">Articles</span><div class="flex-1 h-px bg-stone-200"></div></div><div class="grid md:grid-cols-2 gap-6"><!--[-->`);
      ssrRenderList(articles, (article) => {
        _push(`<article class="article-card group bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-stone-300 shadow-sm hover:shadow-md transition-all duration-300"><a${ssrRenderAttr("href", article.url)} target="_blank" rel="noopener noreferrer" class="flex flex-col h-full"><div class="${ssrRenderClass([article.bgColor, "relative h-[180px] sm:h-[240px] overflow-hidden bg-gradient-to-b"])}"><img${ssrRenderAttr("src", article.image)}${ssrRenderAttr("alt", article.title)} class="absolute inset-0 w-full h-full object-contain p-8 transition-transform duration-300 group-hover:scale-105"></div><div class="p-6 flex flex-col flex-grow"><div class="flex items-start justify-between gap-4 mb-3"><h2 class="text-base font-serif font-bold text-stone-900 group-hover:text-orange-500 transition-colors line-clamp-2">${ssrInterpolate(article.title)}</h2><time${ssrRenderAttr("datetime", article.date)} class="text-xs text-stone-400 whitespace-nowrap">${ssrInterpolate(formatDate(article.date))}</time></div><p class="text-stone-500 text-sm mb-4 line-clamp-2 flex-grow">${ssrInterpolate(article.description)}</p><div class="flex items-center text-orange-500 group-hover:text-orange-600 transition-colors text-sm"> Read article `);
        _push(ssrRenderComponent(unref(Icon), {
          icon: "material-symbols:arrow-circle-right-outline",
          class: "w-4 h-4 ml-1"
        }, null, _parent));
        _push(`</div></div></a></article>`);
      });
      _push(`<!--]--></div></section>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Articles.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : undefined;
};
const _sfc_main$1 = {
  __name: "Cta",
  __ssrInlineRender: true,
  setup(__props) {
    useNuxtApp();
    const ctaSection = ref(null);
    ref(null);
    ref(null);
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$2;
      const _component_NuxtLink = __nuxt_component_0$2$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "ctaSection",
        ref: ctaSection,
        class: "relative w-full max-w-6xl mx-auto px-4 sm:px-6"
      }, _attrs))} data-v-20e73b30><div class="flex items-center gap-3 mb-10" data-v-20e73b30><span class="text-[10px] font-bold tracking-[0.25em] uppercase text-stone-400" data-v-20e73b30>Contact</span><div class="flex-1 h-px bg-stone-200" data-v-20e73b30></div></div><div class="flex flex-col md:flex-row border-t border-b border-stone-200" data-v-20e73b30><div class="flex-1 py-14 md:py-20 border-b md:border-b-0 md:border-r border-stone-200 md:pr-14" data-v-20e73b30><h2 class="cta-name font-serif italic text-stone-900 leading-[0.88] tracking-tight select-none" data-v-20e73b30> ANDREW<br data-v-20e73b30>LONG </h2><div class="mt-5 h-[2px] bg-stone-900 w-full max-w-md" data-v-20e73b30></div></div><div class="w-full md:w-80 lg:w-96 py-14 md:py-20 md:pl-12 flex flex-col gap-7" data-v-20e73b30><div data-v-20e73b30><div class="flex items-center gap-2 mb-2" data-v-20e73b30><span class="text-orange-500 text-[10px]" data-v-20e73b30>\u2726</span><span class="text-[9px] tracking-[0.25em] uppercase text-stone-400 font-mono" data-v-20e73b30>Status</span></div><p class="text-[10px] tracking-[0.18em] uppercase text-stone-700 font-mono" data-v-20e73b30> Fullstack Developer </p><p class="text-[10px] tracking-[0.12em] uppercase text-stone-400 font-mono mt-1.5 leading-relaxed max-w-[18rem]" data-v-20e73b30> Building solutions to complex problems. </p></div><div class="flex items-center gap-2" data-v-20e73b30><a href="https://github.com/idrewlong" target="_blank" rel="noopener noreferrer" class="cta-social-icon" aria-label="GitHub" data-v-20e73b30>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "ph:github-logo-fill",
        class: "w-4 h-4"
      }, null, _parent));
      _push(`</a><a href="https://www.linkedin.com/in/idrewlong/" target="_blank" rel="noopener noreferrer" class="cta-social-icon" aria-label="LinkedIn" data-v-20e73b30>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "ph:linkedin-logo-fill",
        class: "w-4 h-4"
      }, null, _parent));
      _push(`</a></div><div class="h-px bg-stone-900 w-full" data-v-20e73b30></div><div data-v-20e73b30><span class="text-[9px] tracking-[0.25em] uppercase text-stone-400 font-mono block mb-1.5" data-v-20e73b30>Inquiries</span><a href="mailto:idrewlong@gmail.com" class="text-xs text-stone-700 font-mono hover:text-orange-500 transition-colors duration-200" data-v-20e73b30> idrewlong@gmail.com </a></div><div class="flex flex-col gap-3" data-v-20e73b30>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/contact",
        class: "cta-button group"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="text-[10px] tracking-[0.25em] uppercase font-mono" data-v-20e73b30${_scopeId}>Get In Touch</span>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "heroicons:arrow-up-right-20-solid",
              class: "w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("span", { class: "text-[10px] tracking-[0.25em] uppercase font-mono" }, "Get In Touch"),
              createVNode(_component_Icon, {
                name: "heroicons:arrow-up-right-20-solid",
                class: "w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<a href="/resume.pdf" download class="cta-button-secondary group" data-v-20e73b30><span class="text-[10px] tracking-[0.25em] uppercase font-mono" data-v-20e73b30>Download Resume</span>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "heroicons:arrow-down-tray",
        class: "w-4 h-4 transition-transform duration-200 group-hover:translate-y-0.5"
      }, null, _parent));
      _push(`</a></div></div></div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Cta.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : undefined;
};
const __nuxt_component_8 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-20e73b30"]]);
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Full Stack Developer",
      meta: [
        { name: "description", content: "Andrew Long is a full stack developer with a passion for building tools, websites, apps, strategies and business solutions." },
        { property: "og:title", content: "Full Stack Developer" },
        { property: "og:description", content: "Andrew Long is a full stack developer with a passion for building tools, websites, apps, strategies and business solutions" },
        { property: "og:image", content: "/images/OG.webp" },
        { name: "twitter:card", content: "summary_large_image" }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Hero = __nuxt_component_0$1;
      const _component_About = __nuxt_component_1;
      const _component_Marquee = __nuxt_component_2;
      const _component_Experience = _sfc_main$6;
      const _component_Skills = _sfc_main$5;
      const _component_Education = __nuxt_component_5;
      const _component_Projects2 = _sfc_main$3;
      const _component_Articles = _sfc_main$2;
      const _component_Cta = __nuxt_component_8;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col w-full" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_Hero, null, null, _parent));
      _push(`<main class="w-full py-8 sm:py-12 flex flex-col justify-center gap-y-14 sm:gap-y-20">`);
      _push(ssrRenderComponent(_component_About, null, null, _parent));
      _push(ssrRenderComponent(_component_Marquee, null, null, _parent));
      _push(ssrRenderComponent(_component_Experience, null, null, _parent));
      _push(ssrRenderComponent(_component_Skills, null, null, _parent));
      _push(ssrRenderComponent(_component_Education, null, null, _parent));
      _push(`<div class="w-full">`);
      _push(ssrRenderComponent(_component_Projects2, null, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_Marquee, { reverse: true }, null, _parent));
      _push(ssrRenderComponent(_component_Articles, null, null, _parent));
      _push(ssrRenderComponent(_component_Cta, null, null, _parent));
      _push(`</main></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Ah6MX08s.mjs.map
