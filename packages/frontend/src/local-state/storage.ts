import { TOKEN_KEY, USER_KEY } from "../constants";
import { RegisterUserFragment } from "../apollo-generated";

export const getToken = (): string | null =>
  localStorage.getItem(TOKEN_KEY) || null;

export const storeToken = (token: string) =>
  localStorage.setItem(TOKEN_KEY, token);

export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const storeUser = async (user: RegisterUserFragment) =>
  localStorage.setItem(USER_KEY, JSON.stringify(user));

export const getUser = (): RegisterUserFragment | null => {
  // istanbul ignore next: ssr - no window object in nodejs
  if (typeof window === "undefined") {
    return null;
  }

  const data = localStorage.getItem(USER_KEY);

  if (data) {
    return JSON.parse(data) as RegisterUserFragment;
  }

  return null;
};

export const clearUser = async () => localStorage.removeItem(USER_KEY);
