/**
 * SkillBridge - Reusable UI Components, Modal Dialogs & Shared Layout Renderer
 */

import { AuthDemo } from './auth-demo.js';
import { State } from './state.js';
import { Storage } from './storage.js';

export const Components = {
  /**
   * Initializes Lucide icon set safely
   */
  initIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  },

  /**
   * Dispatches toast notification with auto-dismiss
   */
  showToast(message, type = 'info', duration = 3500) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconName = 'info';
    if (type === 'success') iconName = 'check-circle';
    if (type === 'error') iconName = 'alert-triangle';

    toast.innerHTML = `
      <i data-lucide="${iconName}" style="width: 18px; height: 18px; flex-shrink: 0;"></i>
      <span style="flex: 1; font-weight: 500;">${message}</span>
      <button style="background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 2px;" aria-label="Close notification">&times;</button>
    `;

    const closeBtn = toast.querySelector('button');
    closeBtn.onclick = () => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-8px)';
      setTimeout(() => toast.remove(), 200);
    };

    container.appendChild(toast);
    this.initIcons();

    setTimeout(() => {
      if (toast.isConnected) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-8px)';
        setTimeout(() => toast.remove(), 200);
      }
    }, duration);
  },

  /**
   * Displays modal confirmation dialog
   */
  showConfirmModal({
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmVariant = 'danger',
    onConfirm = () => {}
  }) {
    const existing = document.getElementById('skillbridge-confirm-modal');
    if (existing) existing.remove();

    const backdrop = document.createElement('div');
    backdrop.id = 'skillbridge-confirm-modal';
    backdrop.className = 'modal-backdrop open';

    backdrop.innerHTML = `
      <div class="modal-container" style="max-width: 440px;" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
        <div class="modal-header">
          <h3 id="confirm-modal-title" class="modal-title" style="font-size: 1.1rem;">${title}</h3>
          <button class="modal-close" aria-label="Close modal">&times;</button>
        </div>
        <div class="modal-body">
          <p style="font-size: 0.925rem; line-height: 1.5; color: var(--text-secondary);">${message}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary modal-cancel-btn">${cancelText}</button>
          <button class="btn btn-${confirmVariant} modal-confirm-btn">${confirmText}</button>
        </div>
      </div>
    `;

    const close = () => {
      backdrop.classList.remove('open');
      setTimeout(() => backdrop.remove(), 250);
    };

    backdrop.querySelector('.modal-close').onclick = close;
    backdrop.querySelector('.modal-cancel-btn').onclick = close;
    backdrop.querySelector('.modal-confirm-btn').onclick = () => {
      close();
      onConfirm();
    };

    backdrop.onclick = (e) => {
      if (e.target === backdrop) close();
    };

    document.body.appendChild(backdrop);
    this.initIcons();
  },

  /**
   * Theme Manager (Dark / Light)
   */
  initTheme() {
    const settings = State.getSettings();
    const currentTheme = settings.theme || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    this.updateThemeIcons(currentTheme);
  },

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    State.updateSettings({ theme: newTheme });
    this.updateThemeIcons(newTheme);
    this.showToast(`Switched to ${newTheme} theme`, 'info', 2000);
  },

  updateThemeIcons(theme) {
    document.querySelectorAll('.theme-toggle-icon').forEach(icon => {
      icon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
    });
    this.initIcons();
  },

  /**
   * Renders the standard SaaS sidebar & header layout into page shell
   */
  renderAppShell(activeKey = 'dashboard', pageTitle = 'Dashboard') {
    const user = State.getUser();
    const initials = (user && user.name)
      ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
      : 'SB';

    const rootPath = window.location.pathname.includes('/pages/') ? '..' : '.';
    const pagesPath = window.location.pathname.includes('/pages/') ? '.' : './pages';

    const sidebarContainer = document.getElementById('app-sidebar-placeholder');
    const headerContainer = document.getElementById('app-header-placeholder');

    if (sidebarContainer) {
      sidebarContainer.innerHTML = `
        <aside class="sidebar" id="main-sidebar">
          <div class="sidebar-header">
            <a href="${rootPath}/index.html" class="sidebar-brand">
              <div class="brand-icon">
                <i data-lucide="layers" style="width: 18px; height: 18px;"></i>
              </div>
              <span class="sidebar-text">SkillBridge</span>
            </a>
            <button class="sidebar-collapse-toggle" id="sidebar-toggle-btn" aria-label="Toggle sidebar collapse">
              <i data-lucide="panel-left-close" style="width: 16px; height: 16px;"></i>
            </button>
          </div>

          <nav class="sidebar-nav">
            <div class="sidebar-section-label">Core Overview</div>
            <a href="${pagesPath}/dashboard.html" class="sidebar-link ${activeKey === 'dashboard' ? 'active' : ''}">
              <i data-lucide="layout-dashboard" class="sidebar-icon"></i>
              <span class="sidebar-text">Dashboard</span>
            </a>

            <div class="sidebar-section-label">Skill Development</div>
            <a href="${pagesPath}/skills.html" class="sidebar-link ${activeKey === 'skills' ? 'active' : ''}">
              <i data-lucide="award" class="sidebar-icon"></i>
              <span class="sidebar-text">Skills Inventory</span>
            </a>
            <a href="${pagesPath}/career-analyzer.html" class="sidebar-link ${activeKey === 'career-analyzer' ? 'active' : ''}">
              <i data-lucide="compass" class="sidebar-icon"></i>
              <span class="sidebar-text">Skill Gap Analyzer</span>
            </a>
            <a href="${pagesPath}/roadmap.html" class="sidebar-link ${activeKey === 'roadmap' ? 'active' : ''}">
              <i data-lucide="calendar" class="sidebar-icon"></i>
              <span class="sidebar-text">Learning Roadmap</span>
            </a>

            <div class="sidebar-section-label">Proof of Work</div>
            <a href="${pagesPath}/projects.html" class="sidebar-link ${activeKey === 'projects' ? 'active' : ''}">
              <i data-lucide="folder-git-2" class="sidebar-icon"></i>
              <span class="sidebar-text">Project Portfolio</span>
            </a>
            <a href="${pagesPath}/assessments.html" class="sidebar-link ${activeKey === 'assessments' ? 'active' : ''}">
              <i data-lucide="check-square" class="sidebar-icon"></i>
              <span class="sidebar-text">Assessment Center</span>
            </a>

            <div class="sidebar-section-label">Career Search</div>
            <a href="${pagesPath}/internships.html" class="sidebar-link ${activeKey === 'internships' ? 'active' : ''}">
              <i data-lucide="briefcase" class="sidebar-icon"></i>
              <span class="sidebar-text">Internship Explorer</span>
            </a>

            <div class="sidebar-section-label">Administration</div>
            <a href="${pagesPath}/admin.html" class="sidebar-link ${activeKey === 'admin' ? 'active' : ''}">
              <i data-lucide="shield-check" class="sidebar-icon"></i>
              <span class="sidebar-text">Admin Demo Hub</span>
            </a>

            <div class="sidebar-section-label">Settings</div>
            <a href="${pagesPath}/profile.html" class="sidebar-link ${activeKey === 'profile' ? 'active' : ''}">
              <i data-lucide="user" class="sidebar-icon"></i>
              <span class="sidebar-text">My Profile</span>
            </a>
            <a href="${pagesPath}/settings.html" class="sidebar-link ${activeKey === 'settings' ? 'active' : ''}">
              <i data-lucide="settings" class="sidebar-icon"></i>
              <span class="sidebar-text">Settings & Backup</span>
            </a>
          </nav>

          <div class="sidebar-footer">
            <div class="sidebar-user">
              <div class="sidebar-avatar">${initials}</div>
              <div class="sidebar-user-info sidebar-text">
                <div class="sidebar-user-name">${user.name}</div>
                <div class="sidebar-user-role">Student · Demo Mode</div>
              </div>
            </div>
            <button class="btn btn-ghost btn-sm w-full" id="sidebar-logout-btn" style="justify-content: flex-start; gap: 0.5rem; color: var(--text-muted);">
              <i data-lucide="log-out" style="width: 14px; height: 14px;"></i>
              <span class="sidebar-text">Log Out</span>
            </button>
          </div>
        </aside>
      `;
    }

    if (headerContainer) {
      headerContainer.innerHTML = `
        <header class="app-header">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <button class="mobile-menu-trigger" id="mobile-sidebar-toggle" aria-label="Open sidebar navigation">
              <i data-lucide="menu" style="width: 20px; height: 20px;"></i>
            </button>
            <div class="header-breadcrumbs">
              <a href="${rootPath}/index.html">SkillBridge</a>
              <span style="opacity: 0.5;">/</span>
              <span class="current">${pageTitle}</span>
            </div>
          </div>

          <div class="header-actions">
            <a href="${pagesPath}/projects.html?tab=preview" class="btn btn-outline btn-sm" style="display: inline-flex; align-items: center; gap: 0.35rem;">
              <i data-lucide="external-link" style="width: 14px; height: 14px;"></i>
              <span class="hidden-mobile">View Portfolio</span>
            </a>
            <button class="theme-toggle-btn" id="header-theme-toggle" aria-label="Toggle theme mode" title="Toggle theme">
              <i data-lucide="sun" class="theme-toggle-icon" style="width: 16px; height: 16px;"></i>
            </button>
            <button class="btn btn-secondary btn-sm" id="quick-reset-demo-btn" title="Reset all demo data to pristine default">
              <i data-lucide="rotate-ccw" style="width: 14px; height: 14px;"></i>
              <span class="hidden-mobile">Reset Demo</span>
            </button>
          </div>
        </header>
      `;
    }

    // Attach Event Listeners
    const sidebar = document.getElementById('main-sidebar');
    const collapseBtn = document.getElementById('sidebar-toggle-btn');
    if (collapseBtn && sidebar) {
      collapseBtn.onclick = () => {
        sidebar.classList.toggle('collapsed');
        const isCollapsed = sidebar.classList.contains('collapsed');
        collapseBtn.querySelector('i')?.setAttribute(
          'data-lucide',
          isCollapsed ? 'panel-left-open' : 'panel-left-close'
        );
        this.initIcons();
      };
    }

    const mobileToggle = document.getElementById('mobile-sidebar-toggle');
    if (mobileToggle && sidebar) {
      mobileToggle.onclick = () => {
        sidebar.classList.toggle('mobile-open');
      };
      // Close on click outside
      document.addEventListener('click', (e) => {
        if (sidebar.classList.contains('mobile-open') &&
            !sidebar.contains(e.target) &&
            !mobileToggle.contains(e.target)) {
          sidebar.classList.remove('mobile-open');
        }
      });
    }

    const themeBtn = document.getElementById('header-theme-toggle');
    if (themeBtn) {
      themeBtn.onclick = () => this.toggleTheme();
    }

    const logoutBtn = document.getElementById('sidebar-logout-btn');
    if (logoutBtn) {
      logoutBtn.onclick = () => {
        this.showConfirmModal({
          title: 'Sign Out Demo Account',
          message: 'You are about to sign out of the demonstration session. You can sign back in anytime using the demo account.',
          confirmText: 'Sign Out',
          confirmVariant: 'secondary',
          onConfirm: () => AuthDemo.logout()
        });
      };
    }

    const resetBtn = document.getElementById('quick-reset-demo-btn');
    if (resetBtn) {
      resetBtn.onclick = () => {
        this.showConfirmModal({
          title: 'Reset Demo Data to Initial State',
          message: 'This will reset all skills, projects, quiz records, roadmap tasks, and internship listings to their default demo states. Do you wish to continue?',
          confirmText: 'Reset Demo Data',
          confirmVariant: 'danger',
          onConfirm: () => {
            Storage.resetAll();
            Components.showToast('Demo data successfully restored to factory defaults.', 'success');
            setTimeout(() => window.location.reload(), 600);
          }
        });
      };
    }

    this.initTheme();
    this.initIcons();
  }
};
