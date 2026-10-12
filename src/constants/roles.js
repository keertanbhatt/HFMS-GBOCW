export const ROLES = {
  ADMIN: 'ADMIN',
  ACCOUNTANT: 'ACCOUNTANT',
  SHRAM_SEVA_KENDRA: 'SHRAM_SEVA_KENDRA',
};

export function homePathForRole(role) {
  if (role === ROLES.SHRAM_SEVA_KENDRA) return '/shram-seva';
  return '/dashboard';
}
