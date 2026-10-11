/**
 * SkillBridge - Demonstration Authentication & Session Manager
 * Manages client-side session state for educational and portfolio demonstration.
 * Note: Uses LocalStorage for mock presentation; not suitable for production multi-tenant security.
 */

import { Storage, KEYS } from './storage.js';
import { Validation } from './validation.js';

export const DEMO_CREDENTIALS = {
  email: 'alex.rivera@university.edu',
  password: 'Password123!',
  name: 'Alex Rivera'
};

export const AuthDemo = {
  /**
   * Retrieves the current authenticated demo user session
   */
  getSession() {
    return Storage.get(KEYS.DEMO_AUTH, null);
  },

  /**
   * Checks if user is authenticated in demo session
   */
  isAuthenticated() {
    const session = this.getSession();
    return Boolean(session && session.isAuthenticated);
  },

  /**
   * Authenticates user against stored profile or default demo credentials
   */
  login(email, password) {
    if (!Validation.isValidEmail(email)) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    if (!Validation.isNonEmpty(password)) {
      return { success: false, message: 'Please enter your account password.' };
    }

    const trimmedEmail = email.trim().toLowerCase();
    const currentProfile = Storage.get(KEYS.USER);

    // Accept either demo account email or current profile email
    const validEmails = [
      DEMO_CREDENTIALS.email.toLowerCase(),
      'demo@skillbridge.edu',
      (currentProfile && currentProfile.email ? currentProfile.email.toLowerCase() : '')
    ];

    if (!validEmails.includes(trimmedEmail)) {
      return {
        success: false,
        message: 'Account not recognized. Use the demo account (alex.rivera@university.edu) or register a new one.'
      };
    }

    // Check demo password
    if (password !== DEMO_CREDENTIALS.password && password !== 'Password123!') {
      return {
        success: false,
        message: 'Incorrect password. Default demo password is: Password123!'
      };
    }

    const userName = currentProfile ? currentProfile.name : DEMO_CREDENTIALS.name;

    const session = {
      isAuthenticated: true,
      userEmail: trimmedEmail,
      userName: userName,
      loginTime: new Date().toISOString()
    };

    Storage.set(KEYS.DEMO_AUTH, session);
    return { success: true, user: session };
  },

  /**
   * Registers a new demo user into LocalStorage
   */
  register({ name, email, password, confirmPassword }) {
    if (!Validation.isNonEmpty(name)) {
      return { success: false, field: 'name', message: 'Full name is required.' };
    }
    if (!Validation.isValidEmail(email)) {
      return { success: false, field: 'email', message: 'Valid email address is required.' };
    }
    if (!Validation.isValidPassword(password)) {
      return { success: false, field: 'password', message: 'Password must be at least 6 characters.' };
    }
    if (password !== confirmPassword) {
      return { success: false, field: 'confirmPassword', message: 'Passwords do not match.' };
    }

    // Update profile
    const currentProfile = Storage.get(KEYS.USER) || {};
    const updatedProfile = {
      ...currentProfile,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      joinedDate: new Date().toISOString()
    };
    Storage.set(KEYS.USER, updatedProfile);

    // Create active session
    const session = {
      isAuthenticated: true,
      userEmail: email.trim().toLowerCase(),
      userName: name.trim(),
      loginTime: new Date().toISOString()
    };
    Storage.set(KEYS.DEMO_AUTH, session);

    return { success: true, user: session };
  },

  /**
   * Logs out current demo user and redirects to login screen
   */
  logout() {
    Storage.remove(KEYS.DEMO_AUTH);
    const isPagesSubdir = window.location.pathname.includes('/pages/');
    const loginUrl = isPagesSubdir ? './login.html' : './pages/login.html';
    window.location.href = loginUrl;
  },

  /**
   * Enforces protected page guard: redirects unauthenticated visitors to login
   */
  requireAuth() {
    if (!this.isAuthenticated()) {
      const isPagesSubdir = window.location.pathname.includes('/pages/');
      const loginUrl = isPagesSubdir ? './login.html' : './pages/login.html';
      window.location.href = loginUrl;
    }
  }
};
