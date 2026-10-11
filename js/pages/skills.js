/**
 * SkillBridge - Skills Management Page Controller
 * Handles CRUD operations, filtering, sorting, and proficiency updates.
 */

import { AuthDemo } from '../auth-demo.js';
import { Components } from '../components.js';
import { State } from '../state.js';
import { Validation } from '../validation.js';

let activeCategory = 'ALL';
let activeProficiency = 'ALL';
let activeSort = 'proficiency-desc';
let searchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
  AuthDemo.requireAuth();
  Components.renderAppShell('skills', 'Skills Inventory');

  initEventListeners();
  renderSkills();

  // Check query parameter for ?action=new
  const params = new URLSearchParams(window.location.search);
  if (params.get('action') === 'new') {
    openSkillModal();
  }
});

function initEventListeners() {
  const searchInput = document.getElementById('skill-search-input');
  const categoryFilter = document.getElementById('skill-category-filter');
  const proficiencyFilter = document.getElementById('skill-proficiency-filter');
  const sortFilter = document.getElementById('skill-sort-filter');

  searchInput.oninput = (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderSkills();
  };

  categoryFilter.onchange = (e) => {
    activeCategory = e.target.value;
    renderSkills();
  };

  proficiencyFilter.onchange = (e) => {
    activeProficiency = e.target.value;
    renderSkills();
  };

  sortFilter.onchange = (e) => {
    activeSort = e.target.value;
    renderSkills();
  };

  // Modal triggers
  document.getElementById('open-add-skill-modal').onclick = () => openSkillModal();
  document.getElementById('empty-add-skill-btn').onclick = () => openSkillModal();

  const modalBackdrop = document.getElementById('skill-modal');
  const modalClose = document.getElementById('skill-modal-close');
  const modalCancel = document.getElementById('skill-modal-cancel');

  const closeModal = () => modalBackdrop.classList.remove('open');
  modalClose.onclick = closeModal;
  modalCancel.onclick = closeModal;
  modalBackdrop.onclick = (e) => {
    if (e.target === modalBackdrop) closeModal();
  };

  // Form submit
  document.getElementById('skill-form').onsubmit = handleSkillFormSubmit;
}

