// This is what a logged-in user looks like
export interface User {
  _id: string
  name: string
  email: string
  avatar?: string        // ? means optional — they may not have an avatar
  role: "admin" | "member"  // can only be one of these two values
  createdAt: string
}

// What we send TO the backend when logging in
export interface LoginRequest {
  email: string
  password: string
}

// What we send TO the backend when signing up
export interface SignupRequest {
  name: string
  email: string
  password: string
}

// What the backend sends BACK after login/signup
export interface AuthResponse {
  token: string
  user: User
}