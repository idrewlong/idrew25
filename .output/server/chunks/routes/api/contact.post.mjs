import { d as defineEventHandler, u as useRuntimeConfig, r as readBody, c as createError } from '../../nitro/nitro.mjs';
import 'lru-cache';
import '@unocss/core';
import '@unocss/preset-wind';
import 'devalue';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'vue';
import 'consola/core';
import 'node:url';
import '@iconify/utils';
import 'node:module';
import 'ipx';

const contact_post = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  try {
    return await $fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: {
        ...body,
        access_key: config.ACCESS_KEY,
        subject: `New Contact Form Submission from ${body.name} - idrewlong.com`
      }
    });
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to send message"
    });
  }
});

export { contact_post as default };
//# sourceMappingURL=contact.post.mjs.map
