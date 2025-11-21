import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // For GitHub Pages, use the repository name as base path
  // Change 'neon-core-portfolio-main' to your actual repository name
  const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'neon-core-portfolio-main';
  const base = process.env.GITHUB_PAGES ? `/${repoName}/` : '/';

  return {
    base,
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