function renderSkills() {
  const grid = document.getElementById('skills-grid');
  const emptyState = document.getElementById('skills-empty-state');
  if (!grid) return;

  let skills = State.getSkills();

  // 1. Search Filter
  if (searchQuery) {
    skills = skills.filter(s =>
      s.name.toLowerCase().includes(searchQuery) ||
      (s.notes && s.notes.toLowerCase().includes(searchQuery)) ||
      s.category.toLowerCase().includes(searchQuery)
    );
  }

  // 2. Category Filter
  if (activeCategory !== 'ALL') {
    skills = skills.filter(s => s.category === activeCategory);
  }

  // 3. Proficiency Filter
  if (activeProficiency !== 'ALL') {
    skills = skills.filter(s => s.proficiency === activeProficiency);
  }

  // 4. Sort
  skills.sort((a, b) => {
    const valA = a.proficiency === 'Advanced' ? 100 : (a.proficiency === 'Intermediate' ? 75 : 40);
    const valB = b.proficiency === 'Advanced' ? 100 : (b.proficiency === 'Intermediate' ? 75 : 40);

    if (activeSort === 'proficiency-desc') return valB - valA;
    if (activeSort === 'proficiency-asc') return valA - valB;
    if (activeSort === 'name-asc') return a.name.localeCompare(b.name);
    if (activeSort === 'name-desc') return b.name.localeCompare(a.name);
    return 0;
  });

  if (skills.length === 0) {
    grid.innerHTML = '';
    emptyState.style.display = 'block';
    Components.initIcons();
    return;
  }

  emptyState.style.display = 'none';

  grid.innerHTML = skills.map(skill => {
    let pct = 40;
    let badgeClass = 'status-pending';
    if (skill.proficiency === 'Advanced') {
      pct = 100;
      badgeClass = 'status-active';
    } else if (skill.proficiency === 'Intermediate') {
      pct = 75;
      badgeClass = 'status-in-progress';
    }

    return `
      <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
            <div>
              <h3 style="font-size: 1.1rem; color: var(--text-primary); margin-bottom: 0.2rem;">
                ${Validation.escapeHTML(skill.name)}
              </h3>
              <div class="meta-list">
                <span>${Validation.escapeHTML(skill.category)}</span>
                <span class="meta-separator">·</span>
                <span>${Validation.escapeHTML(skill.status)}</span>
              </div>
            </div>
            <span class="status-indicator ${badgeClass}">
              ${Validation.escapeHTML(skill.proficiency)}
            </span>
          </div>

          <div style="margin: 1rem 0;">
            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.25rem;">
              <span>Proficiency Score</span>
              <span class="font-mono tabular-nums font-semibold" style="color: var(--text-primary);">${pct}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${pct}%;"></div>
            </div>
          </div>

          <p style="font-size: 0.8125rem; color: var(--text-secondary); line-height: 1.5; min-height: 2.5rem;">
            ${Validation.escapeHTML(skill.notes || 'No learning notes added yet.')}
          </p>
        </div>

        <div style="display: flex; align-items: center; justify-content: flex-end; gap: 0.5rem; margin-top: 1.25rem; padding-top: 0.75rem; border-top: 1px solid var(--border-subtle);">
          <button class="btn btn-secondary btn-sm edit-skill-btn" data-skill-id="${skill.id}">
            <i data-lucide="edit-3" style="width: 14px; height: 14px;"></i>
            <span>Edit</span>
          </button>
          <button class="btn btn-outline btn-sm delete-skill-btn" data-skill-id="${skill.id}" style="color: var(--color-danger); border-color: rgba(239, 68, 68, 0.3);">
            <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Attach card event listeners
  grid.querySelectorAll('.edit-skill-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-skill-id');
      const skill = State.getSkills().find(s => s.id === id);
      if (skill) openSkillModal(skill);
    };
  });

  grid.querySelectorAll('.delete-skill-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-skill-id');
      const skill = State.getSkills().find(s => s.id === id);
      if (!skill) return;

      Components.showConfirmModal({
        title: `Delete Skill: ${skill.name}`,
        message: `Are you sure you want to remove "${skill.name}" from your skills inventory? This will also adjust your overall Career Readiness score.`,
        confirmText: 'Delete Skill',
        confirmVariant: 'danger',
        onConfirm: () => {
          State.deleteSkill(id);
          Components.showToast(`Removed skill '${skill.name}'`, 'info');
          renderSkills();
        }
      });
    };
  });

  Components.initIcons();
}

function openSkillModal(existingSkill = null) {
  const modal = document.getElementById('skill-modal');
  const title = document.getElementById('skill-modal-title');
  const idInput = document.getElementById('skill-id-input');
  const nameInput = document.getElementById('skill-name');
  const categorySelect = document.getElementById('skill-category');
  const proficiencySelect = document.getElementById('skill-proficiency');
  const statusSelect = document.getElementById('skill-status');
  const notesInput = document.getElementById('skill-notes');

  if (existingSkill) {
    title.textContent = 'Edit Technical Skill';
    idInput.value = existingSkill.id;
    nameInput.value = existingSkill.name;
    categorySelect.value = existingSkill.category;
    proficiencySelect.value = existingSkill.proficiency;
    statusSelect.value = existingSkill.status;
    notesInput.value = existingSkill.notes || '';
  } else {
    title.textContent = 'Add Technical Skill';
    idInput.value = '';
    nameInput.value = '';
    categorySelect.value = 'Programming';
    proficiencySelect.value = 'Intermediate';
    statusSelect.value = 'Active Learning';
    notesInput.value = '';
  }

  modal.classList.add('open');
  nameInput.focus();
}

function handleSkillFormSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('skill-id-input').value;
  const name = document.getElementById('skill-name').value.trim();
  const category = document.getElementById('skill-category').value;
  const proficiency = document.getElementById('skill-proficiency').value;
  const status = document.getElementById('skill-status').value;
  const notes = document.getElementById('skill-notes').value.trim();

  if (!Validation.isNonEmpty(name)) {
    Components.showToast('Please enter a skill name', 'error');
    return;
  }

  const skillData = {
    name,
    category,
    proficiency,
    status,
    notes,
    numericScore: proficiency === 'Advanced' ? 100 : (proficiency === 'Intermediate' ? 75 : 40)
  };

  if (id) {
    State.updateSkill(id, skillData);
    Components.showToast(`Updated '${name}' successfully`, 'success');
  } else {
    State.addSkill(skillData);
    Components.showToast(`Added '${name}' to inventory`, 'success');
  }

  document.getElementById('skill-modal').classList.remove('open');
  renderSkills();
}
