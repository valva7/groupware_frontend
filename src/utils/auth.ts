export type Role = "ADMIN" | "MANAGER" | "USER" | "GUEST";

export const authUtils = {
  hasRole: (userRoles: Role[], requiredRole: Role) =>
      userRoles.includes(requiredRole),

  hasAnyRole: (userRoles: Role[], requiredRoles: Role[]) =>
      requiredRoles.some((r) => userRoles.includes(r)),

  hasAllRoles: (userRoles: Role[], requiredRoles: Role[]) =>
      requiredRoles.every((r) => userRoles.includes(r)),

  isAdmin: (userRoles: Role[]) => userRoles.includes("ADMIN"),
};
