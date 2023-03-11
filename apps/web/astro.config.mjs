import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

import react from '@astrojs/react';
import aws from 'astro-sst/lambda';

const isProduction = process.env.STAGE === 'prod';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: aws(),
  integrations: [tailwind(), react()],
  site: isProduction ? process.env.VITE_SITE_URL : undefined,
});
