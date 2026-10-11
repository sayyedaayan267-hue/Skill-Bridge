/**
 * SkillBridge - Centralized LocalStorage Data Access Layer
 * Provides safe JSON parsing, schema initialization, backup export/import, and factory reset.
 */

import {
  DEFAULT_CAREER_ROLES,
  DEFAULT_USER_PROFILE,
  DEFAULT_SKILLS,
  DEFAULT_PROJECTS,
  DEFAULT_QUIZ_QUESTIONS,
  DEFAULT_QUIZ_ATTEMPTS,
  DEFAULT_INTERNSHIPS,
  DEFAULT_ROADMAP_TASKS,
  DEFAULT_ACTIVITY_FEED
} from './data.js';

const STORAGE_PREFIX = 'skillbridge_v1_';

export const KEYS = {
  USER: `${STORAGE_PREFIX}user`,
  SKILLS: `${STORAGE_PREFIX}skills`,
  PROJECTS: `${STORAGE_PREFIX}projects`,
  ROLES: `${STORAGE_PREFIX}roles`,
  QUIZ_QUESTIONS: `${STORAGE_PREFIX}quiz_questions`,
  QUIZ_ATTEMPTS: `${STORAGE_PREFIX}quiz_attempts`,
  INTERNSHIPS: `${STORAGE_PREFIX}internships`,
  ROADMAP: `${STORAGE_PREFIX}roadmap`,
  ACTIVITIES: `${STORAGE_PREFIX}activities`,
  SETTINGS: `${STORAGE_PREFIX}settings`,
  DEMO_AUTH: `${STORAGE_PREFIX}auth_session`
};

export const Storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null || item === undefined) return defaultValue;
      return JSON.parse(item);
    } catch (err) {
      console.warn(`[Storage] Failed to read key: ${key}`, err);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`[Storage] Failed to save key: ${key}`, err);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.warn(`[Storage] Failed to remove key: ${key}`, err);
    }
  },

  /**
   * Initializes all stores with pristine demo defaults if not present
   */
  initDefaults(forceReset = false) {
    const isInitialized = localStorage.getItem(`${STORAGE_PREFIX}initialized`);
    if (!isInitialized || forceReset) {
      this.set(KEYS.USER, DEFAULT_USER_PROFILE);
      this.set(KEYS.SKILLS, DEFAULT_SKILLS);
      this.set(KEYS.PROJECTS, DEFAULT_PROJECTS);
      this.set(KEYS.ROLES, DEFAULT_CAREER_ROLES);
      this.set(KEYS.QUIZ_QUESTIONS, DEFAULT_QUIZ_QUESTIONS);
      this.set(KEYS.QUIZ_ATTEMPTS, DEFAULT_QUIZ_ATTEMPTS);
      this.set(KEYS.INTERNSHIPS, DEFAULT_INTERNSHIPS);
      this.set(KEYS.ROADMAP, DEFAULT_ROADMAP_TASKS);
      this.set(KEYS.ACTIVITIES, DEFAULT_ACTIVITY_FEED);
      this.set(KEYS.SETTINGS, {
        theme: 'dark',
        notificationsEnabled: true,
        weeklyGoalTarget: 5
      });
      // Establish initial demo session
      this.set(KEYS.DEMO_AUTH, {
        isAuthenticated: true,
        userEmail: DEFAULT_USER_PROFILE.email,
        userName: DEFAULT_USER_PROFILE.name,
        loginTime: new Date().toISOString()
      });
      localStorage.setItem(`${STORAGE_PREFIX}initialized`, 'true');
      console.info('[Storage] SkillBridge demo dataset successfully initialized.');
    }
  },

  /**
   * Full reset back to pristine demo data
   */
  resetAll() {
    this.initDefaults(true);
  },

  /**
   * Exports full application data as JSON object
   */
  exportData() {
    return {
      version: '1.0',
      exportDate: new Date().toISOString(),
      user: this.get(KEYS.USER),
      skills: this.get(KEYS.SKILLS),
      projects: this.get(KEYS.PROJECTS),
      roles: this.get(KEYS.ROLES),
      quizQuestions: this.get(KEYS.QUIZ_QUESTIONS),
      quizAttempts: this.get(KEYS.QUIZ_ATTEMPTS),
      internships: this.get(KEYS.INTERNSHIPS),
      roadmap: this.get(KEYS.ROADMAP),
      activities: this.get(KEYS.ACTIVITIES),
      settings: this.get(KEYS.SETTINGS)
    };
  },

  /**
   * Validates and imports user backup JSON data
   */
  importData(dataObj) {
    if (!dataObj || typeof dataObj !== 'object') {
      throw new Error('Invalid JSON backup format: Root must be an object.');
    }
    if (!Array.isArray(dataObj.skills) && !Array.isArray(dataObj.projects)) {
      throw new Error('Corrupt backup: Missing core skills or projects collection.');
    }

    if (dataObj.user) this.set(KEYS.USER, dataObj.user);
    if (Array.isArray(dataObj.skills)) this.set(KEYS.SKILLS, dataObj.skills);
    if (Array.isArray(dataObj.projects)) this.set(KEYS.PROJECTS, dataObj.projects);
    if (Array.isArray(dataObj.roles)) this.set(KEYS.ROLES, dataObj.roles);
    if (Array.isArray(dataObj.quizQuestions)) this.set(KEYS.QUIZ_QUESTIONS, dataObj.quizQuestions);
    if (Array.isArray(dataObj.quizAttempts)) this.set(KEYS.QUIZ_ATTEMPTS, dataObj.quizAttempts);
    if (Array.isArray(dataObj.internships)) this.set(KEYS.INTERNSHIPS, dataObj.internships);
    if (Array.isArray(dataObj.roadmap)) this.set(KEYS.ROADMAP, dataObj.roadmap);
    if (Array.isArray(dataObj.activities)) this.set(KEYS.ACTIVITIES, dataObj.activities);
    if (dataObj.settings) this.set(KEYS.SETTINGS, dataObj.settings);

    return true;
  }
};

// Auto-run initialization check on import
Storage.initDefaults(false);
