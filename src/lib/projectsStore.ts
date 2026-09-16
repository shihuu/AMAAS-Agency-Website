import { Project } from '../types';
import { PROJECTS_DATA } from '../data';

const STORAGE_KEY = 'amaas_portfolio_projects_v2';
const EVENT_NAME = 'amaas_projects_updated';

// Helper to get initial or saved projects
export function getStoredProjects(): Project[] {
  if (typeof window === 'undefined') {
    return PROJECTS_DATA;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First time initialization
      localStorage.setItem(STORAGE_KEY, JSON.stringify(PROJECTS_DATA));
      return PROJECTS_DATA;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure sorted by order
      return parsed.sort((a: Project, b: Project) => (a.order || 0) - (b.order || 0));
    }
    return PROJECTS_DATA;
  } catch (err) {
    console.error('Failed to load projects from localStorage:', err);
    return PROJECTS_DATA;
  }
}

// Save projects to localStorage and notify listeners
export function saveStoredProjects(projects: Project[]): void {
  if (typeof window === 'undefined') return;
  try {
    // Ensure all projects have an order index
    const sorted = projects.map((p, idx) => ({
      ...p,
      order: p.order ?? idx + 1,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: sorted }));
  } catch (err) {
    console.error('Failed to save projects to localStorage:', err);
  }
}

// Add a new project
export function addStoredProject(newProject: Project): Project[] {
  const current = getStoredProjects();
  const projectWithOrder = {
    ...newProject,
    order: newProject.order ?? current.length + 1,
  };
  const updated = [...current, projectWithOrder];
  saveStoredProjects(updated);
  return updated;
}

// Update an existing project
export function updateStoredProject(id: string, updates: Partial<Project>): Project[] {
  const current = getStoredProjects();
  const updated = current.map((p) => {
    if (p.id === id) {
      return {
        ...p,
        ...updates,
        caseStudy: {
          ...p.caseStudy,
          ...(updates.caseStudy || {}),
        },
      };
    }
    return p;
  });
  saveStoredProjects(updated);
  return updated;
}

// Delete a project
export function deleteStoredProject(id: string): Project[] {
  const current = getStoredProjects();
  const updated = current.filter((p) => p.id !== id);
  // Re-index orders
  const reindexed = updated.map((p, idx) => ({ ...p, order: idx + 1 }));
  saveStoredProjects(reindexed);
  return reindexed;
}

// Move project up or down
export function reorderStoredProject(id: string, direction: 'up' | 'down'): Project[] {
  const current = [...getStoredProjects()].sort((a, b) => (a.order || 0) - (b.order || 0));
  const idx = current.findIndex((p) => p.id === id);
  if (idx === -1) return current;

  const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (targetIdx < 0 || targetIdx >= current.length) return current;

  const temp = current[idx];
  current[idx] = current[targetIdx];
  current[targetIdx] = temp;

  const updated = current.map((p, i) => ({ ...p, order: i + 1 }));
  saveStoredProjects(updated);
  return updated;
}

// Reset to initial 3 projects
export function resetProjectsToDefault(): Project[] {
  saveStoredProjects(PROJECTS_DATA);
  return PROJECTS_DATA;
}

// Custom React hook for auto-syncing
export function subscribeProjects(callback: (projects: Project[]) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleUpdate = (e: Event) => {
    const customEvent = e as CustomEvent<Project[]>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    } else {
      callback(getStoredProjects());
    }
  };

  window.addEventListener(EVENT_NAME, handleUpdate);
  window.addEventListener('storage', handleUpdate);

  return () => {
    window.removeEventListener(EVENT_NAME, handleUpdate);
    window.removeEventListener('storage', handleUpdate);
  };
}
