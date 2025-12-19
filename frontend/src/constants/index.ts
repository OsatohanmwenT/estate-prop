export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  SURVEYOR: "surveyor",
  OWNER: "owner",
} as const;

export const ROLE_OPTIONS = Object.values(ROLES);
