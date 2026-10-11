/**
 * SkillBridge - Project Portfolio Page Controller
 * Manages project CRUD, status lifecycle, filtering, and recruiter preview presentation.
 */

import { AuthDemo } from '../auth-demo.js';
import { Components } from '../components.js';
import { State } from '../state.js';
import { Validation } from '../validation.js';

let activeStatusFilter = 'ALL';
let activeCategoryFilter = 'ALL';
let searchQuery = '';
let currentView = 'manage'; // 'manage' or 'preview'

document.addEventListener('DOMContentLoaded', () => {
  AuthDemo.requireAuth();
  Components.renderAppShell('projects', 'Project Portfolio');

  // Check query parameter for ?tab=preview or ?action=new
  const params = new URLSearchParams(window.location.search);
  if (params.get('tab') === 'preview') {
    setView('preview');
  } else {
    setView('manage');
  }

  if (params.get('action') === 'new') {
    openProjectModal();
  }

  initEventListeners();
  renderProjects();
});

function initEventListeners() {
  // View mode tab toggles
  document.getElementById('tab-manage-view').onclick = () => setView('manage');
  document.getElementById('tab-preview-view').onclick = () => setView('preview');

  // Search & Filter
  const searchInput = document.getElementById('project-search-input');
  const statusFilter = document.getElementById('project-status-filter');
  const categoryFilter = document.getElementById('project-category-filter');

  searchInput.oninput = (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderProjects();
  };

  statusFilter.onchange = (e) => {
    activeStatusFilter = e.target.value;
    renderProjects();
  };

  categoryFilter.onchange = (e) => {
    activeCategoryFilter = e.target.value;
    renderProjects();
  };

  // Modal triggers
  document.getElementById('open-add-project-modal').onclick = () => openProjectModal();
  document.getElementById('empty-add-project-btn').onclick = () => openProjectModal();

  const modalBackdrop = document.getElementById('project-modal');
  const modalClose = document.getElementById('project-modal-close');
  const modalCancel = document.getElementById('project-modal-cancel');

  const closeModal = () => modalBackdrop.classList.remove('open');
  modalClose.onclick = closeModal;
  modalCancel.onclick = closeModal;
  modalBackdrop.onclick = (e) => {
    if (e.target === modalBackdrop) closeModal();
  };

  // Form submit
  document.getElementById('project-form').onsubmit = handleProjectFormSubmit;

  // Copy portfolio URL button
  const copyBtn = document.getElementById('copy-portfolio-url-btn');
  if (copyBtn) {
    copyBtn.onclick = () => {
      const shareUrl = `${window.location.origin}${window.location.pathname}?tab=preview`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl).then(() => {
          Components.showToast('Shareable portfolio link copied to clipboard!', 'success');
        }).catch(() => {
          fallbackCopyText(shareUrl);
        });
      } else {
        fallbackCopyText(shareUrl);
      }
    };
  }
}

function fallbackCopyText(text) {
  const tempInput = document.createElement('input');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  Components.showToast('Shareable portfolio link copied to clipboard!', 'success');
}

function setView(view) {
  currentView = view;
  const manageContainer = document.getElementById('projects-manage-container');
  const previewContainer = document.getElementById('projects-preview-container');
  const manageTab = document.getElementById('tab-manage-view');
  const previewTab = document.getElementById('tab-preview-view');

  if (view === 'preview') {
    manageContainer.style.display = 'none';
    previewContainer.style.display = 'block';
    manageTab.classList.remove('active');
    previewTab.classList.add('active');
    renderRecruiterPreview();
  } else {
    manageContainer.style.display = 'block';
    previewContainer.style.display = 'none';
    manageTab.classList.add('active');
    previewTab.classList.remove('active');
    renderProjects();
  }
  Components.initIcons();
}

