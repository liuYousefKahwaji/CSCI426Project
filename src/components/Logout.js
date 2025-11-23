import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export default function Logout({ setAuth, setUser }) {
  // clear user on logout
  useEffect(() => {
    setUser({ name: '', pass: '' });
    setAuth(false);
  }, [setAuth,setUser]);

  return <Navigate to="/login" replace/>;
}
