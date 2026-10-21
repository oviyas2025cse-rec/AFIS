/**
 * AFIS - Frontend API Connector (Vanilla JavaScript)
 * Communicates with Java Jakarta Servlets on Apache Tomcat 10.1
 */

const API = {
  baseUrl: '/api',

  async request(endpoint, options = {}) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: Failed request`);
      }
      return data;
    } catch (err) {
      console.error(`API Error [${endpoint}]:`, err);
      throw err;
    }
  },

  // Auth Endpoints
  login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  },

  register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: userData,
    });
  },

  getCurrentUser() {
    return this.request('/auth/me');
  },

  logout() {
    return this.request('/auth/logout', { method: 'POST' });
  },

  // Tasks Endpoints
  getTasks(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/tasks?${params.toString()}`);
  },

  createTask(taskData) {
    return this.request('/tasks', {
      method: 'POST',
      body: taskData,
    });
  },

  updateTask(taskData) {
    return this.request('/tasks', {
      method: 'PUT',
      body: taskData,
    });
  },

  deleteTask(taskId) {
    return this.request(`/tasks?id=${encodeURIComponent(taskId)}`, {
      method: 'DELETE',
    });
  },

  toggleComplete(taskId) {
    return this.request('/tasks/complete', {
      method: 'POST',
      body: { id: taskId },
    });
  },

  // Subjects
  getSubjects() {
    return this.request('/subjects');
  },

  createSubject(subjectData) {
    return this.request('/subjects', {
      method: 'POST',
      body: subjectData,
    });
  },

  // Dashboard & Analytics
  getDashboard() {
    return this.request('/dashboard');
  },

  getAnalytics() {
    return this.request('/analytics');
  },

  getFlowRecommendation() {
    return this.request('/intelligence/recommendation');
  },
};

window.AFIS_API = API;
