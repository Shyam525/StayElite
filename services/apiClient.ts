import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.stayelite.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Property endpoints
export const propertyService = {
  getAll: () => apiClient.get('/properties'),
  getById: (id: string) => apiClient.get(`/properties/${id}`),
  search: (params: Record<string, any>) => apiClient.get('/properties/search', { params }),
  create: (data: any) => apiClient.post('/properties', data),
  update: (id: string, data: any) => apiClient.put(`/properties/${id}`, data),
  delete: (id: string) => apiClient.delete(`/properties/${id}`),
};

// Booking endpoints
export const bookingService = {
  getAll: () => apiClient.get('/bookings'),
  getById: (id: string) => apiClient.get(`/bookings/${id}`),
  create: (data: any) => apiClient.post('/bookings', data),
  cancel: (id: string) => apiClient.post(`/bookings/${id}/cancel`),
};

export default apiClient;
