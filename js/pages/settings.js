/**
 * SkillBridge - Settings & Data Management Page Controller
 * Manages theme switching, notification options, JSON backup export/import, and factory reset.
 */

import { AuthDemo } from '../auth-demo.js';
import { Components } from '../components.js';
import { State } from '../state.js';
import { Storage } from '../storage.js';

document.addEventListener('DOMContentLoaded', () => {
  AuthDemo.requireAuth();
  Components.renderAppShell('settings', 'Settings & Backup');

  initSettingsView();
});

function initSettingsView() {
  const settings = State.getSettings();

  // 1. Theme controls
  const darkBtn = document.getElementById('theme-btn-dark');
  const lightBtn = document.getElementById('theme-btn-light');

  const updateThemeUI = (theme) => {
    if (theme === 'dark') {
      darkBtn.classList.add('active');
      lightBtn.classList.remove('active');
    } else {
      lightBtn.classList.add('active');
      darkBtn.classList.remove('active');
    }
  };

  const currentTheme = document.documentElement.getAttribute('data-theme') || settings.theme || 'dark';
  updateThemeUI(currentTheme);

  darkBtn.onclick = () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    State.updateSettings({ theme: 'dark' });
    updateThemeUI('dark');
    Components.updateThemeIcons('dark');
    Components.showToast('Dark theme activated', 'info');
  };

  lightBtn.onclick = () => {
    document.documentElement.setAttribute('data-theme', 'light');
    State.updateSettings({ theme: 'light' });
    updateThemeUI('light');
    Components.updateThemeIcons('light');
    Components.showToast('Light theme activated', 'info');
  };

  // 2. Notification toggle
  const notifToggle = document.getElementById('setting-notifications-toggle');
  notifToggle.checked = settings.notificationsEnabled !== false;
  notifToggle.onchange = (e) => {
    State.updateSettings({ notificationsEnabled: e.target.checked });
    Components.showToast(e.target.checked ? 'In-app reminders enabled' : 'In-app reminders disabled', 'info');
  };

  // 3. Export JSON Backup
  document.getElementById('export-backup-btn').onclick = () => {
    try {
      const data = Storage.exportData();
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      a.href = url;
      a.download = `skillbridge-backup-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      Components.showToast('Backup archive downloaded successfully!', 'success');
    } catch (err) {
      console.error(err);
      Components.showToast('Failed to generate export backup', 'error');
    }
  };

  // 4. Import JSON Backup
  const fileInput = document.getElementById('import-file-input');
  document.getElementById('import-backup-btn').onclick = () => {
    fileInput.value = '';
    fileInput.click();
  };

  fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        Components.showConfirmModal({
          title: 'Restore Data From Backup',
          message: `Are you sure you want to restore data from '${file.name}'? All current skills, projects, and tasks will be replaced by the backup contents.`,
          confirmText: 'Restore Backup',
          confirmVariant: 'primary',
          onConfirm: () => {
            Storage.importData(parsed);
            Components.showToast('Backup restored successfully! Reloading...', 'success');
            setTimeout(() => window.location.reload(), 700);
          }
        });
      } catch (err) {
        Components.showToast(`Invalid JSON file format: ${err.message}`, 'error', 4000);
      }
    };
    reader.readAsText(file);
  };

  // 5. Reset Demo State
  document.getElementById('reset-factory-btn').onclick = () => {
    Components.showConfirmModal({
      title: 'Reset Demo State to Factory Defaults',
      message: 'This will reset all data stores (skills, projects, quiz scores, internships, and roadmap tasks) back to their default demo records. This action cannot be undone.',
      confirmText: 'Reset Demo Data',
      confirmVariant: 'danger',
      onConfirm: () => {
        Storage.resetAll();
        Components.showToast('Demo data reset to initial state. Reloading...', 'success');
        setTimeout(() => window.location.reload(), 600);
      }
    });
  };

  Components.initIcons();
}
