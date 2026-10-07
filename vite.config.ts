import { lingui } from '@lingui/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig, loadEnv } from 'vite';
import viteTsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      devtools(),
      nitro(),
      viteTsConfigPaths({
        projects: ['./tsconfig.json']
      }),
      tailwindcss(),
      lingui(),
      tanstackStart(),
      viteReact({
        babel: {
          plugins: ['@lingui/babel-plugin-lingui-macro']
        }
      })
    ],
    preview: {
      allowedHosts: env.ALLOWED_HOSTS ? (JSON.parse(env.ALLOWED_HOSTS) as string[]) : true
    }
  };
});
