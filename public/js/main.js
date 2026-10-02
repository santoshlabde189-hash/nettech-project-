/**
 * Frontend Utilities and API Client for Nettech Help Desk
 */

const API_BASE = '/api';

// Toast Notification Manager
const showToast = (message, type = 'info') => {
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    document.body.appendChild(toastContainer);
  }

  const toastId = 'toast-' + Date.now();
  const bgClass = type === 'success' ? 'bg-success text-white' :
                  type === 'danger' || type === 'error' ? 'bg-danger text-white' :
                  type === 'warning' ? 'bg-warning text-dark' : 'bg-primary text-white';

  const toastHtml = `
    <div id="${toastId}" class="toast align-items-center ${bgClass} border-0 shadow" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body fw-semibold">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;

  toastContainer.insertAdjacentHTML('beforeend', toastHtml);
  const element = document.getElementById(toastId);
  const toast = new bootstrap.Toast(element, { delay: 4000 });
  toast.show();

  element.addEventListener('hidden.bs.toast', () => {
    element.remove();
  });
};

// Authentication state helpers
const getAuthToken = () => localStorage.getItem('token');
const getAuthUser = () => {
  const user = localStorage.getItem('user');
  try {
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
};
const setAuthData = (token, role, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
};
const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user');
};

const logout = () => {
  clearAuth();
  window.location.href = '/login.html';
};

// Generic authenticated API fetcher
const apiFetch = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = { ...options.headers };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (res.status === 401) {
        clearAuth();
        // Redirect to login if on protected page
        if (!window.location.pathname.endsWith('login.html') && !window.location.pathname.endsWith('register.html') && window.location.pathname !== '/') {
          window.location.href = '/login.html';
        }
      }
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Role guard utility for frontend pages
const checkPageAuth = (requiredRole) => {
  const token = getAuthToken();
  const userRole = localStorage.getItem('role');

  if (!token) {
    window.location.href = '/login.html';
    return false;
  }

  if (requiredRole && userRole !== requiredRole) {
    if (userRole === 'admin') {
      window.location.href = '/admin/dashboard.html';
    } else {
      window.location.href = '/user/dashboard.html';
    }
    return false;
  }

  return true;
};

// Navbar setup utility
const setupNavbar = () => {
  const user = getAuthUser();
  const role = localStorage.getItem('role');
  const userDisplayEl = document.getElementById('navbarUserDisplay');
  const avatarEl = document.getElementById('navbarAvatar');

  if (userDisplayEl && user) {
    userDisplayEl.textContent = user.name || user.email;
  }

  if (avatarEl && user) {
    if (user.profilePic) {
      avatarEl.src = user.profilePic;
      avatarEl.classList.remove('d-none');
    }
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }
};

// Format Date helper
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const d = new Date(dateString);
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Render status badge HTML
const getStatusBadge = (status) => {
  const map = {
    open: { class: 'badge-status-open', label: 'Open' },
    in_progress: { class: 'badge-status-in_progress', label: 'In Progress' },
    resolved: { class: 'badge-status-resolved', label: 'Resolved' },
    closed: { class: 'badge-status-closed', label: 'Closed' }
  };
  const conf = map[status] || { class: 'bg-secondary text-white', label: status };
  return `<span class="badge ${conf.class} rounded-pill px-2 py-1">${conf.label}</span>`;
};

// Render priority badge HTML
const getPriorityBadge = (priority) => {
  const map = {
    low: { class: 'badge-priority-low', label: 'Low' },
    medium: { class: 'badge-priority-medium', label: 'Medium' },
    high: { class: 'badge-priority-high', label: 'High' }
  };
  const conf = map[priority] || { class: 'bg-light text-dark border', label: priority };
  return `<span class="badge ${conf.class} rounded-pill px-2 py-1">${conf.label}</span>`;
};
