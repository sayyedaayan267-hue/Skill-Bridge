/**
 * SkillBridge - Global Application Bootstrapper
 */

import { AuthDemo } from './auth-demo.js';
import { Components } from './components.js';
import { State } from './state.js';
import { Storage } from './storage.js';

export { AuthDemo, Components, State, Storage };

document.addEventListener('DOMContentLoaded', () => {
  Components.initTheme();
  Components.initIcons();
});
