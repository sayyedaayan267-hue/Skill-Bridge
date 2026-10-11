/**
 * SkillBridge - Internship Explorer & Application Pipeline Controller
 * Manages internship searching, status transitions, bookmarks, and pipeline kanban stages.
 */

import { AuthDemo } from '../auth-demo.js';
import { Components } from '../components.js';
import { State } from '../state.js';
import { Validation } from '../validation.js';

let currentTab = 'all'; // 'all', 'pipeline', 'saved'
let searchQuery = '';
let workModeFilter = 'ALL';
let categoryFilter = 'ALL';
let sortFilter = 'deadline-asc';

document.addEventListener('DOMContentLoaded', () => {
  AuthDemo.requireAuth();
  Components.renderAppShell('internships', 'Internship Explorer');

  initEventListeners();
  renderInternships();
});

function initEventListeners() {
  // Tab toggles
  document.getElementById('tab-all-listings').onclick = () => switchTab('all');
  document.getElementById('tab-pipeline-view').onclick = () => switchTab('pipeline');
  document.getElementById('tab-saved-view').onclick = () => switchTab('saved');

  // Search & Filters
  const searchInput = document.getElementById('internship-search-input');
  const modeFilter = document.getElementById('internship-workmode-filter');
  const catFilter = document.getElementById('internship-category-filter');
  const sFilter = document.getElementById('internship-sort-filter');

  searchInput.oninput = (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderInternships();
  };

  modeFilter.onchange = (e) => {
    workModeFilter = e.target.value;
    renderInternships();
  };

  catFilter.onchange = (e) => {
    categoryFilter = e.target.value;
    renderInternships();
  };

  sFilter.onchange = (e) => {
    sortFilter = e.target.value;
    renderInternships();
  };
}

function switchTab(tab) {
  currentTab = tab;
  const allTab = document.getElementById('tab-all-listings');
  const pipeTab = document.getElementById('tab-pipeline-view');
  const savedTab = document.getElementById('tab-saved-view');
  const listingsContainer = document.getElementById('listings-view-container');
  const pipelineContainer = document.getElementById('pipeline-view-container');

  allTab.classList.remove('active');
  pipeTab.classList.remove('active');
  savedTab.classList.remove('active');

  if (tab === 'pipeline') {
    pipeTab.classList.add('active');
    listingsContainer.style.display = 'none';
    pipelineContainer.style.display = 'block';
    renderPipelineStages();
  } else {
    listingsContainer.style.display = 'block';
    pipelineContainer.style.display = 'none';
    if (tab === 'saved') {
      savedTab.classList.add('active');
    } else {
      allTab.classList.add('active');
    }
    renderInternships();
  }
}

