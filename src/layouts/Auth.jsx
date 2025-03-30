import { Outlet, Navigate } from 'react-router-dom'

const Auth = () => {
  const access_token = localStorage.getItem('access_token') ? localStorage.getItem('access_token') : null;

  return (
    <>
      {access_token ? <Navigate to="/dashboard/" />: <Outlet/>}
    </>
  )
}

export default Auth