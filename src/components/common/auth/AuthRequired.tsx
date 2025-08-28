import { AUTH_ROUTES } from "@/utils/path"
import { Navigate, Outlet } from "react-router-dom"

interface AuthRequiredProps {
    allowRoles: string[]
}
export const AuthRequired = ({allowRoles}:AuthRequiredProps) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user?.role || '';
    return token && allowRoles.includes(role)
        ? (<Outlet />)
        : (<Navigate to={AUTH_ROUTES.login} replace={true} />)
}