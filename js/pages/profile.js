/**
 * SkillBridge - Student Profile Page Controller
 * Manages user bio, target goals, recruiter headlines, and social links.
 */

import { AuthDemo } from '../auth-demo.js';
import { Components } from '../components.js';
import { State } from '../state.js';
import { Validation } from '../validation.js';

document.addEventListener('DOMContentLoaded', () => {
  AuthDemo.requireAuth();
  Components.renderAppShell('profile', 'Student Profile');

  loadProfileData();

  document.getElementById('profile-form').onsubmit = handleProfileSubmit;
});

function loadProfileData() {
  const user = State.getUser() || {};
  const roles = State.getRoles();
  const skills = State.getSkills();

  // Populate hero banner
  document.getElementById('profile-display-name').textContent = user.name || 'Alex Rivera';
  document.getElementById('profile-display-headline').textContent = user.headline || 'Aspiring Software Engineer';
  document.getElementById('profile-display-email').textContent = user.email || 'student@university.edu';
  document.getElementById('profile-display-education').textContent = user.education || 'Computer Science Candidate';

  const initials = (user.name || 'Alex Rivera').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  document.getElementById('profile-avatar-display').textContent = initials;

  // Populate form fields
  document.getElementById('prof-name').value = user.name || '';
  document.getElementById('prof-email').value = user.email || '';
  document.getElementById('prof-headline').value = user.headline || '';
  document.getElementById('prof-education').value = user.education || '';
  document.getElementById('prof-bio').value = user.bio || '';
  document.getElementById('prof-github').value = user.githubUrl || '';
  document.getElementById('prof-linkedin').value = user.linkedinUrl || '';

  // Roles select
  const roleSelect = document.getElementById('prof-target-role');
  roleSelect.innerHTML = roles.map(r => `
    <option value="${r.id}" ${r.id === user.targetRoleId ? 'selected' : ''}>
      ${Validation.escapeHTML(r.title)}
    </option>
  `).join('');

  // Skills Snapshot
  const snapshotContainer = document.getElementById('profile-skills-summary');
  const topSkills = skills.slice(0, 5);
  snapshotContainer.innerHTML = topSkills.map(s => {
    const pct = s.proficiency === 'Advanced' ? 100 : (s.proficiency === 'Intermediate' ? 75 : 40);
    return `
      <div>
        <div style="display: flex; justify-content: space-between; font-size: 0.775rem; margin-bottom: 0.2rem;">
          <strong style="color: var(--text-primary);">${Validation.escapeHTML(s.name)}</strong>
          <span style="color: var(--text-muted);">${s.proficiency}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${pct}%;"></div>
        </div>
      </div>
    `;
  }).join('');

  Components.initIcons();
}

function handleProfileSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('prof-name').value.trim();
  const email = document.getElementById('prof-email').value.trim();
  const headline = document.getElementById('prof-headline').value.trim();
  const education = document.getElementById('prof-education').value.trim();
  const targetRoleId = document.getElementById('prof-target-role').value;
  const bio = document.getElementById('prof-bio').value.trim();
  const githubUrl = document.getElementById('prof-github').value.trim();
  const linkedinUrl = document.getElementById('prof-linkedin').value.trim();

  if (!Validation.isNonEmpty(name)) {
    Components.showToast('Please enter your full name', 'error');
    return;
  }
  if (!Validation.isValidEmail(email)) {
    Components.showToast('Please enter a valid email address', 'error');
    return;
  }

  if (githubUrl && !Validation.isValidUrl(githubUrl)) {
    Components.showToast('GitHub URL must start with http:// or https://', 'error');
    return;
  }
  if (linkedinUrl && !Validation.isValidUrl(linkedinUrl)) {
    Components.showToast('LinkedIn URL must start with http:// or https://', 'error');
    return;
  }

  State.updateUser({
    name,
    email,
    headline,
    education,
    targetRoleId,
    bio,
    githubUrl,
    linkedinUrl
  });

  Components.showToast('Profile information successfully saved!', 'success');
  loadProfileData();

  // Re-render shell to update sidebar name and avatar
  Components.renderAppShell('profile', 'Student Profile');
}
