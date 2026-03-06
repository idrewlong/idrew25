<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue';

const { $gsap } = useNuxtApp();

useSeoMeta({
  title: 'Contact',
  ogTitle: 'Get in Touch with Andrew Long',
  description:
    'Connect with Andrew Long, a full stack developer specializing in web development and marketing. Reach out for collaboration, or just to say hello!',
  ogDescription:
    'Connect with Andrew Long, a full stack developer specializing in web development and marketing. Reach out for collaboration, or just to say hello!',
  ogImage: '/images/OG.webp',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Contact',
  twitterDescription:
    'Connect with Andrew Long, a full stack developer specializing in web development and marketing. Reach out for collaboration, or just to say hello!.',
});

// Form state
const form = ref({ name: '', email: '', message: '' });
const isSubmitting = ref(false);
const result = ref('');
const status = ref('');

// Template refs
const contactSection = ref(null);
const labelEl = ref(null);
const headingEl = ref(null);
const formEl = ref(null);
const sidebarEl = ref(null);

const submitForm = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  result.value = 'Sending message...';
  status.value = 'info';

  try {
    const response = await $fetch<{ success: boolean }>('/api/contact', {
      method: 'POST',
      body: {
        name: form.value.name,
        email: form.value.email,
        message: form.value.message,
      },
    });

    if (response.success) {
      status.value = 'success';
      result.value = "Message sent — I'll be in touch soon.";
      form.value = { name: '', email: '', message: '' };
    } else {
      status.value = 'error';
      result.value = 'Something went wrong. Please try again.';
    }
  } catch {
    status.value = 'error';
    result.value = 'Failed to send message. Please try again later.';
  } finally {
    isSubmitting.value = false;
    setTimeout(() => {
      result.value = '';
      status.value = '';
    }, 5000);
  }
};

onMounted(() => {
  nextTick(() => {
    if (!contactSection.value) return;

    $gsap.set([labelEl.value, headingEl.value], { opacity: 0, y: 24 });
    $gsap.set(formEl.value, { opacity: 0, y: 30 });
    $gsap.set(sidebarEl.value, { opacity: 0, y: 20 });

    const tl = $gsap.timeline({ delay: 0.15 });

    tl.to(labelEl.value, {
      opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
    })
      .to(headingEl.value, {
        opacity: 1, y: 0, duration: 0.9, ease: 'expo.out',
      }, '-=0.35')
      .to(formEl.value, {
        opacity: 1, y: 0, duration: 0.85, ease: 'power2.out',
      }, '-=0.5')
      .to(sidebarEl.value, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', clearProps: 'all',
      }, '-=0.5');
  });
});
</script>

