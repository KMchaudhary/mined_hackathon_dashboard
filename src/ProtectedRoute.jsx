import React from 'react'
import { Outlet, Navigate } from 'react-router-dom';

const useAuth = () => {
    const user = {loggedIn: false}
    const token = localStorage.getItem("user_token");
    user.loggedIn = (!token || token.trim() === "") ? false : true;
    return user.loggedIn;
}

export default function ProtectedRoute() {
    const isAuth = useAuth();
    return isAuth ? <Outlet /> : <Navigate to="/login" />
}
