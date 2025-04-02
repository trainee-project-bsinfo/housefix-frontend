const key = "AT";

export const getToken = () => localStorage.getItem(key);
export const setToken = (newToken: string) =>
  localStorage.setItem(key, newToken);
export const removeToken = () => localStorage.removeItem(key);
