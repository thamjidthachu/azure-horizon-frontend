export const AUTH_VIEWS = ["login", "register", "forgot-password", "reset-password"] as const;

export type AuthView = (typeof AUTH_VIEWS)[number];

export function isAuthView(value: string | null | undefined): value is AuthView {
  return !!value && AUTH_VIEWS.includes(value as AuthView);
}
