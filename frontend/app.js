
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const showRegister = document.getElementById('show-register');
  const showLogin = document.getElementById('show-login');
  const authContainer = document.getElementById('auth-container');
  const contentContainer = document.getElementById('content-container');
  const logoutButton = document.getElementById('logout-button');
  const navActions = document.getElementById('nav-actions');
  const loginError = document.getElementById('login-error');
  const registerError = document.getElementById('register-error');
  const userNameSpan = document.getElementById('user-name');

  const API_URL = 'http://localhost:5000/api';

  // Global API helper
  const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...(token && { 'x-auth-token': token })
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: { ...defaultHeaders, ...options.headers }
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          checkAuth();
        }
        throw new Error(data.msg || 'Something went wrong');
      }

      return data;
    } catch (err) {
      throw err;
    }
  };

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
      authContainer.classList.add('hidden');
      contentContainer.classList.remove('hidden');
      navActions.classList.remove('hidden');
      fetchCrops();
      fetchUser();
    } else {
      authContainer.classList.remove('hidden');
      contentContainer.classList.add('hidden');
      navActions.classList.add('hidden');
    }
  };

  const showError = (element, message) => {
    element.textContent = message;
    element.classList.remove('hidden');
    element.style.animation = 'shake 0.4s ease-in-out';
    setTimeout(() => {
      element.classList.add('hidden');
      element.style.animation = '';
    }, 5000);
  };

  const setLoading = (button, isLoading) => {
    if (isLoading) {
      button.classList.add('btn-loading');
    } else {
      button.classList.remove('btn-loading');
    }
  };

  showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
  });

  showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
  });

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button');
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    setLoading(submitBtn, true);
    try {
      const data = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      localStorage.setItem('token', data.token);
      checkAuth();
    } catch (err) {
      showError(registerError, err.message);
    } finally {
      setLoading(submitBtn, false);
    }
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button');
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    setLoading(submitBtn, true);
    try {
      const data = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('token', data.token);
      checkAuth();
    } catch (err) {
      showError(loginError, err.message);
    } finally {
      setLoading(submitBtn, false);
    }
  });

  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token');
    checkAuth();
  });

  const fetchUser = async () => {
    try {
      const user = await apiCall('/auth/me');
      userNameSpan.textContent = user.name;
    } catch (err) {
      console.error('Error fetching user:', err.message);
    }
  };

  const fetchCrops = async () => {
    try {
      const crops = await apiCall('/crops');
      const cropList = document.getElementById('crop-list');
      cropList.innerHTML = '';

      if (crops.length === 0) {
        cropList.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">No crops added yet. Start by adding one below!</p>';
        return;
      }

      crops.forEach(crop => {
        const li = document.createElement('li');
        const pDate = new Date(crop.plantingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        const hDate = crop.harvestDate ? new Date(crop.harvestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Pending';
        
        li.innerHTML = `
          <div style="font-weight: 700; font-size: 1.3rem; margin-bottom: 0.8rem; color: var(--primary-dark);">${crop.name}</div>
          <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.95rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span>🌱</span> <span>Planted: <strong>${pDate}</strong></span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span>🚜</span> <span>Harvest: <strong>${hDate}</strong></span>
            </div>
          </div>
        `;
        cropList.appendChild(li);
      });
    } catch (err) {
      console.error('Error fetching crops:', err.message);
    }
  };

  const addCropForm = document.getElementById('add-crop-form');
  addCropForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button');
    const name = document.getElementById('crop-name').value;
    const plantingDate = document.getElementById('planting-date').value;
    const harvestDate = document.getElementById('harvest-date').value;

    setLoading(submitBtn, true);
    try {
      await apiCall('/crops', {
        method: 'POST',
        body: JSON.stringify({ name, plantingDate, harvestDate }),
      });
      fetchCrops();
      addCropForm.reset();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(submitBtn, false);
    }
  });

  checkAuth();
});