<template>
  <section ref="contactSection" class="contact-page max-w-6xl mx-auto px-4 sm:px-6">
    <!-- Section label — matches rest of site -->
    <div ref="labelEl" class="flex items-center gap-3 mb-6 sm:mb-10 md:mb-14">
      <span class="text-[10px] font-bold tracking-[0.25em] uppercase text-stone-400">Contact</span>
      <div class="flex-1 h-px bg-stone-200"></div>
      <span class="text-[9px] font-mono tracking-[0.15em] uppercase text-stone-300">Say Hello</span>
    </div>

    <!-- Heading -->
    <div ref="headingEl" class="mb-10 sm:mb-16">
      <h1 class="contact-title font-serif italic text-stone-900 leading-[0.92] tracking-tight">
        Let's build<br />something great.
      </h1>
      <p class="mt-5 text-sm text-stone-500 leading-relaxed max-w-md">
        Have a project in mind, want to collaborate, or just want to connect?
        Drop me a line — I'd love to hear from you.
      </p>
    </div>

    <!-- Editorial split: form + sidebar -->
    <div class="flex flex-col md:flex-row border-t border-stone-200">
      <!-- Left: Contact form -->
      <div ref="formEl" class="flex-1 py-10 md:py-14 md:pr-14 md:border-r border-stone-200">
        <form @submit.prevent="submitForm" class="space-y-8">
          <!-- Name -->
          <div class="form-field">
            <label class="form-label">
              <span class="text-orange-500 mr-1.5">✦</span>Name
            </label>
            <input
              type="text"
              required
              v-model="form.name"
              class="form-input"
              placeholder="Your name"
            />
          </div>

          <!-- Email -->
          <div class="form-field">
            <label class="form-label">
              <span class="text-orange-500 mr-1.5">✦</span>Email
            </label>
            <input
              type="email"
              required
              v-model="form.email"
              class="form-input"
              placeholder="you@example.com"
            />
          </div>

          <!-- Message -->
          <div class="form-field">
            <label class="form-label">
              <span class="text-orange-500 mr-1.5">✦</span>Message
            </label>
            <textarea
              required
              v-model="form.message"
              rows="5"
              class="form-input resize-none"
              placeholder="Tell me about your project..."
            ></textarea>
          </div>

          <!-- Honeypot -->
          <input type="checkbox" name="botcheck" class="hidden" style="display: none" />

          <!-- Status -->
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1"
          >
            <div
              v-if="result"
              :class="[
                'status-message',
                status === 'success' ? 'status-success' :
                status === 'error' ? 'status-error' : 'status-info',
              ]"
            >
              <Icon
                :name="status === 'success' ? 'heroicons:check-circle' : status === 'error' ? 'heroicons:exclamation-circle' : 'heroicons:arrow-path'"
                class="w-4 h-4 shrink-0"
                :class="{ 'animate-spin': status === 'info' }"
              />
              <span>{{ result }}</span>
            </div>
          </Transition>

          <!-- Submit -->
          <button type="submit" :disabled="isSubmitting" class="submit-btn group">
            <span class="text-[10px] tracking-[0.25em] uppercase font-mono">
              {{ isSubmitting ? 'Sending...' : 'Send Message' }}
            </span>
            <Icon
              name="heroicons:arrow-up-right-20-solid"
              class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </button>
        </form>
      </div>

      <!-- Right: Contact info sidebar -->
      <div ref="sidebarEl" class="w-full md:w-72 lg:w-80 py-10 md:py-14 md:pl-12">
        <!-- Direct contact -->
        <div class="sidebar-block">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-orange-500 text-[10px]">✦</span>
            <span class="text-[9px] tracking-[0.25em] uppercase text-stone-400 font-mono">Email</span>
          </div>
          <a
            href="mailto:idrewlong@gmail.com"
            class="text-xs text-stone-700 font-mono hover:text-orange-500 transition-colors duration-200"
          >
            idrewlong@gmail.com
          </a>
        </div>

        <div class="h-px bg-stone-200 my-7"></div>

        <!-- Social -->
        <div class="sidebar-block">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-orange-500 text-[10px]">✦</span>
            <span class="text-[9px] tracking-[0.25em] uppercase text-stone-400 font-mono">Connect</span>
          </div>
          <div class="flex items-center gap-2">
            <a
              href="https://github.com/idrewlong"
              target="_blank"
              rel="noopener noreferrer"
              class="social-icon"
              aria-label="GitHub"
            >
              <Icon name="ph:github-logo-fill" class="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/idrewlong/"
              target="_blank"
              rel="noopener noreferrer"
              class="social-icon"
              aria-label="LinkedIn"
            >
              <Icon name="ph:linkedin-logo-fill" class="w-4 h-4" />
            </a>
          </div>
        </div>

        <div class="h-px bg-stone-200 my-7"></div>

        <!-- Location -->
        <div class="sidebar-block">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-orange-500 text-[10px]">✦</span>
            <span class="text-[9px] tracking-[0.25em] uppercase text-stone-400 font-mono">Based In</span>
          </div>
          <p class="text-xs text-stone-700 font-mono">Long Beach, MS</p>
        </div>

        <div class="h-px bg-stone-200 my-7"></div>

        <!-- Availability -->
        <div class="sidebar-block">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-orange-500 text-[10px]">✦</span>
            <span class="text-[9px] tracking-[0.25em] uppercase text-stone-400 font-mono">Status</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot"></span>
            <p class="text-xs text-stone-700 font-mono">Open to opportunities</p>
          </div>
        </div>

        <div class="h-px bg-stone-900 my-7"></div>

        <!-- Resume download -->
        <a href="/resume.pdf" download class="resume-btn group">
          <span class="text-[10px] tracking-[0.25em] uppercase font-mono">Download Resume</span>
          <Icon
            name="heroicons:arrow-down-tray"
            class="w-4 h-4 transition-transform duration-200 group-hover:translate-y-0.5"
          />
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact-page {
  padding-top: 2rem;
  padding-bottom: 4rem;
}

@media (min-width: 768px) {
  .contact-page {
    padding-top: 3rem;
    padding-bottom: 6rem;
  }
}

.contact-title {
  font-size: clamp(2.5rem, 8vw, 6rem);
}

/* Form fields */
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 9px;
  font-family: 'Geist Mono', monospace;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #a8a29e; /* stone-400 */
}

.form-input {
  width: 100%;
  padding: 0.75rem 0;
  border: none;
  border-bottom: 1px solid #e7e5e0;
  background: transparent;
  color: var(--text);
  font-size: 0.875rem;
  font-family: inherit;
  transition: border-color 0.2s ease;
  outline: none;
}

.form-input::placeholder {
  color: #d6d3d1; /* stone-300 */
  font-size: 0.8125rem;
}

.form-input:focus {
  border-bottom-color: var(--accent);
}

/* Status messages */
.status-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 0;
  font-size: 0.75rem;
  font-family: 'Geist Mono', monospace;
  letter-spacing: 0.04em;
}

.status-success {
  color: #059669;
}

.status-error {
  color: #dc2626;
}

.status-info {
  color: var(--accent);
}

/* Submit button — matches CTA style */
.submit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 20rem;
  background: var(--text);
  color: #fafaf9;
  padding: 0.875rem 1.25rem;
  transition: background 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  background: #44403c;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Sidebar */
.social-icon {
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid #d6d3d1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #57534e;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.social-icon:hover {
  border-color: var(--text);
  color: var(--text);
}

/* Resume download button */
.resume-btn {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border: 1px solid #d6d3d1;
  color: #57534e;
  padding: 0.875rem 1.25rem;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.resume-btn:hover {
  border-color: var(--text);
  color: var(--text);
}

/* Pulse dot */
.pulse-dot {
  animation: pulse-dot 2.4s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.25; }
}
</style>
