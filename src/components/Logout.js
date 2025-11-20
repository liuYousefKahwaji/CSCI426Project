import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export default function Logout({ setAuth, setUser }) {
  useEffect(() => {
    setUser({ name: '', pass: '' });
    setAuth(false);
  }, [setAuth,setUser]);

  return <Navigate to="/login" replace/>;
}
