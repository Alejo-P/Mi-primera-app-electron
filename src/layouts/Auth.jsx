import { Outlet, Navigate } from 'react-router-dom'
import Cookies from 'js-cookie';

const Auth = () => {
  const csrf_access_token = Cookies.get('csrf_access_token');

  return (
    <>
      {csrf_access_token ? <Navigate to="/dashboard/" />: <Outlet/>}
    </>
  )
}

export default Auth