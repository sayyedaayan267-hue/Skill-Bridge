/**
 * SkillBridge - Dashboard Page Controller
 * Calculates live metrics, renders Chart.js visualizations, and manages role-based readiness.
 */

import { Analytics } from '../analytics.js';
import { AuthDemo } from '../auth-demo.js';
import { Components } from '../components.js';
import { State } from '../state.js';
import { Validation } from '../validation.js';

let skillsChartInstance = null;
let activityChartInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  // Enforce session guard
  AuthDemo.requireAuth();

  // Render unified navigation shell
  Components.renderAppShell('dashboard', 'Dashboard');

  // Load and render initial dashboard data
  initDashboard();

  // Subscribe to state updates for live reactive sync
  State.subscribe('skills', () => refreshDashboard());
  State.subscribe('projects', () => refreshDashboard());
  State.subscribe('quizAttempts', () => refreshDashboard());
  State.subscribe('roadmap', () => refreshDashboard());
  State.subscribe('internships', () => refreshDashboard());
  State.subscribe('activities', () => renderActivityFeed());
});

function initDashboard() {
  const user = State.getUser() || {};
  const roles = State.getRoles();

  // Greeting
  const greetingEl = document.getElementById('dash-greeting');
  if (greetingEl) {
    greetingEl.textContent = `Welcome back, ${user.name || 'Student'}`;
  }

  // Populate Target Role Dropdown
  const roleSelect = document.getElementById('target-role-select');
  if (roleSelect) {
    roleSelect.innerHTML = roles.map(r => `
      <option value="${r.id}" ${r.id === user.targetRoleId ? 'selected' : ''}>
        ${r.title}
      </option>
    `).join('');

    roleSelect.onchange = (e) => {
      State.updateUser({ targetRoleId: e.target.value });
      Components.showToast(`Target role switched to ${roleSelect.options[roleSelect.selectedIndex].text}`, 'info', 2000);
      refreshDashboard();
    };
  }

  refreshDashboard();
}

function refreshDashboard() {
  const user = State.getUser() || {};
  const skills = State.getSkills();
  const projects = State.getProjects();
  const attempts = State.getQuizAttempts();
  const roadmapTasks = State.getRoadmapTasks();
  const internships = State.getInternships();
  const currentRole = State.getRoleById(user.targetRoleId);

  // 1. Calculate Comprehensive Career Readiness Score
  const readiness = Analytics.calculateOverallReadiness({
    role: currentRole,
    skills,
    projects,
    attempts,
    roadmapTasks
  });

  // Update Hero Readiness Card
  document.getElementById('dash-readiness-score').textContent = readiness.overallScore;
  document.getElementById('dash-target-role-title').textContent = readiness.targetRoleTitle;
  document.getElementById('dash-readiness-tier').textContent = readiness.readinessTier;

  // Components breakdown progress
  const comps = readiness.components;
  
  // Skills Match (40%)
  document.getElementById('score-breakdown-skills-val').textContent = `${comps.skills.score}%`;
  document.getElementById('score-breakdown-skills-bar').style.width = `${comps.skills.score}%`;
  document.getElementById('score-breakdown-skills-note').textContent = 
    `${comps.skills.weightedContribution} / 40 pts weighted contribution`;

  // Projects (25%)
  document.getElementById('score-breakdown-projects-val').textContent = `${comps.projects.score}%`;
  document.getElementById('score-breakdown-projects-bar').style.width = `${comps.projects.score}%`;
  document.getElementById('score-breakdown-projects-note').textContent = 
    `${comps.projects.weightedContribution} / 25 pts weighted contribution`;

  // Assessments (20%)
  document.getElementById('score-breakdown-assessments-val').textContent = `${comps.assessments.score}%`;
  document.getElementById('score-breakdown-assessments-bar').style.width = `${comps.assessments.score}%`;
  document.getElementById('score-breakdown-assessments-note').textContent = comps.assessments.hasData 
    ? `${comps.assessments.weightedContribution} / 20 pts weighted contribution`
    : 'No quiz attempts recorded yet (0/20 pts)';

  // Roadmap (15%)
  document.getElementById('score-breakdown-roadmap-val').textContent = `${comps.roadmap.score}%`;
  document.getElementById('score-breakdown-roadmap-bar').style.width = `${comps.roadmap.score}%`;
  document.getElementById('score-breakdown-roadmap-note').textContent = 
    `${comps.roadmap.weightedContribution} / 15 pts weighted contribution`;

  // 2. Update KPI Metric Cards
  const masteredSkills = skills.filter(s => s.proficiency === 'Advanced').length;
  document.getElementById('kpi-skills-total').textContent = skills.length;
  document.getElementById('kpi-skills-meta').innerHTML = `<span>${masteredSkills} mastered</span>`;

  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  document.getElementById('kpi-projects-total').textContent = projects.length;
  document.getElementById('kpi-projects-meta').innerHTML = `<span>${completedProjects} completed</span>`;

  const avgQuiz = attempts.length > 0 
    ? Math.round(attempts.reduce((a, b) => a + b.scorePercentage, 0) / attempts.length)
    : 0;
  document.getElementById('kpi-quizzes-average').textContent = `${avgQuiz}%`;
  document.getElementById('kpi-quizzes-meta').innerHTML = `<span>${attempts.length} attempts taken</span>`;

  const activeApps = internships.filter(i => ['Applied', 'Interview', 'Offered'].includes(i.status)).length;
  document.getElementById('kpi-internships-active').textContent = activeApps;
  document.getElementById('kpi-internships-meta').innerHTML = `<span>${internships.length} opportunities logged</span>`;

  // 3. Render Chart.js Visualizations
  renderSkillsDistributionChart(skills);
  renderWeeklyActivityChart();

  // 4. Render Recommended Actions from Gap Analysis
  renderRecommendedActions(readiness.gapDetails);

  // 5. Render Upcoming Deadlines
  renderUpcomingDeadlines(roadmapTasks);

  // 6. Render Activity Feed
  renderActivityFeed();

  Components.initIcons();
}

