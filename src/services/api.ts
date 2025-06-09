// Determine the API URL based on the environment
const API_URL = '/.netlify/functions/api';  // Using Netlify Functions

export const api = {
  login: async (code: string) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: `HTTP error! status: ${response.status}` }));
        throw new Error(error.error || 'Login failed');
      }
      
      return response.json();
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to the server. Please check your internet connection or try again later.');
      }
      throw error;
    }
  },

  registerStudent: async (name: string, email: string) => {
    const response = await fetch(`${API_URL}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    return response.json();
  },

  getStudents: async () => {
    const response = await fetch(`${API_URL}/students`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch students');
    }
    
    return response.json();
  },

  updateProgress: async (email: string, weekId: number, updatedWeek: any) => {
    const response = await fetch(`${API_URL}/students/${email}/progress`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ weekId, updatedWeek }),
    });

    if (!response.ok) {
      throw new Error('Failed to update progress');
    }

    return response.json();
  },

  deleteStudent: async (email: string) => {
    const response = await fetch(`${API_URL}/students/${email}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete student');
    }
  },
};