function renderInternships() {
  const grid = document.getElementById('internships-grid');
  const emptyState = document.getElementById('internships-empty-state');
  if (!grid) return;

  const allInternships = State.getInternships();

  // Update Pipeline Counts
  updatePipelineCounts(allInternships);

  let items = [...allInternships];

  // Bookmarked tab filter
  if (currentTab === 'saved') {
    items = items.filter(i => i.isBookmarked);
  }

  // Search
  if (searchQuery) {
    items = items.filter(i =>
      i.company.toLowerCase().includes(searchQuery) ||
      i.role.toLowerCase().includes(searchQuery) ||
      i.location.toLowerCase().includes(searchQuery) ||
      (i.requiredSkills && i.requiredSkills.some(s => s.toLowerCase().includes(searchQuery)))
    );
  }

  // Work Mode
  if (workModeFilter !== 'ALL') {
    items = items.filter(i => i.workMode === workModeFilter);
  }

  // Category
  if (categoryFilter !== 'ALL') {
    items = items.filter(i => i.category === categoryFilter);
  }

  // Sorting
  items.sort((a, b) => {
    if (sortFilter === 'deadline-asc') return new Date(a.deadline) - new Date(b.deadline);
    if (sortFilter === 'deadline-desc') return new Date(b.deadline) - new Date(a.deadline);
    if (sortFilter === 'company-asc') return a.company.localeCompare(b.company);
    return 0;
  });

  if (items.length === 0) {
    grid.innerHTML = '';
    emptyState.style.display = 'block';
    Components.initIcons();
    return;
  }

  emptyState.style.display = 'none';

  grid.innerHTML = items.map(item => {
    const skills = Array.isArray(item.requiredSkills) ? item.requiredSkills : [];

    let statusBadgeClass = 'status-planned';
    if (item.status === 'Applied') statusBadgeClass = 'status-in-progress';
    else if (item.status === 'Interview') statusBadgeClass = 'status-pending';
    else if (item.status === 'Offered') statusBadgeClass = 'status-active';
    else if (item.status === 'Rejected') statusBadgeClass = 'status-rejected';

    return `
      <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <!-- Card Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; gap: 0.5rem;">
            <div>
              <div style="font-size: 0.8125rem; font-weight: 700; color: var(--accent-blue); margin-bottom: 0.15rem;">
                ${Validation.escapeHTML(item.company)}
              </div>
              <h3 style="font-size: 1.1rem; color: var(--text-primary); line-height: 1.3;">
                ${Validation.escapeHTML(item.role)}
              </h3>
            </div>
            
            <button class="btn-icon bookmark-btn" data-id="${item.id}" style="background: transparent; border: none; cursor: pointer; color: ${item.isBookmarked ? 'var(--color-danger)' : 'var(--text-muted)'};" aria-label="Toggle bookmark">
              <i data-lucide="bookmark" style="width: 18px; height: 18px; fill: ${item.isBookmarked ? 'currentColor' : 'none'};"></i>
            </button>
          </div>

          <!-- Metadata -->
          <div class="meta-list" style="margin-bottom: 0.75rem;">
            <span>${Validation.escapeHTML(item.location)}</span>
            <span class="meta-separator">·</span>
            <span>${Validation.escapeHTML(item.workMode)}</span>
            <span class="meta-separator">·</span>
            <span class="font-mono text-primary font-semibold">${Validation.escapeHTML(item.stipend || 'Competitive')}</span>
          </div>

          <p style="font-size: 0.8125rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1rem; min-height: 3rem;">
            ${Validation.escapeHTML(item.description)}
          </p>

          <!-- Skills Required -->
          <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 1.25rem;">
            ${skills.map(s => `
              <span style="font-size: 0.725rem; padding: 0.15rem 0.5rem; background: var(--bg-canvas); border: 1px solid var(--border-subtle); border-radius: var(--radius-xs); color: var(--text-secondary);">
                ${Validation.escapeHTML(s)}
              </span>
            `).join('')}
          </div>
        </div>

        <!-- Card Footer -->
        <div style="padding-top: 1rem; border-top: 1px solid var(--border-subtle); display: flex; flex-direction: column; gap: 0.75rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem;">
            <span style="color: var(--text-muted);">
              Deadline: <strong class="text-primary font-mono">${item.deadline}</strong>
            </span>
            <span class="status-indicator ${statusBadgeClass}">
              ${Validation.escapeHTML(item.status)}
            </span>
          </div>

          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <select class="select item-status-select" data-id="${item.id}" style="font-size: 0.75rem; padding: 0.35rem 0.6rem; flex: 1;">
              <option value="Saved" ${item.status === 'Saved' ? 'selected' : ''}>Status: Saved</option>
              <option value="Applied" ${item.status === 'Applied' ? 'selected' : ''}>Status: Applied</option>
              <option value="Interview" ${item.status === 'Interview' ? 'selected' : ''}>Status: Interview</option>
              <option value="Offered" ${item.status === 'Offered' ? 'selected' : ''}>Status: Offered</option>
              <option value="Rejected" ${item.status === 'Rejected' ? 'selected' : ''}>Status: Rejected</option>
            </select>

            <a href="${Validation.escapeHTML(item.applicationUrl || '#')}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm apply-external-btn" data-company="${Validation.escapeHTML(item.company)}">
              <span>Apply</span>
              <i data-lucide="external-link" style="width: 12px; height: 12px;"></i>
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Event Listeners for Cards
  grid.querySelectorAll('.bookmark-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-id');
      const isBookmarked = State.toggleInternshipBookmark(id);
      Components.showToast(isBookmarked ? 'Opportunity bookmarked' : 'Removed from bookmarks', 'info', 2000);
      renderInternships();
    };
  });

  grid.querySelectorAll('.item-status-select').forEach(sel => {
    sel.onchange = (e) => {
      const id = sel.getAttribute('data-id');
      const newStatus = e.target.value;
      State.updateInternshipStatus(id, newStatus);
      Components.showToast(`Updated stage to ${newStatus}`, 'success', 2000);
      renderInternships();
    };
  });

  grid.querySelectorAll('.apply-external-btn').forEach(link => {
    link.onclick = () => {
      const company = link.getAttribute('data-company');
      Components.showToast(`Opening simulated opportunity portal for ${company}`, 'info', 2500);
    };
  });

  Components.initIcons();
}

function updatePipelineCounts(list) {
  const counts = {
    Saved: 0,
    Applied: 0,
    Interview: 0,
    Offered: 0,
    Rejected: 0
  };

  let bookmarkCount = 0;

  list.forEach(i => {
    if (counts[i.status] !== undefined) counts[i.status]++;
    if (i.isBookmarked) bookmarkCount++;
  });

  document.getElementById('pipeline-count-saved').textContent = counts.Saved;
  document.getElementById('pipeline-count-applied').textContent = counts.Applied;
  document.getElementById('pipeline-count-interview').textContent = counts.Interview;
  document.getElementById('pipeline-count-offered').textContent = counts.Offered;
  document.getElementById('pipeline-count-rejected').textContent = counts.Rejected;
  document.getElementById('bookmark-count-badge').textContent = bookmarkCount;

  // Pipeline view header counts
  const stSaved = document.getElementById('stage-count-saved');
  const stApplied = document.getElementById('stage-count-applied');
  const stInterview = document.getElementById('stage-count-interview');
  const stOffered = document.getElementById('stage-count-offered');
  if (stSaved) stSaved.textContent = counts.Saved;
  if (stApplied) stApplied.textContent = counts.Applied;
  if (stInterview) stInterview.textContent = counts.Interview;
  if (stOffered) stOffered.textContent = counts.Offered;
}

function renderPipelineStages() {
  const list = State.getInternships();
  updatePipelineCounts(list);

  const stages = {
    Saved: document.getElementById('stage-list-saved'),
    Applied: document.getElementById('stage-list-applied'),
    Interview: document.getElementById('stage-list-interview'),
    Offered: document.getElementById('stage-list-offered')
  };

  Object.values(stages).forEach(el => {
    if (el) el.innerHTML = '';
  });

  list.forEach(item => {
    const container = stages[item.status];
    if (!container) return;

    const card = document.createElement('div');
    card.style.cssText = 'padding: 0.875rem; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); font-size: 0.8125rem;';
    card.innerHTML = `
      <div style="font-weight: 700; color: var(--accent-blue); font-size: 0.75rem; margin-bottom: 0.2rem;">
        ${Validation.escapeHTML(item.company)}
      </div>
      <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 0.5rem; line-height: 1.3;">
        ${Validation.escapeHTML(item.role)}
      </div>
      <div style="font-size: 0.725rem; color: var(--text-muted); margin-bottom: 0.75rem;">
        Deadline: ${item.deadline}
      </div>
      <div style="display: flex; gap: 0.35rem; justify-content: flex-end;">
        <select class="select stage-move-select" data-id="${item.id}" style="padding: 0.2rem 0.4rem; font-size: 0.7rem; width: auto;">
          <option value="Saved" ${item.status === 'Saved' ? 'selected' : ''}>Move: Saved</option>
          <option value="Applied" ${item.status === 'Applied' ? 'selected' : ''}>Move: Applied</option>
          <option value="Interview" ${item.status === 'Interview' ? 'selected' : ''}>Move: Interview</option>
          <option value="Offered" ${item.status === 'Offered' ? 'selected' : ''}>Move: Offered</option>
          <option value="Rejected" ${item.status === 'Rejected' ? 'selected' : ''}>Move: Rejected</option>
        </select>
      </div>
    `;

    container.appendChild(card);
  });

  document.querySelectorAll('.stage-move-select').forEach(sel => {
    sel.onchange = (e) => {
      const id = sel.getAttribute('data-id');
      const newStatus = e.target.value;
      State.updateInternshipStatus(id, newStatus);
      Components.showToast(`Updated to ${newStatus}`, 'success', 2000);
      renderPipelineStages();
    };
  });

  Components.initIcons();
}
