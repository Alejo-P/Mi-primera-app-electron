import { Outlet, Navigate } from 'react-router-dom'

const Auth = () => {
    const token = localStorage.getItem("token")
    return (
        <main className="flex justify-center content-center w-full h-screen ">
          {token ? <Navigate to="/dashboard" />: <Outlet/>}
        </main>
    )
}

export default Auth