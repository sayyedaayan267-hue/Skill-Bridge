/**
 * SkillBridge - Career Skill Gap Analyzer Page Controller
 * Analyzes competencies against industry career paths and dispatches roadmap tasks.
 */

import { Analytics } from '../analytics.js';
import { AuthDemo } from '../auth-demo.js';
import { Components } from '../components.js';
import { State } from '../state.js';
import { Validation } from '../validation.js';

let selectedRoleId = null;

document.addEventListener('DOMContentLoaded', () => {
  AuthDemo.requireAuth();
  Components.renderAppShell('career-analyzer', 'Career Skill Gap Analyzer');

  const user = State.getUser() || {};
  const roles = State.getRoles();

  // Read URL query parameter ?role=...
  const params = new URLSearchParams(window.location.search);
  const paramRole = params.get('role');
  if (paramRole && roles.some(r => r.id === paramRole)) {
    selectedRoleId = paramRole;
  } else {
    selectedRoleId = user.targetRoleId || roles[0].id;
  }

  initRoleTabs();
  renderAnalysis();

  // "Set as Active Goal" button
  const setGoalBtn = document.getElementById('set-target-role-btn');
  if (setGoalBtn) {
    setGoalBtn.onclick = () => {
      State.updateUser({ targetRoleId: selectedRoleId });
      Components.showToast('Active career goal updated! Your dashboard readiness score is now aligned with this role.', 'success');
      renderAnalysis();
    };
  }
});

function initRoleTabs() {
  const container = document.getElementById('role-tabs-container');
  const roles = State.getRoles();
  if (!container) return;

  container.innerHTML = roles.map(role => `
    <button class="filter-tab ${role.id === selectedRoleId ? 'active' : ''}" data-role-id="${role.id}">
      ${Validation.escapeHTML(role.title)}
    </button>
  `).join('');

  container.querySelectorAll('.filter-tab').forEach(tab => {
    tab.onclick = () => {
      selectedRoleId = tab.getAttribute('data-role-id');
      container.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderAnalysis();
    };
  });
}

