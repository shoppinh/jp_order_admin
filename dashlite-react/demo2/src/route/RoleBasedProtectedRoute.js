import * as React from 'react';
import { Navigate } from 'react-router-dom';
import { useCheckRoleIncluded } from '../utils/hooks/useCheckSpecificRole';

export const RoleBaseProtectedRoute = ({
  children,
  unAuthorizedRedirectTo,
  unAuthenticatedRedirectTo,
  roles,
}) => {
  const { isLoggedIn, isValidRole } = useCheckRoleIncluded(roles);
  return isValidRole ? (
    children
  ) : (
    <Navigate to={isLoggedIn ? unAuthorizedRedirectTo : unAuthenticatedRedirectTo} />
  );
};
