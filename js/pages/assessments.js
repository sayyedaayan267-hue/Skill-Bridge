/**
 * SkillBridge - Technical Assessment Center Controller
 * Manages quiz session lifecycle, timer countdown, question palette, scoring, and review explanations.
 */

import { AuthDemo } from '../auth-demo.js';
import { Components } from '../components.js';
import { State } from '../state.js';
import { Validation } from '../validation.js';

// Quiz Session State
let quizQuestions = [];
let currentIndex = 0;
let userAnswers = {}; // { questionId: selectedIndex }
let flaggedQuestions = new Set();
let timerSeconds = 0;
let timerInterval = null;
let quizConfig = { title: '', totalSeconds: 0 };

document.addEventListener('DOMContentLoaded', () => {
  AuthDemo.requireAuth();
  Components.renderAppShell('assessments', 'Technical Assessment Center');

  initHubView();
});

function initHubView() {
  const attempts = State.getQuizAttempts();
  const allQuestions = State.getQuizQuestions();

  // Metrics
  const avg = attempts.length > 0 
    ? Math.round(attempts.reduce((a, b) => a + (b.scorePercentage || 0), 0) / attempts.length)
    : 0;
  document.getElementById('hub-avg-score').textContent = `${avg}%`;
  document.getElementById('hub-total-attempts').textContent = attempts.length;
  document.getElementById('hub-total-questions').textContent = allQuestions.length;

  // History Table
  const tbody = document.getElementById('quiz-history-tbody');
  if (attempts.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">
          No assessments completed yet. Start your first drill above!
        </td>
      </tr>
    `;
  } else {
    tbody.innerHTML = attempts.map(att => `
      <tr>
        <td><strong>${Validation.escapeHTML(att.quizTitle)}</strong></td>
        <td>${new Date(att.date).toLocaleDateString()}</td>
        <td>
          <span class="font-mono tabular-nums font-semibold" style="color: ${att.scorePercentage >= 75 ? 'var(--color-success)' : 'var(--color-warning)'};">
            ${att.scorePercentage}%
          </span>
        </td>
        <td>
          <span class="status-indicator ${att.scorePercentage >= 75 ? 'status-active' : 'status-warning'}">
            ${att.scorePercentage >= 75 ? 'Passed' : 'Needs Practice'}
          </span>
        </td>
        <td class="num-col">${att.correctAnswers || att.totalQuestions}/${att.totalQuestions}</td>
      </tr>
    `).join('');
  }

  // Start Assessment Trigger
  document.getElementById('start-quiz-btn').onclick = startAssessment;
}

function startAssessment() {
  const category = document.getElementById('quiz-category-select').value;
  const difficulty = document.getElementById('quiz-difficulty-select').value;
  const count = parseInt(document.getElementById('quiz-count-select').value, 10) || 10;
  const limitSeconds = parseInt(document.getElementById('quiz-timer-select').value, 10);

  let pool = State.getQuizQuestions();

  if (category !== 'ALL') {
    pool = pool.filter(q => q.category === category);
  }
  if (difficulty !== 'ALL') {
    pool = pool.filter(q => q.difficulty === difficulty);
  }

  if (pool.length === 0) {
    Components.showToast('No questions match this filter combination. Try selecting All Categories.', 'error');
    return;
  }

  // Shuffle questions randomly
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  quizQuestions = shuffled.slice(0, Math.min(count, shuffled.length));

  currentIndex = 0;
  userAnswers = {};
  flaggedQuestions.clear();
  timerSeconds = limitSeconds;
  quizConfig = {
    title: `${category === 'ALL' ? 'Comprehensive' : category} Technical Assessment`,
    totalSeconds: limitSeconds
  };

  // Switch to Runner View
  document.getElementById('quiz-hub-view').style.display = 'none';
  document.getElementById('quiz-results-view').style.display = 'none';
  document.getElementById('quiz-runner-view').style.display = 'block';

  document.getElementById('runner-title').textContent = quizConfig.title;

  initTimer();
  renderCurrentQuestion();
  renderPalette();

  // Navigation handlers
  document.getElementById('runner-prev-btn').onclick = () => {
    if (currentIndex > 0) {
      currentIndex--;
      renderCurrentQuestion();
      renderPalette();
    }
  };

  document.getElementById('runner-next-btn').onclick = () => {
    if (currentIndex < quizQuestions.length - 1) {
      currentIndex++;
      renderCurrentQuestion();
      renderPalette();
    }
  };

  document.getElementById('runner-flag-btn').onclick = () => {
    const q = quizQuestions[currentIndex];
    if (flaggedQuestions.has(q.id)) {
      flaggedQuestions.delete(q.id);
    } else {
      flaggedQuestions.add(q.id);
    }
    renderPalette();
    renderCurrentQuestion();
  };

  document.getElementById('runner-submit-btn').onclick = () => {
    const answeredCount = Object.keys(userAnswers).length;
    const unanswered = quizQuestions.length - answeredCount;

    let warning = `You have answered ${answeredCount} of ${quizQuestions.length} questions.`;
    if (unanswered > 0) {
      warning += ` ${unanswered} question(s) remain unanswered and will be marked incorrect.`;
    }

    Components.showConfirmModal({
      title: 'Submit Assessment',
      message: `${warning} Are you ready to submit and calculate your score?`,
      confirmText: 'Submit Quiz',
      confirmVariant: 'primary',
      onConfirm: () => finishAssessment()
    });
  };
}

function initTimer() {
  if (timerInterval) clearInterval(timerInterval);

  const timerBox = document.getElementById('runner-timer-box');
  const timerDisplay = document.getElementById('runner-timer-display');

  if (quizConfig.totalSeconds <= 0) {
    timerBox.style.display = 'none';
    return;
  }

  timerBox.style.display = 'flex';

  const updateDisplay = () => {
    const m = Math.floor(timerSeconds / 60);
    const s = timerSeconds % 60;
    timerDisplay.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    if (timerSeconds <= 60) {
      timerDisplay.style.color = 'var(--color-danger)';
    } else {
      timerDisplay.style.color = 'var(--text-primary)';
    }
  };

  updateDisplay();

  timerInterval = setInterval(() => {
    timerSeconds--;
    updateDisplay();

    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      Components.showToast('Time expired! Automatically submitting your assessment.', 'info', 3000);
      finishAssessment();
    }
  }, 1000);
}

function renderCurrentQuestion() {
  const q = quizQuestions[currentIndex];
  if (!q) return;

  document.getElementById('runner-progress-text').textContent = `Question ${currentIndex + 1} of ${quizQuestions.length}`;
  document.getElementById('runner-meta-category').textContent = q.category;
  document.getElementById('runner-q-category').textContent = q.category;
  document.getElementById('runner-q-difficulty').textContent = `${q.difficulty} Difficulty`;
  document.getElementById('runner-q-text').textContent = q.question;

  // Previous & Next state
  document.getElementById('runner-prev-btn').disabled = currentIndex === 0;
  const nextBtn = document.getElementById('runner-next-btn');
  if (currentIndex === quizQuestions.length - 1) {
    nextBtn.innerHTML = '<span>Review All</span> <i data-lucide="check" style="width: 16px; height: 16px;"></i>';
  } else {
    nextBtn.innerHTML = '<span>Next Question</span> <i data-lucide="arrow-right" style="width: 16px; height: 16px;"></i>';
  }

  // Flag button state
  const flagBtn = document.getElementById('runner-flag-btn');
  const isFlagged = flaggedQuestions.has(q.id);
  flagBtn.style.color = isFlagged ? 'var(--color-warning)' : 'var(--text-secondary)';
  flagBtn.innerHTML = `
    <i data-lucide="flag" style="width: 14px; height: 14px; fill: ${isFlagged ? 'var(--color-warning)' : 'none'};"></i>
    <span>${isFlagged ? 'Flagged' : 'Flag for Review'}</span>
  `;

  // Options List
  const optionsContainer = document.getElementById('runner-options-list');
  const selected = userAnswers[q.id];

  optionsContainer.innerHTML = q.options.map((opt, optIdx) => {
    const isSelected = selected === optIdx;
    return `
      <button type="button" class="option-btn" data-opt-idx="${optIdx}" style="width: 100%; text-align: left; padding: 1rem 1.25rem; border-radius: var(--radius-sm); border: 1px solid ${isSelected ? 'var(--accent-blue)' : 'var(--border-subtle)'}; background: ${isSelected ? 'var(--accent-blue-subtle)' : 'var(--bg-canvas)'}; color: var(--text-primary); cursor: pointer; display: flex; align-items: center; gap: 1rem; transition: all var(--transition-fast);">
        <div style="width: 28px; height: 28px; border-radius: 50%; border: 1px solid ${isSelected ? 'var(--accent-blue)' : 'var(--border-strong)'}; background: ${isSelected ? 'var(--accent-blue)' : 'transparent'}; color: ${isSelected ? '#ffffff' : 'var(--text-secondary)'}; display: flex; align-items: center; justify-content: center; font-size: 0.8125rem; font-weight: 700; flex-shrink: 0;">
          ${String.fromCharCode(65 + optIdx)}
        </div>
        <div style="font-size: 0.9375rem; line-height: 1.4;">
          ${Validation.escapeHTML(opt)}
        </div>
      </button>
    `;
  }).join('');

  optionsContainer.querySelectorAll('.option-btn').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.getAttribute('data-opt-idx'), 10);
      userAnswers[q.id] = idx;
      renderCurrentQuestion();
      renderPalette();
    };
  });

  Components.initIcons();
}

function renderPalette() {
  const palette = document.getElementById('runner-palette-grid');
  if (!palette) return;

  palette.innerHTML = quizQuestions.map((q, idx) => {
    const isCurrent = idx === currentIndex;
    const isAnswered = userAnswers[q.id] !== undefined;
    const isFlagged = flaggedQuestions.has(q.id);

    let bgColor = 'var(--bg-canvas)';
    let borderColor = 'var(--border-subtle)';
    let textColor = 'var(--text-secondary)';

    if (isAnswered) {
      bgColor = 'var(--color-success-bg)';
      borderColor = 'var(--color-success)';
      textColor = 'var(--color-success)';
    }
    if (isFlagged) {
      bgColor = 'var(--color-warning-bg)';
      borderColor = 'var(--color-warning)';
      textColor = 'var(--color-warning)';
    }
    if (isCurrent) {
      borderColor = 'var(--accent-blue)';
      textColor = 'var(--accent-blue)';
    }

    return `
      <button type="button" class="palette-btn" data-index="${idx}" style="aspect-ratio: 1; border-radius: var(--radius-xs); border: 2px solid ${borderColor}; background: ${bgColor}; color: ${textColor}; font-weight: 700; font-size: 0.8125rem; cursor: pointer; display: flex; align-items: center; justify-content: center; outline: ${isCurrent ? '2px solid var(--accent-blue)' : 'none'};">
        ${idx + 1}
      </button>
    `;
  }).join('');

  palette.querySelectorAll('.palette-btn').forEach(btn => {
    btn.onclick = () => {
      currentIndex = parseInt(btn.getAttribute('data-index'), 10);
      renderCurrentQuestion();
      renderPalette();
    };
  });
}

function finishAssessment() {
  if (timerInterval) clearInterval(timerInterval);

  let correctCount = 0;
  const categoryScores = {};

  quizQuestions.forEach(q => {
    const selected = userAnswers[q.id];
    const isCorrect = selected === q.correctIndex;

    if (isCorrect) correctCount++;

    if (!categoryScores[q.category]) {
      categoryScores[q.category] = { correct: 0, total: 0 };
    }
    categoryScores[q.category].total++;
    if (isCorrect) {
      categoryScores[q.category].correct++;
    }
  });

  const total = quizQuestions.length;
  const pct = Math.round((correctCount / total) * 100);

  // Save attempt
  State.addQuizAttempt({
    quizTitle: quizConfig.title,
    totalQuestions: total,
    correctAnswers: correctCount,
    scorePercentage: pct,
    timeTakenSeconds: quizConfig.totalSeconds > 0 ? (quizConfig.totalSeconds - timerSeconds) : 0,
    categoryScores
  });

  // Switch to Results View
  document.getElementById('quiz-runner-view').style.display = 'none';
  document.getElementById('quiz-results-view').style.display = 'block';

  // Results Hero
  const dial = document.getElementById('results-score-dial');
  dial.textContent = `${pct}%`;
  dial.style.color = pct >= 75 ? 'var(--color-success)' : 'var(--color-warning)';

  const verdictTitle = document.getElementById('results-verdict-title');
  const verdictSub = document.getElementById('results-verdict-sub');

  if (pct >= 85) {
    verdictTitle.textContent = 'Outstanding Mastery!';
    verdictSub.textContent = `You correctly answered ${correctCount} of ${total} questions. Your performance exceeds entry-level hiring benchmarks.`;
  } else if (pct >= 70) {
    verdictTitle.textContent = 'Solid Passing Performance';
    verdictSub.textContent = `You scored ${pct}% (${correctCount}/${total} correct). Review the detailed explanations below to close remaining knowledge gaps.`;
  } else {
    verdictTitle.textContent = 'Needs Focused Practice';
    verdictSub.textContent = `You answered ${correctCount} of ${total} correctly. Use the answers and rationale below to reinforce key concepts before retaking.`;
  }

  // Render Detailed Question-by-Question Review
  renderReviewList();

  // Results Button Handlers
  document.getElementById('results-retake-btn').onclick = () => {
    document.getElementById('quiz-results-view').style.display = 'none';
    document.getElementById('quiz-hub-view').style.display = 'block';
    initHubView();
  };

  document.getElementById('results-back-btn').onclick = () => {
    document.getElementById('quiz-results-view').style.display = 'none';
    document.getElementById('quiz-hub-view').style.display = 'block';
    initHubView();
  };

  Components.initIcons();
}

function renderReviewList() {
  const container = document.getElementById('results-review-list');
  if (!container) return;

  container.innerHTML = quizQuestions.map((q, idx) => {
    const selected = userAnswers[q.id];
    const isCorrect = selected === q.correctIndex;
    const isUnanswered = selected === undefined;

    return `
      <div style="padding: 1.5rem; background: var(--bg-canvas); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-weight: 700; color: var(--text-primary); font-size: 0.9375rem;">
              Question ${idx + 1}
            </span>
            <span class="meta-separator">·</span>
            <span class="text-muted" style="font-size: 0.75rem;">${q.category}</span>
          </div>
          <span class="status-indicator ${isCorrect ? 'status-active' : 'status-rejected'}">
            ${isCorrect ? 'Correct' : (isUnanswered ? 'Unanswered' : 'Incorrect')}
          </span>
        </div>

        <p style="font-size: 0.9375rem; color: var(--text-primary); font-weight: 600; line-height: 1.5; margin-bottom: 1rem;">
          ${Validation.escapeHTML(q.question)}
        </p>

        <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem;">
          ${q.options.map((opt, optIdx) => {
            const isThisCorrect = optIdx === q.correctIndex;
            const isThisChosen = optIdx === selected;

            let border = 'var(--border-subtle)';
            let bg = 'transparent';
            let labelBadge = '';

            if (isThisCorrect) {
              border = 'var(--color-success)';
              bg = 'var(--color-success-bg)';
              labelBadge = '<span style="color: var(--color-success); font-weight: 700; margin-left: auto; font-size: 0.75rem;">Correct Answer</span>';
            } else if (isThisChosen && !isThisCorrect) {
              border = 'var(--color-danger)';
              bg = 'var(--color-danger-bg)';
              labelBadge = '<span style="color: var(--color-danger); font-weight: 700; margin-left: auto; font-size: 0.75rem;">Your Answer</span>';
            }

            return `
              <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.625rem 1rem; border-radius: var(--radius-xs); border: 1px solid ${border}; background: ${bg}; font-size: 0.875rem;">
                <span class="font-mono font-semibold" style="width: 20px;">${String.fromCharCode(65 + optIdx)}.</span>
                <span>${Validation.escapeHTML(opt)}</span>
                ${labelBadge}
              </div>
            `;
          }).join('')}
        </div>

        <!-- Explanation Card -->
        <div style="padding: 0.75rem 1rem; background: var(--bg-surface-elevated); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); font-size: 0.8125rem; color: var(--text-secondary); line-height: 1.5;">
          <strong style="color: var(--text-primary); display: flex; align-items: center; gap: 0.35rem; margin-bottom: 0.25rem;">
            <i data-lucide="info" style="width: 14px; height: 14px; color: var(--accent-blue);"></i>
            Technical Explanation:
          </strong>
          ${Validation.escapeHTML(q.explanation)}
        </div>
      </div>
    `;
  }).join('');
}
