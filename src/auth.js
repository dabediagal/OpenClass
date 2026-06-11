// Shared authentication state across routers
let authenticatedUser = undefined;

export function getAuthenticatedUser() {
	return authenticatedUser;
}

export function setAuthenticatedUser(user) {
	authenticatedUser = user;
}

export function clearAuthenticatedUser() {
	authenticatedUser = undefined;
}