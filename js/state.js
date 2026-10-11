/**
 * SkillBridge - Centralized State Manager
 * Employs a reactive Pub/Sub store pattern connecting views, LocalStorage, and analytics.
 */

import { Storage, KEYS } from './storage.js';

class StateManager {
  constructor() {
    this.listeners = new Map();
  }

  subscribe(entity, callback) {
    if (!this.listeners.has(entity)) {
      this.listeners.set(entity, new Set());
    }
    this.listeners.get(entity).add(callback);
    return () => this.listeners.get(entity).delete(callback);
  }

  notify(entity, data) {
    if (this.listeners.has(entity)) {
      this.listeners.get(entity).forEach(cb => {
        try {
          cb(data);
        } catch (err) {
          console.error(`[State] Error in listener for ${entity}:`, err);
        }
      });
    }
  }

  // --- User Profile ---
  getUser() {
    return Storage.get(KEYS.USER);
  }

  updateUser(updates) {
    const current = this.getUser() || {};
    const updated = { ...current, ...updates };
    Storage.set(KEYS.USER, updated);
    this.notify('user', updated);
    return updated;
  }

  // --- Skills ---
  getSkills() {
    return Storage.get(KEYS.SKILLS, []);
  }

  addSkill(skill) {
    const skills = this.getSkills();
    const newSkill = {
      id: `sk-${Date.now()}`,
      numericScore: skill.proficiency === 'Advanced' ? 90 : (skill.proficiency === 'Intermediate' ? 70 : 40),
      status: 'Active Learning',
      ...skill
    };
    skills.push(newSkill);
    Storage.set(KEYS.SKILLS, skills);
    this.logActivity('Skill Added', `Logged new skill '${newSkill.name}' (${newSkill.proficiency})`, 'trending-up');
    this.notify('skills', skills);
    return newSkill;
  }

  updateSkill(id, updates) {
    const skills = this.getSkills();
    const index = skills.findIndex(s => s.id === id);
    if (index === -1) return null;

    skills[index] = { ...skills[index], ...updates };
    Storage.set(KEYS.SKILLS, skills);
    this.notify('skills', skills);
    return skills[index];
  }

  deleteSkill(id) {
    const skills = this.getSkills();
    const target = skills.find(s => s.id === id);
    const filtered = skills.filter(s => s.id !== id);
    Storage.set(KEYS.SKILLS, filtered);
    if (target) {
      this.logActivity('Skill Removed', `Removed '${target.name}' from your skills inventory`, 'trash-2');
    }
    this.notify('skills', filtered);
    return true;
  }

  // --- Projects ---
  getProjects() {
    return Storage.get(KEYS.PROJECTS, []);
  }

