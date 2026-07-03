import { Navigate, useLocation } from "react-router-dom"
import useAuthStore from "../store/authStore"

interface PrivateRouteProps {
  children: React.ReactNode
}

export default function PrivateRoute({
  children,
}: PrivateRouteProps) {
  const token = useAuthStore((state) => state.token)
  const location = useLocation()

  console.log("PrivateRoute:", location.pathname)
  console.log("Token:", token)

  if (!token) {
    console.log("Saving redirect:", location.pathname)

    localStorage.setItem(
      "redirectAfterLogin",
      location.pathname
    )

    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}