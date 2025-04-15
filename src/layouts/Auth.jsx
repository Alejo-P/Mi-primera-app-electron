import { Outlet, Navigate } from 'react-router-dom'

const Auth = () => {
  const access_token = localStorage.getItem('access_token') ? localStorage.getItem('access_token') : null;
  console.log('Auth.jsx: Comprobando acceso...');
  console.log('Auth.jsx: access_token:', access_token);
  console.log('Auth.jsx: localStorage:', localStorage);

  return (
    <>
      {access_token ? <Navigate to="/dashboard/" />: <Outlet/>}
    </>
  )
}

export default Auth