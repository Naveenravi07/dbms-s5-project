// API configuration and helper functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const config: RequestInit = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.error || "An error occurred")
    }

    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(0, "Network error. Please check your connection.")
  }
}

// API endpoints
export const api = {
  // Authentication
  register: (userData: any) =>
    apiRequest("/api/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  login: (credentials: any) =>
    apiRequest("/api/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  logout: () => apiRequest("/api/logout", { method: "POST" }),

  getCurrentUser: () => apiRequest("/api/user"),

  // Admin
  adminLogin: (credentials: any) =>
    apiRequest("/api/admin/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  checkAdmin: () => apiRequest("/api/admin/check"),

  // Doctors
  getDoctors: () => apiRequest("/api/doctors"),

  addDoctor: (doctorData: any) =>
    apiRequest("/api/doctors", {
      method: "POST",
      body: JSON.stringify(doctorData),
    }),

  updateDoctor: (id: number, doctorData: any) =>
    apiRequest(`/api/doctors/${id}`, {
      method: "PUT",
      body: JSON.stringify(doctorData),
    }),

  deleteDoctor: (id: number) =>
    apiRequest(`/api/doctors/${id}`, {
      method: "DELETE",
    }),

  // Appointments
  getAppointments: () => apiRequest("/api/appointments"),

  bookAppointment: (appointmentData: any) =>
    apiRequest("/api/appointments", {
      method: "POST",
      body: JSON.stringify(appointmentData),
    }),

  updateAppointment: (id: number, updateData: any) =>
    apiRequest(`/api/appointments/${id}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    }),

  // Users
  getUsers: () => apiRequest("/api/users"),

  // Health check
  healthCheck: () => apiRequest("/api/health"),
}