function renderSkillsDistributionChart(skills) {
  const canvas = document.getElementById('skillsDistributionChart');
  if (!canvas || !window.Chart) return;

  const categories = {};
  skills.forEach(s => {
    const cat = s.category || 'General';
    categories[cat] = (categories[cat] || 0) + 1;
  });

  const labels = Object.keys(categories);
  const data = Object.values(categories);

  const colors = [
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#06b6d4', // cyan
    '#10b981', // green
    '#f59e0b', // amber
    '#ec4899'  // pink
  ];

  if (skillsChartInstance) {
    skillsChartInstance.destroy();
  }

  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const textColor = isDark ? '#94a3b8' : '#475569';

  skillsChartInstance = new window.Chart(canvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: isDark ? '#111827' : '#ffffff',
        borderWidth: 2,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: textColor,
            font: { family: 'Plus Jakarta Sans', size: 12 },
            boxWidth: 12,
            padding: 12
          }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.raw} skill(s)`
          }
        }
      },
      cutout: '68%'
    }
  });
}

function renderWeeklyActivityChart() {
  const canvas = document.getElementById('weeklyActivityChart');
  if (!canvas || !window.Chart) return;

  if (activityChartInstance) {
    activityChartInstance.destroy();
  }

  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const textColor = isDark ? '#94a3b8' : '#475569';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

  // Days of current week
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const studyHours = [2.5, 4.0, 3.2, 5.5, 4.2, 6.0, 3.8];

  activityChartInstance = new window.Chart(canvas, {
    type: 'bar',
    data: {
      labels: days,
      datasets: [{
        label: 'Study & Coding Hours',
        data: studyHours,
        backgroundColor: 'rgba(59, 130, 246, 0.85)',
        hoverBackgroundColor: '#3b82f6',
        borderRadius: 4,
        maxBarThickness: 28
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.raw} hrs dedicated study`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 11 } }
        },
        y: {
          grid: { color: gridColor },
          ticks: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 11 } },
          beginAtZero: true
        }
      }
    }
  });
}

