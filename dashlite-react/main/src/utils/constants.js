export const STORAGE_KEY = 'jpOrder';

export const COOKIE_STORAGE_KEY = 'jpOrderCookie';

export const _FORCE_REFRESH_KEY = 'forceRefresh';
export const PREVIOUS_STORAGE_KEY = 'previousKey';

export const ConstantRoles = {
  SUPER_USER: 'SUPER_USER',
  ACCOUNTANT: 'ACCOUNTANT',
  STORAGE_MANAGER: 'STORAGE_MANAGER',
  CUSTOMER: 'CUSTOMER',
};

export const DefaultRole = [
  ConstantRoles.SUPER_USER,
  ConstantRoles.CUSTOMER,
  ConstantRoles.ACCOUNTANT,
  ConstantRoles.STORAGE_MANAGER,
];

export const ITEM_PER_PAGE = 10;