function renderProjects() {
  const grid = document.getElementById('projects-grid');
  const emptyState = document.getElementById('projects-empty-state');
  if (!grid) return;

  let projects = State.getProjects();

  // Search
  if (searchQuery) {
    projects = projects.filter(p =>
      p.title.toLowerCase().includes(searchQuery) ||
      p.description.toLowerCase().includes(searchQuery) ||
      (p.technologies && p.technologies.some(t => t.toLowerCase().includes(searchQuery)))
    );
  }

  // Status
  if (activeStatusFilter !== 'ALL') {
    projects = projects.filter(p => p.status === activeStatusFilter);
  }

  // Category
  if (activeCategoryFilter !== 'ALL') {
    projects = projects.filter(p => p.category === activeCategoryFilter);
  }

  if (projects.length === 0) {
    grid.innerHTML = '';
    emptyState.style.display = 'block';
    Components.initIcons();
    return;
  }

  emptyState.style.display = 'none';

  grid.innerHTML = projects.map(proj => {
    let statusClass = 'status-planned';
    if (proj.status === 'Completed') statusClass = 'status-completed';
    else if (proj.status === 'In Progress') statusClass = 'status-in-progress';

    const techList = Array.isArray(proj.technologies)
      ? proj.technologies
      : (proj.technologies ? proj.technologies.split(',').map(t => t.trim()) : []);

    return `
      <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
            <div>
              <h3 style="font-size: 1.15rem; color: var(--text-primary); margin-bottom: 0.2rem;">
                ${Validation.escapeHTML(proj.title)}
              </h3>
              <div class="meta-list">
                <span>${Validation.escapeHTML(proj.category)}</span>
                <span class="meta-separator">·</span>
                <span class="tabular-nums font-mono">${proj.date || 'Active'}</span>
              </div>
            </div>
            <span class="status-indicator ${statusClass}">
              ${Validation.escapeHTML(proj.status)}
            </span>
          </div>

          <p style="font-size: 0.8125rem; color: var(--text-secondary); line-height: 1.5; margin: 0.875rem 0; min-height: 3.5rem;">
            ${Validation.escapeHTML(proj.description)}
          </p>

          <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 1.25rem;">
            ${techList.map(t => `
              <span style="font-size: 0.725rem; padding: 0.15rem 0.5rem; background: var(--bg-canvas); border: 1px solid var(--border-subtle); border-radius: var(--radius-xs); color: var(--text-secondary); font-family: var(--font-mono);">
                ${Validation.escapeHTML(t)}
              </span>
            `).join('')}
          </div>
        </div>

        <div>
          <!-- Link Affordances -->
          <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--border-subtle);">
            ${proj.githubUrl ? `
              <a href="${Validation.escapeHTML(proj.githubUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm" style="font-size: 0.75rem; gap: 0.35rem;">
                <i data-lucide="github" style="width: 14px; height: 14px;"></i>
                <span>Repository</span>
              </a>
            ` : '<span style="font-size: 0.75rem; color: var(--text-muted);">No Repo Link</span>'}

            ${proj.liveUrl ? `
              <a href="${Validation.escapeHTML(proj.liveUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="font-size: 0.75rem; gap: 0.35rem;">
                <i data-lucide="external-link" style="width: 14px; height: 14px;"></i>
                <span>Live Demo</span>
              </a>
            ` : ''}
          </div>

          <!-- Edit & Delete buttons -->
          <div style="display: flex; align-items: center; justify-content: flex-end; gap: 0.5rem;">
            <button class="btn btn-secondary btn-sm edit-project-btn" data-project-id="${proj.id}">
              <i data-lucide="edit-3" style="width: 14px; height: 14px;"></i>
              <span>Edit</span>
            </button>
            <button class="btn btn-outline btn-sm delete-project-btn" data-project-id="${proj.id}" style="color: var(--color-danger); border-color: rgba(239, 68, 68, 0.3);">
              <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Card Event Listeners
  grid.querySelectorAll('.edit-project-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-project-id');
      const project = State.getProjects().find(p => p.id === id);
      if (project) openProjectModal(project);
    };
  });

  grid.querySelectorAll('.delete-project-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-project-id');
      const project = State.getProjects().find(p => p.id === id);
      if (!project) return;

      Components.showConfirmModal({
        title: `Delete Project: ${project.title}`,
        message: `Are you sure you want to delete this project from your portfolio? This will decrease your overall Career Readiness score.`,
        confirmText: 'Delete Project',
        confirmVariant: 'danger',
        onConfirm: () => {
          State.deleteProject(id);
          Components.showToast(`Deleted project '${project.title}'`, 'info');
          renderProjects();
        }
      });
    };
  });

  Components.initIcons();
}

function renderRecruiterPreview() {
  const user = State.getUser() || {};
  const skills = State.getSkills();
  const projects = State.getProjects();

  document.getElementById('portfolio-user-name').textContent = user.name || 'Alex Rivera';
  document.getElementById('portfolio-user-headline').textContent = user.headline || 'Full Stack Software Engineer';
  document.getElementById('portfolio-user-education').textContent = user.education || 'Computer Science Candidate';
  document.getElementById('portfolio-user-bio').textContent = user.bio || 'Computer Science student with strong foundations in software architecture.';

  const ghLink = document.getElementById('portfolio-github-link');
  if (user.githubUrl) {
    ghLink.href = user.githubUrl;
    ghLink.style.display = 'inline-flex';
  } else {
    ghLink.style.display = 'none';
  }

  const inLink = document.getElementById('portfolio-linkedin-link');
  if (user.linkedinUrl) {
    inLink.href = user.linkedinUrl;
    inLink.style.display = 'inline-flex';
  } else {
    inLink.style.display = 'none';
  }

  // Skills Cloud
  const skillsCloud = document.getElementById('portfolio-skills-cloud');
  skillsCloud.innerHTML = skills.map(s => `
    <div style="display: flex; align-items: center; gap: 0.35rem; padding: 0.35rem 0.75rem; background: var(--bg-canvas); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); font-size: 0.8125rem;">
      <strong style="color: var(--text-primary);">${Validation.escapeHTML(s.name)}</strong>
      <span style="font-size: 0.725rem; color: var(--accent-blue);">(${s.proficiency})</span>
    </div>
  `).join('');

  // Projects List
  const projectsList = document.getElementById('portfolio-projects-list');
  document.getElementById('portfolio-project-count').textContent = `${projects.length} Verified Project(s)`;

  projectsList.innerHTML = projects.map(p => {
    const techList = Array.isArray(p.technologies)
      ? p.technologies
      : (p.technologies ? p.technologies.split(',').map(t => t.trim()) : []);

    return `
      <div style="padding: 1.5rem; background: var(--bg-canvas); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <h4 style="font-size: 1.25rem; color: var(--text-primary); margin-bottom: 0.2rem;">
              ${Validation.escapeHTML(p.title)}
            </h4>
            <div class="meta-list">
              <span>${Validation.escapeHTML(p.category)}</span>
              <span class="meta-separator">·</span>
              <span style="color: ${p.status === 'Completed' ? 'var(--color-success)' : 'var(--accent-blue)'}; font-weight: 600;">
                ${Validation.escapeHTML(p.status)}
              </span>
            </div>
          </div>

          <div style="display: flex; gap: 0.5rem;">
            ${p.githubUrl ? `
              <a href="${Validation.escapeHTML(p.githubUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
                <i data-lucide="github" style="width: 14px; height: 14px;"></i>
                <span>GitHub Source</span>
              </a>
            ` : ''}
            ${p.liveUrl ? `
              <a href="${Validation.escapeHTML(p.liveUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                <i data-lucide="external-link" style="width: 14px; height: 14px;"></i>
                <span>Live Preview</span>
              </a>
            ` : ''}
          </div>
        </div>

        <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6; margin: 0.75rem 0 1rem;">
          ${Validation.escapeHTML(p.description)}
        </p>

        <div style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
          ${techList.map(t => `
            <span style="font-size: 0.75rem; padding: 0.2rem 0.5rem; background: var(--bg-surface); border: 1px solid var(--border-strong); border-radius: var(--radius-xs); color: var(--text-primary); font-family: var(--font-mono);">
              ${Validation.escapeHTML(t)}
            </span>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');

  Components.initIcons();
}

function openProjectModal(existing = null) {
  const modal = document.getElementById('project-modal');
  const title = document.getElementById('project-modal-title');
  const idInput = document.getElementById('project-id-input');
  const titleInput = document.getElementById('project-title');
  const categorySelect = document.getElementById('project-category');
  const statusSelect = document.getElementById('project-status');
  const techInput = document.getElementById('project-technologies');
  const ghInput = document.getElementById('project-github');
  const liveInput = document.getElementById('project-live');
  const descInput = document.getElementById('project-description');

  if (existing) {
    title.textContent = 'Edit Portfolio Project';
    idInput.value = existing.id;
    titleInput.value = existing.title;
    categorySelect.value = existing.category;
    statusSelect.value = existing.status;
    techInput.value = Array.isArray(existing.technologies) ? existing.technologies.join(', ') : (existing.technologies || '');
    ghInput.value = existing.githubUrl || '';
    liveInput.value = existing.liveUrl || '';
    descInput.value = existing.description || '';
  } else {
    title.textContent = 'Add Portfolio Project';
    idInput.value = '';
    titleInput.value = '';
    categorySelect.value = 'Full Stack';
    statusSelect.value = 'In Progress';
    techInput.value = '';
    ghInput.value = '';
    liveInput.value = '';
    descInput.value = '';
  }

  modal.classList.add('open');
  titleInput.focus();
}

function handleProjectFormSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('project-id-input').value;
  const title = document.getElementById('project-title').value.trim();
  const category = document.getElementById('project-category').value;
  const status = document.getElementById('project-status').value;
  const techRaw = document.getElementById('project-technologies').value.trim();
  const githubUrl = document.getElementById('project-github').value.trim();
  const liveUrl = document.getElementById('project-live').value.trim();
  const description = document.getElementById('project-description').value.trim();

  if (!Validation.isNonEmpty(title)) {
    Components.showToast('Please enter a project title', 'error');
    return;
  }
  if (!Validation.isNonEmpty(description)) {
    Components.showToast('Please enter a project description', 'error');
    return;
  }

  if (githubUrl && !Validation.isValidUrl(githubUrl)) {
    Components.showToast('GitHub URL must be a valid http/https address', 'error');
    return;
  }
  if (liveUrl && !Validation.isValidUrl(liveUrl)) {
    Components.showToast('Live demo URL must be a valid http/https address', 'error');
    return;
  }

  const technologies = techRaw.split(',').map(t => t.trim()).filter(Boolean);

  const projectData = {
    title,
    category,
    status,
    technologies,
    githubUrl,
    liveUrl,
    description
  };

  if (id) {
    State.updateProject(id, projectData);
    Components.showToast(`Updated '${title}' successfully`, 'success');
  } else {
    State.addProject(projectData);
    Components.showToast(`Added '${title}' to portfolio!`, 'success');
  }

  document.getElementById('project-modal').classList.remove('open');
  if (currentView === 'preview') {
    renderRecruiterPreview();
  } else {
    renderProjects();
  }
}
