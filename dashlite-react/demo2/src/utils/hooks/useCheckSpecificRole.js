import { useSelector } from 'react-redux';
import { getAccessToken, getUserInfo } from '../../store/selectors/session';

export const useCheckRoleIncluded = (roles) => {
  const currentAccessToken = useSelector(getAccessToken);
  const currentUser = useSelector(getUserInfo);
  const isLoggedIn = !!(currentAccessToken && currentAccessToken !== '');
  const isValidRole = isLoggedIn && roles.includes(currentUser?.role);

  return {
    isValidRole,
    isLoggedIn,
  };
};
