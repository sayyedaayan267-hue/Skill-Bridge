/**
 * SkillBridge - Admin Demonstration Console Controller
 * Manages CRUD operations for internship listings and quiz questions.
 */

import { AuthDemo } from '../auth-demo.js';
import { Components } from '../components.js';
import { State } from '../state.js';
import { Validation } from '../validation.js';

let activeTab = 'internships'; // 'internships' or 'questions'
let intSearch = '';
let qSearch = '';
let qCategory = 'ALL';

document.addEventListener('DOMContentLoaded', () => {
  AuthDemo.requireAuth();
  Components.renderAppShell('admin', 'Admin Demo Console');

  initAdminTabs();
  initInternshipActions();
  initQuestionActions();

  renderInternshipsTable();
  renderQuestionsTable();
});

function initAdminTabs() {
  const intTab = document.getElementById('admin-tab-internships');
  const qTab = document.getElementById('admin-tab-questions');
  const intPanel = document.getElementById('admin-internships-panel');
  const qPanel = document.getElementById('admin-questions-panel');

  intTab.onclick = () => {
    activeTab = 'internships';
    intTab.classList.add('active');
    qTab.classList.remove('active');
    intPanel.style.display = 'block';
    qPanel.style.display = 'none';
  };

  qTab.onclick = () => {
    activeTab = 'questions';
    qTab.classList.add('active');
    intTab.classList.remove('active');
    qPanel.style.display = 'block';
    intPanel.style.display = 'none';
  };
}

// ==========================================
// 1. INTERNSHIPS CRUD
// ==========================================
function initInternshipActions() {
  document.getElementById('admin-internship-search').oninput = (e) => {
    intSearch = e.target.value.toLowerCase().trim();
    renderInternshipsTable();
  };

  document.getElementById('open-add-internship-modal').onclick = () => openInternshipModal();

  const modal = document.getElementById('admin-internship-modal');
  const close = () => modal.classList.remove('open');
  document.getElementById('adm-int-close').onclick = close;
  document.getElementById('adm-int-cancel').onclick = close;
  modal.onclick = (e) => {
    if (e.target === modal) close();
  };

  document.getElementById('admin-internship-form').onsubmit = (e) => {
    e.preventDefault();
    const id = document.getElementById('adm-int-id').value;
    const company = document.getElementById('adm-int-company').value.trim();
    const role = document.getElementById('adm-int-role').value.trim();
    const location = document.getElementById('adm-int-location').value.trim();
    const workMode = document.getElementById('adm-int-workmode').value;
    const category = document.getElementById('adm-int-category').value;
    const stipend = document.getElementById('adm-int-stipend').value.trim();
    const skillsRaw = document.getElementById('adm-int-skills').value.trim();
    const deadline = document.getElementById('adm-int-deadline').value;
    const description = document.getElementById('adm-int-desc').value.trim();

    if (!Validation.isNonEmpty(company) || !Validation.isNonEmpty(role)) {
      Components.showToast('Please provide both company name and role title', 'error');
      return;
    }

    const requiredSkills = skillsRaw.split(',').map(s => s.trim()).filter(Boolean);

    const data = {
      company,
      role,
      location,
      workMode,
      category,
      stipend,
      requiredSkills,
      deadline,
      description
    };

    if (id) {
      State.updateInternship(id, data);
      Components.showToast(`Updated '${company}' listing`, 'success');
    } else {
      State.addInternship(data);
      Components.showToast(`Added sample listing for '${company}'`, 'success');
    }

    close();
    renderInternshipsTable();
  };
}

