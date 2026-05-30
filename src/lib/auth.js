const STORAGE_KEY = "revive_admin_authenticated";

export function checkPersistedAuth() {
  return localStorage.getItem(STORAGE_KEY) === "true";
}

export function persistAuth() {
  localStorage.setItem(STORAGE_KEY, "true");
}

export function clearAuth() {
  localStorage.removeItem(STORAGE_KEY);
}

export function validatePassword(input) {
  return input && input.length > 0;
}
