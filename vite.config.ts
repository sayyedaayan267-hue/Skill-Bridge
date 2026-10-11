import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          login: path.resolve(__dirname, 'pages/login.html'),
          register: path.resolve(__dirname, 'pages/register.html'),
          dashboard: path.resolve(__dirname, 'pages/dashboard.html'),
          skills: path.resolve(__dirname, 'pages/skills.html'),
          careerAnalyzer: path.resolve(__dirname, 'pages/career-analyzer.html'),
          projects: path.resolve(__dirname, 'pages/projects.html'),
          assessments: path.resolve(__dirname, 'pages/assessments.html'),
          internships: path.resolve(__dirname, 'pages/internships.html'),
          roadmap: path.resolve(__dirname, 'pages/roadmap.html'),
          profile: path.resolve(__dirname, 'pages/profile.html'),
          settings: path.resolve(__dirname, 'pages/settings.html'),
          admin: path.resolve(__dirname, 'pages/admin.html'),
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