function renderRecommendedActions(gapDetails) {
  const container = document.getElementById('recommended-actions-list');
  if (!container) return;

  if (!gapDetails || !gapDetails.recommendedActions || gapDetails.recommendedActions.length === 0) {
    container.innerHTML = `
      <div style="padding: 1rem; text-align: center; color: var(--color-success); font-size: 0.875rem;">
        <i data-lucide="check-circle" style="width: 24px; height: 24px; margin-bottom: 0.25rem;"></i>
        <div>Congratulations! You meet all competency thresholds for this target role.</div>
      </div>
    `;
    return;
  }

  // Display top 3 actions
  const topActions = gapDetails.recommendedActions.slice(0, 3);
  container.innerHTML = topActions.map((item, idx) => `
    <div style="display: flex; align-items: flex-start; gap: 0.75rem; padding: 0.75rem; background: var(--bg-canvas); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);">
      <div style="width: 24px; height: 24px; border-radius: 50%; background: ${item.priority === 'High' ? 'var(--color-danger-bg)' : 'var(--accent-blue-subtle)'}; color: ${item.priority === 'High' ? 'var(--color-danger)' : 'var(--accent-blue)'}; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; flex-shrink: 0;">
        ${idx + 1}
      </div>
      <div style="flex: 1;">
        <div style="font-size: 0.8125rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.15rem;">
          ${Validation.escapeHTML(item.skill)}
        </div>
        <div style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4;">
          ${Validation.escapeHTML(item.action)}
        </div>
      </div>
      <a href="./career-analyzer.html" class="btn btn-ghost btn-sm" style="padding: 0.2rem 0.5rem; font-size: 0.7rem;">
        Resolve &rarr;
      </a>
    </div>
  `).join('');
}

function renderUpcomingDeadlines(tasks) {
  const container = document.getElementById('upcoming-deadlines-list');
  if (!container) return;

  const pending = tasks.filter(t => !t.completed);
  if (pending.length === 0) {
    container.innerHTML = `
      <div style="padding: 1.5rem 0; text-align: center; color: var(--text-muted); font-size: 0.8125rem;">
        No pending deadlines. Add learning goals from the Roadmap tab!
      </div>
    `;
    return;
  }

  // Sort by date ascending
  pending.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  const topTasks = pending.slice(0, 4);

  container.innerHTML = topTasks.map(t => `
    <div class="deadline-item">
      <div style="display: flex; align-items: center; gap: 0.75rem; flex: 1; overflow: hidden;">
        <input type="checkbox" data-task-id="${t.id}" class="task-quick-check" style="cursor: pointer;" title="Mark completed" />
        <div style="overflow: hidden;">
          <div class="deadline-title" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${Validation.escapeHTML(t.title)}
          </div>
          <div class="deadline-due">
            Due: ${t.dueDate} · <span style="color: ${t.priority === 'High' ? 'var(--color-danger)' : 'var(--accent-blue)'};">${t.priority} Priority</span>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  // Handle quick completion
  container.querySelectorAll('.task-quick-check').forEach(chk => {
    chk.onchange = (e) => {
      const taskId = e.target.getAttribute('data-task-id');
      State.toggleTaskCompletion(taskId);
      Components.showToast('Milestone marked completed!', 'success');
      refreshDashboard();
    };
  });
}

function renderActivityFeed() {
  const container = document.getElementById('activity-feed-container');
  if (!container) return;

  const activities = State.getActivities().slice(0, 5);
  if (activities.length === 0) {
    container.innerHTML = `
      <div style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.8125rem;">
        No recent activities logged yet.
      </div>
    `;
    return;
  }

  container.innerHTML = activities.map(act => `
    <div class="activity-item">
      <div class="activity-icon">
        <i data-lucide="${act.icon || 'activity'}" style="width: 14px; height: 14px;"></i>
      </div>
      <div class="activity-info">
        <div class="activity-text">
          <strong style="color: var(--text-primary);">${Validation.escapeHTML(act.action)}:</strong>
          <span>${Validation.escapeHTML(act.text)}</span>
        </div>
        <div class="activity-time">${act.time}</div>
      </div>
    </div>
  `).join('');

  Components.initIcons();
}
