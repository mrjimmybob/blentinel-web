import { defineCollection } from 'astro:content';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  // Starlight always reads this collection for UI string overrides. Defining it (with no
  // files in src/content/i18n/) is the documented setup and keeps the built-in English strings.
  i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
};