  addProject(project) {
    const projects = this.getProjects();
    const newProject = {
      id: `proj-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      featured: false,
      ...project
    };
    projects.unshift(newProject);
    Storage.set(KEYS.PROJECTS, projects);
    this.logActivity('Project Created', `Added portfolio project '${newProject.title}'`, 'folder-plus');
    this.notify('projects', projects);
    return newProject;
  }

  updateProject(id, updates) {
    const projects = this.getProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) return null;

    projects[index] = { ...projects[index], ...updates };
    Storage.set(KEYS.PROJECTS, projects);
    this.notify('projects', projects);
    return projects[index];
  }

  deleteProject(id) {
    const projects = this.getProjects();
    const filtered = projects.filter(p => p.id !== id);
    Storage.set(KEYS.PROJECTS, filtered);
    this.notify('projects', filtered);
    return true;
  }

  // --- Roles ---
  getRoles() {
    return Storage.get(KEYS.ROLES, []);
  }

  getRoleById(id) {
    const roles = this.getRoles();
    return roles.find(r => r.id === id) || roles[0];
  }

  // --- Quiz Questions ---
  getQuizQuestions() {
    return Storage.get(KEYS.QUIZ_QUESTIONS, []);
  }

  addQuizQuestion(q) {
    const questions = this.getQuizQuestions();
    const newQ = { id: `q-custom-${Date.now()}`, ...q };
    questions.push(newQ);
    Storage.set(KEYS.QUIZ_QUESTIONS, questions);
    this.notify('quizQuestions', questions);
    return newQ;
  }

  updateQuizQuestion(id, updates) {
    const questions = this.getQuizQuestions();
    const idx = questions.findIndex(q => q.id === id);
    if (idx === -1) return null;
    questions[idx] = { ...questions[idx], ...updates };
    Storage.set(KEYS.QUIZ_QUESTIONS, questions);
    this.notify('quizQuestions', questions);
    return questions[idx];
  }

  deleteQuizQuestion(id) {
    const questions = this.getQuizQuestions();
    const filtered = questions.filter(q => q.id !== id);
    Storage.set(KEYS.QUIZ_QUESTIONS, filtered);
    this.notify('quizQuestions', filtered);
    return true;
  }

  // --- Quiz Attempts ---
  getQuizAttempts() {
    return Storage.get(KEYS.QUIZ_ATTEMPTS, []);
  }

  addQuizAttempt(attempt) {
    const attempts = this.getQuizAttempts();
    const newAttempt = {
      id: `attempt-${Date.now()}`,
      date: new Date().toISOString(),
      ...attempt
    };
    attempts.unshift(newAttempt);
    Storage.set(KEYS.QUIZ_ATTEMPTS, attempts);
    this.logActivity(
      'Assessment Completed',
      `Completed ${newAttempt.quizTitle} with ${newAttempt.scorePercentage}% score`,
      'award'
    );
    this.notify('quizAttempts', attempts);
    return newAttempt;
  }

  // --- Internships ---
  getInternships() {
    return Storage.get(KEYS.INTERNSHIPS, []);
  }

  addInternship(item) {
    const list = this.getInternships();
    const newItem = {
      id: `int-${Date.now()}`,
      isSampleDemo: true,
      status: 'Saved',
      isBookmarked: false,
      ...item
    };
    list.unshift(newItem);
    Storage.set(KEYS.INTERNSHIPS, list);
    this.notify('internships', list);
    return newItem;
  }

  updateInternship(id, updates) {
    const list = this.getInternships();
    const idx = list.findIndex(i => i.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    Storage.set(KEYS.INTERNSHIPS, list);
    this.notify('internships', list);
    return list[idx];
  }

  deleteInternship(id) {
    const list = this.getInternships();
    const filtered = list.filter(i => i.id !== id);
    Storage.set(KEYS.INTERNSHIPS, filtered);
    this.notify('internships', filtered);
    return true;
  }

  toggleInternshipBookmark(id) {
    const list = this.getInternships();
    const item = list.find(i => i.id === id);
    if (!item) return false;
    item.isBookmarked = !item.isBookmarked;
    Storage.set(KEYS.INTERNSHIPS, list);
    this.notify('internships', list);
    return item.isBookmarked;
  }

  updateInternshipStatus(id, newStatus) {
    const list = this.getInternships();
    const item = list.find(i => i.id === id);
    if (!item) return null;
    const oldStatus = item.status;
    item.status = newStatus;
    if (newStatus === 'Applied' && !item.appliedDate) {
      item.appliedDate = new Date().toISOString().split('T')[0];
    }
    Storage.set(KEYS.INTERNSHIPS, list);
    this.logActivity(
      'Application Pipeline',
      `Moved '${item.company}' from ${oldStatus} to ${newStatus}`,
      'send'
    );
    this.notify('internships', list);
    return item;
  }

  // --- Roadmap Tasks ---
  getRoadmapTasks() {
    return Storage.get(KEYS.ROADMAP, []);
  }

  addTask(task) {
    const tasks = this.getRoadmapTasks();
    const newTask = {
      id: `task-${Date.now()}`,
      completed: false,
      completedDate: null,
      ...task
    };
    tasks.push(newTask);
    Storage.set(KEYS.ROADMAP, tasks);
    this.logActivity('Roadmap Goal Added', `Added milestone: '${newTask.title}'`, 'check-square');
    this.notify('roadmap', tasks);
    return newTask;
  }

  updateTask(id, updates) {
    const tasks = this.getRoadmapTasks();
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return null;
    tasks[idx] = { ...tasks[idx], ...updates };
    Storage.set(KEYS.ROADMAP, tasks);
    this.notify('roadmap', tasks);
    return tasks[idx];
  }

  toggleTaskCompletion(id) {
    const tasks = this.getRoadmapTasks();
    const task = tasks.find(t => t.id === id);
    if (!task) return null;
    task.completed = !task.completed;
    task.completedDate = task.completed ? new Date().toISOString().split('T')[0] : null;
    Storage.set(KEYS.ROADMAP, tasks);
    if (task.completed) {
      this.logActivity('Milestone Achieved', `Completed '${task.title}'`, 'check-circle');
    }
    this.notify('roadmap', tasks);
    return task;
  }

  deleteTask(id) {
    const tasks = this.getRoadmapTasks();
    const filtered = tasks.filter(t => t.id !== id);
    Storage.set(KEYS.ROADMAP, filtered);
    this.notify('roadmap', filtered);
    return true;
  }

  // --- Activities ---
  getActivities() {
    return Storage.get(KEYS.ACTIVITIES, []);
  }

  logActivity(action, text, icon = 'activity') {
    const activities = this.getActivities();
    const item = {
      id: `act-${Date.now()}`,
      action,
      text,
      time: 'Just now',
      icon
    };
    activities.unshift(item);
    if (activities.length > 20) activities.pop(); // keep last 20
    Storage.set(KEYS.ACTIVITIES, activities);
    this.notify('activities', activities);
    return item;
  }

  // --- Settings ---
  getSettings() {
    return Storage.get(KEYS.SETTINGS, { theme: 'dark', notificationsEnabled: true });
  }

  updateSettings(updates) {
    const current = this.getSettings();
    const updated = { ...current, ...updates };
    Storage.set(KEYS.SETTINGS, updated);
    this.notify('settings', updated);
    return updated;
  }
}

export const State = new StateManager();