function renderAnalysis() {
  const user = State.getUser() || {};
  const role = State.getRoleById(selectedRoleId);
  const userSkills = State.getSkills();

  if (!role) return;

  const gap = Analytics.calculateRoleGap(role, userSkills);

  // 1. Role Info
  document.getElementById('role-title').textContent = role.title;
  document.getElementById('role-category').textContent = role.category;
  document.getElementById('role-salary').textContent = role.averageStartingSalary;
  document.getElementById('role-description').textContent = role.description;

  const activeBadge = document.getElementById('role-active-badge');
  if (role.id === user.targetRoleId) {
    activeBadge.style.display = 'inline-flex';
    document.getElementById('set-target-role-btn').style.display = 'none';
  } else {
    activeBadge.style.display = 'none';
    document.getElementById('set-target-role-btn').style.display = 'inline-flex';
  }

  // 2. Dial Score
  document.getElementById('role-match-percentage').textContent = `${gap.matchPercentage}%`;
  const matchStatus = document.getElementById('role-match-status');
  if (gap.matchPercentage >= 80) {
    matchStatus.className = 'status-indicator status-active';
    matchStatus.textContent = 'High Alignment · Ready';
  } else if (gap.matchPercentage >= 60) {
    matchStatus.className = 'status-indicator status-in-progress';
    matchStatus.textContent = 'Moderate Alignment';
  } else {
    matchStatus.className = 'status-indicator status-warning';
    matchStatus.textContent = 'Significant Gaps';
  }

  // 3. Counts
  document.getElementById('count-matching').textContent = gap.matchingSkills.length;
  document.getElementById('count-partial').textContent = gap.partialSkills.length;
  document.getElementById('count-missing').textContent = gap.missingSkills.length;

  // 4. Matching List
  const matchingContainer = document.getElementById('matching-skills-list');
  if (gap.matchingSkills.length === 0) {
    matchingContainer.innerHTML = '<div style="font-size: 0.8125rem; color: var(--text-muted); text-align: center; padding: 1rem;">No fully matching skills yet.</div>';
  } else {
    matchingContainer.innerHTML = gap.matchingSkills.map(s => `
      <div style="padding: 0.75rem; background: var(--bg-canvas); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
          <strong style="font-size: 0.875rem; color: var(--text-primary);">${Validation.escapeHTML(s.name)}</strong>
          <span class="status-indicator status-active" style="font-size: 0.7rem;">${s.currentLevel}</span>
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted); display: flex; justify-content: space-between;">
          <span>Target Requirement: ${s.requiredLevel}</span>
          <span class="font-mono">${s.weight}% role weight</span>
        </div>
      </div>
    `).join('');
  }

  // 5. Partial List
  const partialContainer = document.getElementById('partial-skills-list');
  if (gap.partialSkills.length === 0) {
    partialContainer.innerHTML = '<div style="font-size: 0.8125rem; color: var(--text-muted); text-align: center; padding: 1rem;">No partial gaps.</div>';
  } else {
    partialContainer.innerHTML = gap.partialSkills.map(s => `
      <div style="padding: 0.75rem; background: var(--bg-canvas); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
          <strong style="font-size: 0.875rem; color: var(--text-primary);">${Validation.escapeHTML(s.name)}</strong>
          <span class="status-indicator status-in-progress" style="font-size: 0.7rem;">${s.currentLevel} &rarr; ${s.requiredLevel}</span>
        </div>
        <div style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.35rem;">
          Gap: <span style="color: var(--accent-blue); font-weight: 600;">${s.gapPercent}% deficit</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${100 - s.gapPercent}%;"></div>
        </div>
      </div>
    `).join('');
  }

  // 6. Missing List
  const missingContainer = document.getElementById('missing-skills-list');
  if (gap.missingSkills.length === 0) {
    missingContainer.innerHTML = '<div style="font-size: 0.8125rem; color: var(--color-success); text-align: center; padding: 1rem;">No missing prerequisites!</div>';
  } else {
    missingContainer.innerHTML = gap.missingSkills.map(s => `
      <div style="padding: 0.75rem; background: var(--bg-canvas); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
          <strong style="font-size: 0.875rem; color: var(--color-danger);">${Validation.escapeHTML(s.name)}</strong>
          <span class="status-indicator status-rejected" style="font-size: 0.7rem;">Missing</span>
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted); display: flex; justify-content: space-between;">
          <span>Target: ${s.requiredLevel}</span>
          <span class="font-mono text-primary font-semibold">${s.weight}% weight</span>
        </div>
      </div>
    `).join('');
  }

  // 7. Recommendations & 'Add to Roadmap'
  const recContainer = document.getElementById('gap-recommendations-list');
  if (gap.recommendedActions.length === 0) {
    recContainer.innerHTML = `
      <div style="padding: 1.5rem; text-align: center; color: var(--color-success); font-size: 0.875rem;">
        <i data-lucide="check-circle" style="width: 24px; height: 24px; margin-bottom: 0.5rem;"></i>
        <div>All competencies matched for ${Validation.escapeHTML(role.title)}. You are fully prepared to apply!</div>
      </div>
    `;
  } else {
    recContainer.innerHTML = gap.recommendedActions.map((rec, idx) => `
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1rem; background: var(--bg-canvas); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); flex-wrap: wrap;">
        <div style="display: flex; align-items: flex-start; gap: 0.75rem; flex: 1; min-width: 260px;">
          <div style="width: 24px; height: 24px; border-radius: 50%; background: ${rec.priority === 'High' ? 'var(--color-danger-bg)' : 'var(--accent-blue-subtle)'}; color: ${rec.priority === 'High' ? 'var(--color-danger)' : 'var(--accent-blue)'}; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; flex-shrink: 0;">
            ${idx + 1}
          </div>
          <div>
            <div style="font-size: 0.875rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.2rem;">
              ${Validation.escapeHTML(rec.skill)}
            </div>
            <div style="font-size: 0.8125rem; color: var(--text-secondary); line-height: 1.4;">
              ${Validation.escapeHTML(rec.action)}
            </div>
          </div>
        </div>

        <button class="btn btn-secondary btn-sm add-rec-to-roadmap-btn" 
          data-skill="${Validation.escapeHTML(rec.skill)}"
          data-action="${Validation.escapeHTML(rec.action)}"
          data-priority="${rec.priority}">
          <i data-lucide="calendar-plus" style="width: 14px; height: 14px;"></i>
          <span>Add to Roadmap</span>
        </button>
      </div>
    `).join('');

    recContainer.querySelectorAll('.add-rec-to-roadmap-btn').forEach(btn => {
      btn.onclick = () => {
        const skill = btn.getAttribute('data-skill');
        const action = btn.getAttribute('data-action');
        const priority = btn.getAttribute('data-priority');

        // Target due date 14 days from now
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14);
        const dateStr = dueDate.toISOString().split('T')[0];

        State.addTask({
          title: `Master ${skill}: ${action.slice(0, 45)}...`,
          description: action,
          relatedSkill: skill,
          priority: priority || 'High',
          dueDate: dateStr,
          estimatedHours: 10
        });

        btn.disabled = true;
        btn.innerHTML = '<i data-lucide="check" style="width: 14px; height: 14px;"></i> <span>Added to Roadmap</span>';
        Components.showToast(`Added learning milestone for '${skill}' to your roadmap!`, 'success');
        Components.initIcons();
      };
    });
  }

  Components.initIcons();
}
