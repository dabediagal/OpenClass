// Shared authentication state across routers
let autenticatedUser = undefined;

export function getAuthenticatedUser() {
	return autenticatedUser;
}

export function setAuthenticatedUser(user) {
	autenticatedUser = user;
}

export function clearAuthenticatedUser() {
	autenticatedUser = undefined;
}