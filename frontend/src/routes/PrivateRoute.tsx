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

  if (!token) {

    localStorage.setItem(
      "redirectAfterLogin",
      location.pathname + location.search
    )

    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}