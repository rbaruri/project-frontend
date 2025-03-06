import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '@/hooks/useAuth';
import { RootState } from '@/redux/store';

const AuthContextUpdater: React.FC = () => {
  const { login, logout } = useAuth();
  const authUpdateAction = useSelector((state: RootState) => state.login.authUpdateAction);

  useEffect(() => {
    if (authUpdateAction?.type === 'login/UPDATE_AUTH_CONTEXT') {
      login(authUpdateAction.payload);
    } else if (authUpdateAction?.type === 'login/LOGOUT') {
      logout();
    }
  }, [authUpdateAction, login, logout]);

  return null;
};

export default AuthContextUpdater; 