/**
 * SkillBridge - Career Readiness & Skill Gap Analytics Engine
 * Implements standard, transparent formulas for scoring and role alignment.
 */

export const Analytics = {
  PROFICIENCY_VALUES: {
    Beginner: 40,
    Intermediate: 75,
    Advanced: 100
  },

  /**
   * Normalizes skill proficiency name to numeric value (0-100)
   */
  getProficiencyValue(level) {
    return this.PROFICIENCY_VALUES[level] || 0;
  },

  /**
   * Calculates Role-Skill Alignment and detailed gap breakdown
   * @param {Object} role - The career role definition
   * @param {Array} userSkills - The list of user's current skills
   */
  calculateRoleGap(role, userSkills = []) {
    if (!role || !Array.isArray(role.requiredSkills) || role.requiredSkills.length === 0) {
      return {
        roleId: role ? role.id : null,
        roleTitle: role ? role.title : 'Unspecified Role',
        matchPercentage: 0,
        matchingSkills: [],
        partialSkills: [],
        missingSkills: [],
        recommendedActions: []
      };
    }

    let totalWeight = 0;
    let earnedWeight = 0;

    const matchingSkills = [];
    const partialSkills = [];
    const missingSkills = [];
    const recommendedActions = [];

    role.requiredSkills.forEach(req => {
      const weight = req.weight || 20;
      totalWeight += weight;

      // Find user skill matching requirement name (case-insensitive)
      const userSkill = userSkills.find(s => 
        s.name.toLowerCase().trim() === req.name.toLowerCase().trim() ||
        s.name.toLowerCase().includes(req.name.toLowerCase()) ||
        req.name.toLowerCase().includes(s.name.toLowerCase())
      );

      const targetVal = this.getProficiencyValue(req.minProficiency);

      if (!userSkill) {
        missingSkills.push({
          name: req.name,
          category: req.category,
          requiredLevel: req.minProficiency,
          currentLevel: 'None',
          weight
        });
        recommendedActions.push({
          skill: req.name,
          priority: weight >= 25 ? 'High' : 'Medium',
          action: `Add "${req.name}" to your skills and start foundational learning (target: ${req.minProficiency}).`
        });
      } else {
        const userVal = this.getProficiencyValue(userSkill.proficiency);
        if (userVal >= targetVal) {
          earnedWeight += weight;
          matchingSkills.push({
            name: req.name,
            category: req.category,
            requiredLevel: req.minProficiency,
            currentLevel: userSkill.proficiency,
            userScore: userVal,
            weight
          });
        } else {
          // Partial match: earns proportional weight
          const partialRatio = userVal / targetVal;
          earnedWeight += weight * partialRatio;
          partialSkills.push({
            name: req.name,
            category: req.category,
            requiredLevel: req.minProficiency,
            currentLevel: userSkill.proficiency,
            gapPercent: Math.round((1 - partialRatio) * 100),
            weight
          });
          recommendedActions.push({
            skill: req.name,
            priority: 'High',
            action: `Upgrade "${req.name}" from ${userSkill.proficiency} to ${req.minProficiency} through hands-on practice.`
          });
        }
      }
    });

    const matchPercentage = totalWeight > 0 
      ? Math.round((earnedWeight / totalWeight) * 100) 
      : 0;

    return {
      roleId: role.id,
      roleTitle: role.title,
      matchPercentage,
      matchingSkills,
      partialSkills,
      missingSkills,
      recommendedActions
    };
  },

  /**
   * Calculates Project Portfolio Score (0 to 100)
   */
  calculateProjectScore(projects = []) {
    if (!Array.isArray(projects) || projects.length === 0) {
      return { score: 0, hasData: false, details: 'No projects logged yet.' };
    }

    const completed = projects.filter(p => p.status === 'Completed').length;
    const inProgress = projects.filter(p => p.status === 'In Progress').length;
    const withLinks = projects.filter(p => p.githubUrl || p.liveUrl).length;

    // Completed projects: 25 pts each (max 75)
    // In progress projects: 15 pts each (max 15)
    // Projects with verified repository or live links: 5 pts each (max 10)
    let rawScore = (completed * 25) + (inProgress * 15) + (withLinks * 5);
    const score = Math.min(100, rawScore);

    return {
      score,
      hasData: true,
      completedCount: completed,
      inProgressCount: inProgress,
      totalCount: projects.length,
      details: `${completed} completed, ${inProgress} in progress (${score}/100 pts)`
    };
  },

  /**
   * Calculates Assessment Performance Score (0 to 100)
   */
  calculateAssessmentScore(attempts = []) {
    if (!Array.isArray(attempts) || attempts.length === 0) {
      return {
        score: 0,
        hasData: false,
        attemptsCount: 0,
        details: 'No assessments completed yet. Take a technical quiz to calibrate your readiness.'
      };
    }

    const totalPercentage = attempts.reduce((acc, a) => acc + (a.scorePercentage || 0), 0);
    const average = Math.round(totalPercentage / attempts.length);

    return {
      score: average,
      hasData: true,
      attemptsCount: attempts.length,
      details: `${average}% average across ${attempts.length} technical assessment(s)`
    };
  },

  /**
   * Calculates Learning Roadmap Completion Score (0 to 100)
   */
  calculateRoadmapScore(tasks = []) {
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return {
        score: 0,
        hasData: false,
        totalTasks: 0,
        completedTasks: 0,
        details: 'No learning tasks in roadmap.'
      };
    }

    const completed = tasks.filter(t => t.completed).length;
    const score = Math.round((completed / tasks.length) * 100);

    return {
      score,
      hasData: true,
      totalTasks: tasks.length,
      completedTasks: completed,
      details: `${completed} of ${tasks.length} roadmap milestones achieved (${score}%)`
    };
  },

  /**
   * Master Career Readiness Score Calculation
   * Standard weighted formula:
   * - Skills Match (Target Role): 40%
   * - Project Portfolio: 25%
   * - Technical Assessments: 20%
   * - Learning Roadmap: 15%
   */
  calculateOverallReadiness({ role, skills, projects, attempts, roadmapTasks }) {
    const skillsGap = this.calculateRoleGap(role, skills);
    const projectAnalysis = this.calculateProjectScore(projects);
    const assessmentAnalysis = this.calculateAssessmentScore(attempts);
    const roadmapAnalysis = this.calculateRoadmapScore(roadmapTasks);

    // Initial weights
    const WEIGHT_SKILLS = 0.40;
    const WEIGHT_PROJECTS = 0.25;
    const WEIGHT_ASSESSMENTS = 0.20;
    const WEIGHT_ROADMAP = 0.15;

    const weightedScore = (
      (skillsGap.matchPercentage * WEIGHT_SKILLS) +
      (projectAnalysis.score * WEIGHT_PROJECTS) +
      (assessmentAnalysis.score * WEIGHT_ASSESSMENTS) +
      (roadmapAnalysis.score * WEIGHT_ROADMAP)
    );

    const overallScore = Math.min(100, Math.max(0, Math.round(weightedScore)));

    let readinessTier = 'Foundational Candidate';
    if (overallScore >= 80) readinessTier = 'Job-Ready / Competitive';
    else if (overallScore >= 65) readinessTier = 'Solid Internship Candidate';
    else if (overallScore >= 50) readinessTier = 'Developing Competency';

    return {
      overallScore,
      readinessTier,
      targetRoleTitle: role ? role.title : 'General Software Developer',
      components: {
        skills: {
          weight: 40,
          score: skillsGap.matchPercentage,
          weightedContribution: Math.round(skillsGap.matchPercentage * WEIGHT_SKILLS),
          hasData: true,
          label: 'Target Role Skill Match'
        },
        projects: {
          weight: 25,
          score: projectAnalysis.score,
          weightedContribution: Math.round(projectAnalysis.score * WEIGHT_PROJECTS),
          hasData: projectAnalysis.hasData,
          label: 'Project Portfolio Quality'
        },
        assessments: {
          weight: 20,
          score: assessmentAnalysis.score,
          weightedContribution: Math.round(assessmentAnalysis.score * WEIGHT_ASSESSMENTS),
          hasData: assessmentAnalysis.hasData,
          label: 'Technical Quizzes & Diagnostics'
        },
        roadmap: {
          weight: 15,
          score: roadmapAnalysis.score,
          weightedContribution: Math.round(roadmapAnalysis.score * WEIGHT_ROADMAP),
          hasData: roadmapAnalysis.hasData,
          label: 'Learning Roadmap Milestones'
        }
      },
      gapDetails: skillsGap
    };
  }
};