function renderInternshipsTable() {
  const tbody = document.getElementById('admin-internships-tbody');
  const countBadge = document.getElementById('admin-count-internships');
  let list = State.getInternships();

  countBadge.textContent = list.length;

  if (intSearch) {
    list = list.filter(i =>
      i.company.toLowerCase().includes(intSearch) ||
      i.role.toLowerCase().includes(intSearch) ||
      i.location.toLowerCase().includes(intSearch)
    );
  }

  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">No internships match query.</td></tr>';
    return;
  }

  tbody.innerHTML = list.map(item => `
    <tr>
      <td><strong>${Validation.escapeHTML(item.company)}</strong></td>
      <td>${Validation.escapeHTML(item.role)}</td>
      <td>${Validation.escapeHTML(item.location)} · <span class="text-muted">${item.workMode}</span></td>
      <td class="font-mono text-primary">${Validation.escapeHTML(item.stipend || 'Competitive')}</td>
      <td class="font-mono">${item.deadline}</td>
      <td>
        <div style="display: flex; gap: 0.35rem;">
          <button class="btn btn-ghost btn-sm edit-adm-int-btn" data-id="${item.id}">
            <i data-lucide="edit-3" style="width: 14px; height: 14px;"></i>
          </button>
          <button class="btn btn-ghost btn-sm del-adm-int-btn" data-id="${item.id}" style="color: var(--color-danger);">
            <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.edit-adm-int-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-id');
      const item = State.getInternships().find(i => i.id === id);
      if (item) openInternshipModal(item);
    };
  });

  tbody.querySelectorAll('.del-adm-int-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-id');
      const item = State.getInternships().find(i => i.id === id);
      if (!item) return;

      Components.showConfirmModal({
        title: `Delete Sample Internship`,
        message: `Are you sure you want to delete the posting from "${item.company}"?`,
        confirmText: 'Delete Listing',
        confirmVariant: 'danger',
        onConfirm: () => {
          State.deleteInternship(id);
          Components.showToast('Listing removed', 'info');
          renderInternshipsTable();
        }
      });
    };
  });

  Components.initIcons();
}

function openInternshipModal(existing = null) {
  const modal = document.getElementById('admin-internship-modal');
  const title = document.getElementById('adm-int-title');

  document.getElementById('adm-int-id').value = existing ? existing.id : '';
  title.textContent = existing ? 'Edit Sample Internship' : 'Add Sample Internship';

  document.getElementById('adm-int-company').value = existing ? existing.company : '';
  document.getElementById('adm-int-role').value = existing ? existing.role : '';
  document.getElementById('adm-int-location').value = existing ? existing.location : '';
  document.getElementById('adm-int-workmode').value = existing ? existing.workMode : 'Hybrid';
  document.getElementById('adm-int-category').value = existing ? existing.category : 'Full Stack';
  document.getElementById('adm-int-stipend').value = existing ? existing.stipend || '' : '';
  document.getElementById('adm-int-skills').value = existing && existing.requiredSkills ? existing.requiredSkills.join(', ') : '';
  document.getElementById('adm-int-deadline').value = existing ? existing.deadline : new Date().toISOString().split('T')[0];
  document.getElementById('adm-int-desc').value = existing ? existing.description : '';

  modal.classList.add('open');
}

// ==========================================
// 2. QUIZ QUESTIONS CRUD
// ==========================================
function initQuestionActions() {
  document.getElementById('admin-question-search').oninput = (e) => {
    qSearch = e.target.value.toLowerCase().trim();
    renderQuestionsTable();
  };

  document.getElementById('admin-question-category-filter').onchange = (e) => {
    qCategory = e.target.value;
    renderQuestionsTable();
  };

  document.getElementById('open-add-question-modal').onclick = () => openQuestionModal();

  const modal = document.getElementById('admin-question-modal');
  const close = () => modal.classList.remove('open');
  document.getElementById('adm-q-close').onclick = close;
  document.getElementById('adm-q-cancel').onclick = close;
  modal.onclick = (e) => {
    if (e.target === modal) close();
  };

  document.getElementById('admin-question-form').onsubmit = (e) => {
    e.preventDefault();
    const id = document.getElementById('adm-q-id').value;
    const category = document.getElementById('adm-q-category').value;
    const difficulty = document.getElementById('adm-q-difficulty').value;
    const question = document.getElementById('adm-q-text').value.trim();
    const opt0 = document.getElementById('adm-q-opt-0').value.trim();
    const opt1 = document.getElementById('adm-q-opt-1').value.trim();
    const opt2 = document.getElementById('adm-q-opt-2').value.trim();
    const opt3 = document.getElementById('adm-q-opt-3').value.trim();
    const explanation = document.getElementById('adm-q-explanation').value.trim();

    const radios = document.getElementsByName('correctOpt');
    let correctIndex = 0;
    for (let r of radios) {
      if (r.checked) {
        correctIndex = parseInt(r.value, 10);
        break;
      }
    }

    if (!Validation.isNonEmpty(question) || !opt0 || !opt1 || !opt2 || !opt3) {
      Components.showToast('Please provide the question prompt and all 4 options', 'error');
      return;
    }

    const data = {
      category,
      difficulty,
      question,
      options: [opt0, opt1, opt2, opt3],
      correctIndex,
      explanation
    };

    if (id) {
      State.updateQuizQuestion(id, data);
      Components.showToast('Updated MCQ question', 'success');
    } else {
      State.addQuizQuestion(data);
      Components.showToast('Added question to bank', 'success');
    }

    close();
    renderQuestionsTable();
  };
}

function renderQuestionsTable() {
  const tbody = document.getElementById('admin-questions-tbody');
  const countBadge = document.getElementById('admin-count-questions');
  let list = State.getQuizQuestions();

  countBadge.textContent = list.length;

  if (qCategory !== 'ALL') {
    list = list.filter(q => q.category === qCategory);
  }

  if (qSearch) {
    list = list.filter(q =>
      q.question.toLowerCase().includes(qSearch) ||
      (q.explanation && q.explanation.toLowerCase().includes(qSearch))
    );
  }

  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">No questions match filter criteria.</td></tr>';
    return;
  }

  tbody.innerHTML = list.map(q => `
    <tr>
      <td><span class="status-indicator status-in-progress">${q.category}</span></td>
      <td><span class="text-muted" style="font-size: 0.75rem;">${q.difficulty}</span></td>
      <td style="max-width: 380px;">
        <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.8125rem;">
          ${Validation.escapeHTML(q.question)}
        </div>
      </td>
      <td style="max-width: 220px; font-size: 0.775rem;">
        <span style="color: var(--color-success); font-weight: 600;">
          ${String.fromCharCode(65 + q.correctIndex)}: ${Validation.escapeHTML(q.options[q.correctIndex] || '')}
        </span>
      </td>
      <td>
        <div style="display: flex; gap: 0.35rem;">
          <button class="btn btn-ghost btn-sm edit-adm-q-btn" data-id="${q.id}">
            <i data-lucide="edit-3" style="width: 14px; height: 14px;"></i>
          </button>
          <button class="btn btn-ghost btn-sm del-adm-q-btn" data-id="${q.id}" style="color: var(--color-danger);">
            <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.edit-adm-q-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-id');
      const q = State.getQuizQuestions().find(item => item.id === id);
      if (q) openQuestionModal(q);
    };
  });

  tbody.querySelectorAll('.del-adm-q-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-id');
      const q = State.getQuizQuestions().find(item => item.id === id);
      if (!q) return;

      Components.showConfirmModal({
        title: 'Delete MCQ Question',
        message: `Are you sure you want to delete this question from the question bank?`,
        confirmText: 'Delete Question',
        confirmVariant: 'danger',
        onConfirm: () => {
          State.deleteQuizQuestion(id);
          Components.showToast('Question removed from bank', 'info');
          renderQuestionsTable();
        }
      });
    };
  });

  Components.initIcons();
}

function openQuestionModal(existing = null) {
  const modal = document.getElementById('admin-question-modal');
  const title = document.getElementById('adm-q-title');

  document.getElementById('adm-q-id').value = existing ? existing.id : '';
  title.textContent = existing ? 'Edit MCQ Question' : 'Add MCQ Question';

  document.getElementById('adm-q-category').value = existing ? existing.category : 'JavaScript';
  document.getElementById('adm-q-difficulty').value = existing ? existing.difficulty : 'Medium';
  document.getElementById('adm-q-text').value = existing ? existing.question : '';
  document.getElementById('adm-q-explanation').value = existing ? existing.explanation : '';

  const opts = existing ? existing.options : ['', '', '', ''];
  document.getElementById('adm-q-opt-0').value = opts[0] || '';
  document.getElementById('adm-q-opt-1').value = opts[1] || '';
  document.getElementById('adm-q-opt-2').value = opts[2] || '';
  document.getElementById('adm-q-opt-3').value = opts[3] || '';

  const radios = document.getElementsByName('correctOpt');
  const correctIdx = existing ? existing.correctIndex : 0;
  radios.forEach((r, idx) => {
    r.checked = idx === correctIdx;
  });

  modal.classList.add('open');
}
