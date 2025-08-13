import { b as __nuxt_component_0$1, _ as _export_sfc, d as useNuxtApp, a as __nuxt_component_0$2, u as useHead } from "../server.mjs";
import { useSSRContext, mergeProps, defineComponent, createElementBlock, ref, provide, withCtx, createTextVNode, createVNode, unref, watch, computed } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderAttr, ssrRenderClass } from "vue/server-renderer";
import "hookable";
import { Icon } from "@iconify/vue";
import "ofetch";
import "#internal/nuxt/paths";
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
import "gsap";
import "gsap/ScrollTrigger.js";
import "@iconify/utils/lib/css/icon";
const baseX = 355.0341389255983;
const baseY = 298.6701355135605;
const radius = 280;
const rotationFactor = 0.75;
const _sfc_main$a = {
  __name: "TechIcons",
  __ssrInlineRender: true,
  props: {
    scroll: {
      type: Number,
      default: 0
    }
  },
  setup(__props) {
    const props = __props;
    const techIcons = [
      { name: "logos:html-5", angle: 4.15 },
      { name: "logos:javascript", angle: 3.78125 },
      { name: "logos:nodejs-icon", angle: 3.4125 },
      { name: "logos:tailwindcss-icon", angle: 3.04375 },
      { name: "logos:react", angle: 2.675 },
      { name: "logos:vue", angle: 2.30625 },
      { name: "logos:nuxt-icon", angle: 1.9375 },
      { name: "logos:laravel", angle: 1.56875 },
      { name: "logos:typescript-icon", angle: 1.2 },
      { name: "logos:css-3", angle: 0.83125 },
      { name: "logos:python", angle: 0.4625 }
    ];
    const getIconStyle = (index) => {
      const angle = techIcons[index].angle - props.scroll * rotationFactor;
      return {
        left: `calc(${baseX}px + ${radius}px * cos(${angle}rad))`,
        top: `calc(${baseY}px - ${radius}px * sin(${angle}rad))`,
        width: "40px",
        // Explicit width
        height: "40px"
        // Explicit height
      };
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "absolute inset-0" }, _attrs))}><!--[-->`);
      ssrRenderList(techIcons, (icon, index) => {
        _push(ssrRenderComponent(_component_Icon, {
          key: index,
          name: icon.name,
          class: "absolute w-20 h-20 translate-x-[-50%] translate-y-[-50%] text-background opacity-30",
          style: getIconStyle(index)
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
    };
  }
};
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TechIcons.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const clientOnlySymbol = Symbol.for("nuxt:client-only");
const __nuxt_component_3$1 = defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  setup(_, { slots, attrs }) {
    const mounted = ref(false);
    provide(clientOnlySymbol, true);
    return (props) => {
      var _a;
      if (mounted.value) {
        return (_a = slots.default) == null ? void 0 : _a.call(slots);
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
const _sfc_main$9 = {
  __name: "Hero",
  __ssrInlineRender: true,
  setup(__props) {
    useNuxtApp();
    const scrollPosition = ref(0);
    const isClient = ref(false);
    ref("");
    const currentWord = ref("");
    const images = ["/images/me_1.png", "/images/me_3.png"];
    ref(null);
    ref(null);
    ref(null);
    ref(null);
    ref(null);
    ref(null);
    const scrollToProjects = () => {
      const projectsSection = (void 0).getElementById("projects");
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: "smooth" });
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      const _component_Icon = __nuxt_component_0$1;
      const _component_TechIcons = _sfc_main$a;
      const _component_ClientOnly = __nuxt_component_3$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container mx-auto px-4 md:px-8 pt-8 mb-16 sm:pt-24 sm:mb-24 max-w-7xl" }, _attrs))} data-v-a734fe78><section class="relative bg-gradient-to-br from-orange-400 via-orange-500 to-orange-400 rounded-2xl overflow-hidden flex flex-col sm:flex-row justify-center items-center w-full shadow-2xl" data-v-a734fe78><div class="absolute inset-0 overflow-hidden" data-v-a734fe78><div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]" data-v-a734fe78></div><div class="absolute inset-0 bg-[linear-gradient(45deg,transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)]" data-v-a734fe78></div></div><div class="relative p-8 sm:p-12 flex flex-1 flex-col gap-y-6 sm:gap-y-8 self-start sm:self-end max-w-2xl" data-v-a734fe78><div class="flex flex-col gap-y-1 sm:gap-y-2" data-v-a734fe78><div class="text-lg sm:text-xl font-medium text-gray-100 tracking-wide" data-v-a734fe78> Hi, I&#39;m Andrew </div><h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight" data-v-a734fe78> I like to build <span class="whitespace-nowrap" data-v-a734fe78><span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-white" data-v-a734fe78>amazing</span><span class="typewriter text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-white" data-v-a734fe78>${ssrInterpolate(currentWord.value)}</span></span></h1></div><p class="text-base sm:text-lg text-gray-100 leading-relaxed max-w-xl" data-v-a734fe78> TypeScript connoisseur. AI nerd. Animation aficionado. Fullstack web, mostly React, Svelte, Next or Nuxt. Backend with Lavarel, Node.js, and PHP. Have written a Python bot or two. </p><div class="flex flex-col sm:flex-row gap-3 sm:gap-4" data-v-a734fe78>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/contact",
        class: "inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-white text-orange-600 font-medium hover:bg-gray-100 transition-colors duration-300 text-sm sm:text-base"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Let&#39;s work `);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "heroicons:arrow-right",
              class: "w-4 h-4 sm:w-5 sm:h-5 ml-2",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(" Let's work "),
              createVNode(_component_Icon, {
                name: "heroicons:arrow-right",
                class: "w-4 h-4 sm:w-5 sm:h-5 ml-2",
                "aria-hidden": "true"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "#projects",
        onClick: scrollToProjects,
        class: "inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg border border-white/20 text-white font-medium hover:bg-white/10 transition-colors duration-300 text-sm sm:text-base"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` View Projects `);
          } else {
            return [
              createTextVNode(" View Projects ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="relative flex-shrink-0 mt-8 sm:mt-0" data-v-a734fe78><div class="relative flex justify-end items-end" style="${ssrRenderStyle({ "width": "450px", "height": "450px" })}" data-v-a734fe78>`);
      _push(ssrRenderComponent(_component_TechIcons, { scroll: scrollPosition.value }, null, _parent));
      _push(`<div class="relative mt-12 transform hover:scale-105 transition-transform duration-500" style="${ssrRenderStyle({ "height": "475px", "width": "335px" })}" data-v-a734fe78>`);
      if (!isClient.value) {
        _push(`<img${ssrRenderAttr("src", images[0])} alt="Andrew&#39;s photo" class="relative z-10 w-full h-full" loading="lazy" data-v-a734fe78>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</div></div></div></section></div>`);
    };
  }
};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Hero.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-a734fe78"]]);
const _sfc_main$8 = {
  __name: "About",
  __ssrInlineRender: true,
  setup(__props) {
    useNuxtApp();
    const aboutText = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<p${ssrRenderAttrs(mergeProps({
        ref_key: "aboutText",
        ref: aboutText,
        class: "text-sm leading-relaxed text-gray-600"
      }, _attrs))}> I&#39;ve always been drawn to solving problems and building things that (sometimes) work. After high school, I attended Mississippi Delta Community College and then to Ole Miss for broadcast journalism, I found my groove shooting music videos for artists across Atlanta, Memphis, Nashville, and New Orleans. Turns out, pointing cameras at rappers was great training for my career. <br><br>In 2022, a friend introduced me to programming, and I was hooked. No more &quot;we&#39;ll fix it in post&quot; – just clean code that either works or doesn&#39;t. I launched Finder&#39;s Guide to help businesses build websites and marketing funnels that don&#39;t suck, then landed at Mad Genius where I juggle everything from SEO to full stack development. I love building sites, full-stack applications, internal automations that save people&#39;s sanity, and SEO strategies that actually move the needle. My skill set covers a variety of areas, but I get particularly fired up about creating solutions that solve real business problems...not just pretty interfaces that look good in screenshots. <br><br>Currently living in Long Beach, MS with my wife and our dog Bo, who&#39;s honestly the best coworker I&#39;ve ever had. When I&#39;m not coding, you&#39;ll find me shooting my Mamiya 645, getting lost in nature, or diving deep into family history because apparently I&#39;m 30 going on 70. I&#39;m an old soul. </p>`);
    };
  }
};
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/About.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _sfc_main$7 = {
  __name: "Skills",
  __ssrInlineRender: true,
  setup(__props) {
    useNuxtApp();
    const skillsContainer = ref(null);
    ref([]);
    const skillCategories = [
      {
        title: "Frontend",
        skills: [
          "React/Next.js",
          "Vue/Nuxt.js",
          "Svelte/SvelteKit",
          "Tailwind",
          "GSAP",
          "WordPress",
          "Headless WordPress"
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
        title: "Software",
        skills: [
          "Figma",
          "Adobe Suite",
          "Screaming Frog SEO Spider",
          "SEM Rush",
          "Google Analytics",
          "Google Search Console",
          "Google Tag Manager"
        ]
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "skillsContainer",
        ref: skillsContainer,
        class: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8"
      }, _attrs))}><!--[-->`);
      ssrRenderList(skillCategories, (category, index) => {
        _push(`<div class="skill-category"><h3 class="text-lg md:text-xl font-bold mb-2 pb-2 border-b-2 border-orange-400 inline-block">${ssrInterpolate(category.title)}</h3><ul class="mt-4 space-y-2 text-sm md:text-base"><!--[-->`);
        ssrRenderList(category.skills, (skill) => {
          _push(`<li class="text-gray-600">${ssrInterpolate(skill)}</li>`);
        });
        _push(`<!--]--></ul></div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Skills.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = {
  __name: "Education",
  __ssrInlineRender: true,
  setup(__props) {
    useNuxtApp();
    const educationContainer = ref(null);
    const educationList = [
      {
        degree: "B.A",
        major: "University Studies",
        achievements: [
          "Lyceum Scholar",
          "Lens Colletive Program",
          "Chancellor's Leadership Class"
        ],
        school: "University of Mississippi",
        year: "2022",
        logo: "/images/olemiss.png"
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
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "educationContainer",
        ref: educationContainer,
        class: "grid md:grid-cols-2 gap-12"
      }, _attrs))}><!--[-->`);
      ssrRenderList(educationList, (education) => {
        _push(`<div class="education-item relative min-h-[200px] w-full md:p-6 rounded-lg"><div class="pr-16"><h2 class="flex items-baseline gap-2 mb-4"><span class="md:text-2xl font-semibold">${ssrInterpolate(education.degree)}</span><span class="md:text-2xl text-orange-400"> - ${ssrInterpolate(education.major)}</span></h2><ul class="text-sm text-gray-600 flex flex-col gap-y-2"><!--[-->`);
        ssrRenderList(education.achievements, (achievement, index) => {
          _push(`<li class="flex gap-x-2 items-start">`);
          _push(ssrRenderComponent(unref(Icon), {
            name: "ci:dot-03-m",
            class: "w-4 h-4"
          }, null, _parent));
          _push(`<span>${ssrInterpolate(achievement)}</span></li>`);
        });
        _push(`<!--]--></ul></div><div class="mt-6"><div class="grid grid-cols-[1fr_80px] items-center"><h3 class="md:text-lg text-gray-600">${ssrInterpolate(education.school)}</h3><span class="text-gray-600 text-right">${ssrInterpolate(education.year)}</span></div></div>`);
        if (education.logo) {
          _push(`<img${ssrRenderAttr("src", education.logo)}${ssrRenderAttr("alt", `${education.school} logo`)} class="absolute right-6 top-6 w-12 h-12 object-contain">`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Education.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = {
  __name: "Resume",
  __ssrInlineRender: true,
  setup(__props) {
    const { $gsap, $ScrollTrigger } = useNuxtApp();
    const activeTab = ref("about");
    const resumeContainer = ref(null);
    ref(null);
    ref(null);
    const contentSection = ref(null);
    watch(activeTab, () => {
      if (contentSection.value) {
        $gsap.fromTo(
          contentSection.value,
          {
            opacity: 0,
            y: 10
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out"
          }
        );
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "resumeContainer",
        ref: resumeContainer,
        class: "container max-w-6xl mx-auto p-8"
      }, _attrs))}><div class="flex items-center mb-8"><h1 class="text-3xl font-bold">More About Me</h1><div class="h-1 hidden md:block bg-orange-400 w-32 ml-4"></div></div><div class="mb-8 border-b border-gray-300"><nav class="-mb-px flex space-x-8" aria-label="Tabs"><button class="${ssrRenderClass([
        "whitespace-nowrap py-4 px-1 border-b-2 ",
        activeTab.value === "about" ? "border-orange-400 text-black" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
      ])}"> About </button><button class="${ssrRenderClass([
        "whitespace-nowrap py-4 px-1 border-b-2 ",
        activeTab.value === "skills" ? "border-orange-400 text-black" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
      ])}"> Skills </button><button class="${ssrRenderClass([
        "whitespace-nowrap py-4 px-1 border-b-2 ",
        activeTab.value === "education" ? "border-orange-400 text-black" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
      ])}"> Education </button></nav></div><div>`);
      if (activeTab.value === "about") {
        _push(`<div>`);
        _push(ssrRenderComponent(_sfc_main$8, null, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (activeTab.value === "skills") {
        _push(`<div>`);
        _push(ssrRenderComponent(_sfc_main$7, null, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (activeTab.value === "education") {
        _push(`<div>`);
        _push(ssrRenderComponent(_sfc_main$6, null, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Resume.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = {
  __name: "Experience",
  __ssrInlineRender: true,
  setup(__props) {
    const { $gsap, $ScrollTrigger } = useNuxtApp();
    const experiences = [
      {
        period: "June 2024 – Present",
        title: "SEO Developer",
        company: "Mad Genius",
        description: "Full-stack web development using Nuxt, React, React Native, Laravel, WordPress, and more. Leading SEO initiatives and comprehensive digital marketing strategies for enterprise clients including Yates Construction, Regional Homes, and the Mississippi State Department of Health.",
        achievements: [
          "Develop and execute SEO and digital marketing strategies with in-depth audits covering web presence, AI integration, and social media optimization including YouTube SEO.",
          "Build and maintain WordPress sites, headless WordPress implementations with Nuxt, React Native mobile applications, and full-stack Laravel web applications.",
          "Work fluently between multiple teams to properly implement development standards and SEO content across all client projects.",
          "Design and build various internal tools including web crawlers and automation scripts to streamline SEO analysis and reporting processes."
        ],
        logo: "/images/madg.png"
      },
      {
        period: "December 2023 – June 2024",
        title: "Marketing Project Manager",
        company: "Thompson Machinery",
        description: "Led comprehensive marketing and data initiatives across multiple divisions while managing a small team and developing technical solutions.",
        achievements: [
          "Spearheaded multi-channel advertising campaigns including email, PPC, and social media while building custom landing pages using Next.js, TailwindCSS, and WordPress.",
          "Developed internal tools and automation using Microsoft Power Apps, .NET/C#, and Microsoft Dynamics to streamline workflows and customer journeys.",
          "Created data visualization solutions with Power BI and MySQL databases to track sales metrics and market share, while implementing SEO strategies using Google Analytics and Semrush."
        ],
        logo: "/images/thompson.png"
      },
      {
        period: "September 2022 – December 2023",
        title: "Marketing Project Manager",
        company: "Finders Guide",
        description: "Led web development and digital marketing initiatives for multiple clients while managing remote teams and implementing comprehensive branding strategies.",
        achievements: [
          "Developed modern web solutions using React, Next.js, and Svelte.js while creating high-converting landing pages and implementing SEO strategies to expand client market reach.",
          "Established complete branding strategies for diverse clients including construction, VFX, and manufacturing companies while optimizing their business processes and data utilization."
        ],
        logo: "/images/g2.png"
      },
      {
        period: "March 2022 – January 2023",
        title: "Customer Support Specialist",
        company: "Core Logic",
        description: "Provided expert software support and customer service while collaborating with development teams to enhance product features and user experience.",
        achievements: [
          "Maintained an exceptional 95% customer satisfaction score while providing specialized support for industry-specific software including DASH, Pro-Assist, and Xactimate",
          "Facilitated effective communication between customers and development teams using Jira and Salesforce while working in an agile SCRUM environment"
        ],
        logo: "/images/corelogic.webp"
      },
      {
        period: "January 2018 – December 2020",
        title: "Media Coordinator",
        company: "LMC",
        description: "Managed end-to-end video production projects while coordinating content strategy and advertising campaigns for diverse clients including artists and businesses.",
        achievements: [
          "Produced and edited over 100 media projects including music videos and commercials while ensuring consistent quality and client satisfaction throughout the creative process",
          "Orchestrated social media content management using Hootsuite to enhance consumer engagement while maintaining strict project schedules and deadlines"
        ],
        logo: "/images/IDLOGO.png"
      }
    ];
    const selectedIndex = ref(0);
    const contentContainer = ref(null);
    const experienceSection = ref(null);
    ref(null);
    ref(null);
    ref(null);
    const selectedExperience = computed(() => experiences[selectedIndex.value]);
    watch(selectedExperience, () => {
      if (contentContainer.value) {
        $gsap.fromTo(
          contentContainer.value,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
        );
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        ref_key: "experienceSection",
        ref: experienceSection,
        class: "max-w-6xl mx-auto p-6"
      }, _attrs))}><h1 class="text-3xl font-bold mb-2">Experience &amp; Projects</h1><p class="text-gray-600 mb-8"> My work history. From creating marketing strategies to slinging code. </p><div class="flex flex-col md:flex-row gap-y-8 md:gap-x-12"><div class="w-full md:w-1/4 md:sticky top-20 h-full"><ul class="flex flex-row flex-wrap items-center gap-x-4 gap-y-1 md:flex-col md:items-stretch md:gap-0 md:space-y-4"><!--[-->`);
      ssrRenderList(experiences, (experience, index) => {
        _push(`<li class="${ssrRenderClass([
          "border-b-4 md:border-l-4 md:border-b-0 transition-colors duration-200 whitespace-nowrap",
          selectedIndex.value === index ? "border-orange-400" : "border-transparent"
        ])}"><button class="${ssrRenderClass([
          "w-full text-left py-2 px-2 md:px-4",
          selectedIndex.value === index ? "text-black" : "text-gray-500 hover:text-black"
        ])}">${ssrInterpolate(experience.company)}</button></li>`);
      });
      _push(`<!--]--></ul></div><div class="w-full md:w-3/4">`);
      if (selectedExperience.value) {
        _push(`<div class="flex flex-col-reverse md:flex-row gap-8 items-start"><div class="flex-grow space-y-4"><div><div class="text-xs text-black-light font-medium">${ssrInterpolate(selectedExperience.value.period)}</div><div class="text-lg font-bold">${ssrInterpolate(selectedExperience.value.title)} @ <span class="text-orange-400">${ssrInterpolate(selectedExperience.value.company)}</span></div></div><div class="text-sm text-gray-600">${ssrInterpolate(selectedExperience.value.description)}</div><ul class="text-sm text-gray-600 flex flex-col gap-y-1.5"><!--[-->`);
        ssrRenderList(selectedExperience.value.achievements, (achievement, index) => {
          _push(`<li class="flex gap-x-2 items-start"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" class="w-3.5 h-3.5 pt-1.5 shrink-0"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"></path></svg><span>${ssrInterpolate(achievement)}</span></li>`);
        });
        _push(`<!--]--></ul></div><div class="hidden md:block flex-shrink-0 self-center md:self-auto">`);
        if (selectedExperience.value.logo) {
          _push(`<img${ssrRenderAttr("src", selectedExperience.value.logo)}${ssrRenderAttr("alt", `${selectedExperience.value.company} logo`)} class="${ssrRenderClass([
            "w-24 h-24 object-contain",
            selectedExperience.value.company === "Finders Guide" ? "scale-75" : ""
          ])}" width="96" height="96" loading="lazy" decoding="async">`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></section>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Experience.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = {
  __name: "Projects",
  __ssrInlineRender: true,
  setup(__props) {
    const { $gsap, $ScrollTrigger } = useNuxtApp();
    const projects = [
      {
        title: "Mad Genius - 5.0",
        description: "High-performance charting library for React Native powered by Reanimated, Skia, Gesture Handler, and D3.",
        image: "/images/madgcover.png",
        link: "https://madg.com/",
        technologies: [
          "logos:nuxt-icon",
          "logos:typescript-icon",
          "logos:tailwindcss-icon",
          "logos:wordpress-icon",
          "logos:graphql",
          "logos:wpengine"
        ]
      },
      {
        title: "Yates Construction",
        description: "A Raycast extension for running Open Source Intelligence checks on a domain.",
        image: "/images/Yates.png",
        link: "https://wgyates.com/",
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
        description: "A type and runtime safe query builder for the GROQ query language.",
        image: "/images/Regional.png",
        link: "https://regionalhomes.net/",
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
        description: "A screen recording app built with web technologies.",
        image: "/images/EGH.png",
        link: "https://eleyguildhardy.com/",
        technologies: [
          "logos:wordpress-icon",
          "logos:tailwindcss-icon",
          "logos:wpengine"
        ]
      },
      {
        title: "Lusco's Restaurant",
        description: "An interactive Mandelbrot set explorer built with WebGL.",
        image: "/images/luscos.png",
        link: "https://luscos.restaurant/",
        technologies: [
          "logos:nuxt-icon",
          "logos:tailwindcss-icon",
          "logos:wordpress-icon",
          "logos:graphql",
          "logos:wpengine"
        ]
      },
      {
        title: "React Native Zephyr",
        description: "A design system and component library for React Native.",
        image: "/images/fat8.jpg",
        link: "#",
        technologies: ["logos:react", "logos:typescript-icon"]
      }
    ];
    const activeIndex = ref(0);
    const activeProject = computed(() => projects[activeIndex.value]);
    const projectsSection = ref(null);
    ref(null);
    ref(null);
    const titleEl = ref(null);
    const descriptionEl = ref(null);
    const imageEl = ref(null);
    const techIconsEl = ref(null);
    ref(null);
    watch(activeIndex, () => {
      const textElements = [
        titleEl.value,
        descriptionEl.value,
        techIconsEl.value
      ].filter(Boolean);
      $gsap.fromTo(
        textElements,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.1
        }
      );
      $gsap.fromTo(
        imageEl.value,
        {
          opacity: 0,
          scale: 1.05
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "power3.out"
        }
      );
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        ref_key: "projectsSection",
        ref: projectsSection,
        class: "bg-gradient-to-br from-orange-400 via-orange-500 to-orange-400 py-12",
        id: "projects"
      }, _attrs))} data-v-c3a8f850><div class="max-w-6xl mx-auto p-6 relative" data-v-c3a8f850><div class="grid md:grid-cols-5 gap-8 items-center" data-v-c3a8f850><div class="md:col-span-2" data-v-c3a8f850><div class="flex items-center gap-4 mb-4 text-sm text-white" data-v-c3a8f850><div class="w-8 h-px bg-white" data-v-c3a8f850></div><span data-v-c3a8f850>${ssrInterpolate(String(activeIndex.value + 1).padStart(2, "0"))} / ${ssrInterpolate(String(projects.length).padStart(2, "0"))}</span></div><a${ssrRenderAttr("href", activeProject.value.link)} target="_blank" class="block mb-4" data-v-c3a8f850><h2 class="text-3xl font-bold text-white hover:text-orange-100 transition-colors duration-300 inline-flex items-center gap-2" data-v-c3a8f850>${ssrInterpolate(activeProject.value.title)} `);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "heroicons:arrow-right-20-solid",
        class: "w-5 h-5"
      }, null, _parent));
      _push(`</h2></a><p class="text-white mb-8" data-v-c3a8f850>${ssrInterpolate(activeProject.value.description)}</p>`);
      if (activeProject.value.technologies) {
        _push(`<div class="flex flex-wrap gap-3 mb-8" data-v-c3a8f850><!--[-->`);
        ssrRenderList(activeProject.value.technologies, (tech) => {
          _push(ssrRenderComponent(unref(Icon), {
            key: tech,
            icon: tech,
            class: "w-8 h-8 text-white"
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex gap-2" data-v-c3a8f850><button class="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-2 transition" data-v-c3a8f850>`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "heroicons:arrow-left-20-solid",
        class: "w-5 h-5"
      }, null, _parent));
      _push(`</button><button class="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-2 transition" data-v-c3a8f850>`);
      _push(ssrRenderComponent(unref(Icon), {
        icon: "heroicons:arrow-right-20-solid",
        class: "w-5 h-5"
      }, null, _parent));
      _push(`</button></div></div><div class="md:col-span-3" data-v-c3a8f850><div class="relative rounded-lg overflow-hidden border border-gray-200 w-full h-0 pb-[56.25%]" data-v-c3a8f850><img${ssrRenderAttr("src", activeProject.value.image)}${ssrRenderAttr("alt", activeProject.value.title)} class="absolute inset-0 w-full h-full object-cover" data-v-c3a8f850></div></div></div></div></section>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Projects.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-c3a8f850"]]);
const _sfc_main$2 = {
  __name: "Articles",
  __ssrInlineRender: true,
  setup(__props) {
    useNuxtApp();
    const articlesSection = ref(null);
    ref(null);
    ref(null);
    ref(null);
    const articles = [
      {
        title: "The Modern Marketer's Guide To AI Implementation",
        date: "2025-03-19",
        url: "https://madg.com/2025/03/19/the-modern-marketers-guide-to-ai-implementation/",
        description: "A comprehensive guide on integrating AI tools and strategies into modern marketing workflows, focusing on practical applications and real-world examples.",
        image: "/images/tools.png",
        bgColor: "from-yellow-400 to-yellow-500"
      },
      {
        title: "SEO in the Age of AI Search Engines",
        date: "2025-01-07",
        url: "https://madg.com/2025/01/07/seo-in-the-age-of-ai-search-engines/",
        description: "Exploring how AI-powered search engines are changing SEO practices and what marketers need to know to stay ahead of the curve.",
        image: "/images/computer.png",
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
        class: "max-w-6xl mx-auto p-6",
        id: "articles"
      }, _attrs))}><h1 class="text-3xl font-bold mb-2 font-mono">Articles</h1><p class="text-gray-600 mb-8"> Thoughts and insights on marketing, AI, and web development. </p><div class="grid md:grid-cols-2 gap-6"><!--[-->`);
      ssrRenderList(articles, (article) => {
        _push(`<article class="article-card group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl"><a${ssrRenderAttr("href", article.url)} target="_blank" rel="noopener noreferrer" class="flex flex-col h-full"><div class="${ssrRenderClass([article.bgColor, "relative h-[240px] overflow-hidden bg-gradient-to-b"])}"><img${ssrRenderAttr("src", article.image)}${ssrRenderAttr("alt", article.title)} class="absolute inset-0 w-full h-full object-contain p-8 transition-transform duration-300 group-hover:scale-105"></div><div class="p-6 flex flex-col flex-grow bg-white"><div class="flex items-start justify-between gap-4 mb-3"><h2 class="text-xl font-mono font-bold group-hover:text-orange-500 transition-colors line-clamp-2">${ssrInterpolate(article.title)}</h2><time${ssrRenderAttr("datetime", article.date)} class="text-sm text-gray-500 whitespace-nowrap font-mono">${ssrInterpolate(formatDate(article.date))}</time></div><p class="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">${ssrInterpolate(article.description)}</p><div class="flex items-center text-orange-500 group-hover:text-orange-600 transition-colors font-mono"> Read article `);
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
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
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
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "ctaSection",
        ref: ctaSection,
        class: ""
      }, _attrs))}><div class="container max-w-6xl mx-auto px-4 md:px-8 py-16 sm:py-24 text-center md:text-left"><div class="flex items-center justify-center md:justify-start mb-4"><h2 class="text-3xl font-bold text-black">Let&#39;s Work Together</h2><div class="h-1 hidden md:block bg-orange-400 w-32 ml-4"></div></div><p class="text-lg text-gray-600 mb-8 max-w-3xl mx-auto md:mx-0"> I&#39;m always looking for new projects and opportunities. If you have a project in mind or just want to say hello, feel free to reach out. Let&#39;s create something amazing together! </p><div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/contact",
        class: "inline-block bg-orange-500 text-white font-bold py-4 px-8 rounded-lg hover:bg-orange-600 transition-colors text-lg"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Get in Touch `);
          } else {
            return [
              createTextVNode(" Get in Touch ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Cta.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Full Stack Developer",
      meta: [
        { name: "description", content: "Andrew Long is a full stack developer with a passion for building web applications and marketing strategies." },
        { property: "og:title", content: "Full Stack Developer" },
        { property: "og:description", content: "Andrew Long is a full stack developer with a passion for building web applications and marketing strategies." }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Hero = __nuxt_component_0;
      const _component_Resume = _sfc_main$5;
      const _component_Experience = _sfc_main$4;
      const _component_Projects = __nuxt_component_3;
      const _component_Articles = _sfc_main$2;
      const _component_Cta = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col w-full" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_Hero, null, null, _parent));
      _push(`<main class="w-full py-12 flex flex-col justify-center gap-y-16">`);
      _push(ssrRenderComponent(_component_Resume, null, null, _parent));
      _push(ssrRenderComponent(_component_Experience, null, null, _parent));
      _push(`<div class="w-full">`);
      _push(ssrRenderComponent(_component_Projects, null, null, _parent));
      _push(`</div>`);
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
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-QwongsaB.js.map
