import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves each deploy target from its own repo-name subpath.
// Local dev (`vite`, mode 'development') falls through to the root path.
// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base:
    mode === 'production'
      ? '/GoodMorningGorgeous/'
      : mode === 'staging'
        ? '/GoodMorningGorgeous-staging/'
        : '/',
}))
