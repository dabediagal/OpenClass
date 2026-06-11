import { VirtualClass } from './models/virtual_class.js';

export function authMiddleware(req, res, next) {
	const userId = req.cookies?.authUserId;
	if (userId) {
		const user = VirtualClass.getUser(userId);
		if (user) {
			req.authenticatedUser = user;
		}
	}
	return next();
}

export function requireAuth(req, res, next) {
	if (!req.authenticatedUser) {
		return res.redirect('/login.html');
	}
	return next();
}

export function getAuthenticatedUser(req) {
	return req.authenticatedUser;
}

export function loginUser(user, res) {
	res.cookie('authUserId', user.id, {
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 24 * 60 * 60 * 1000 // 1 day
	});
}

export function logoutUser(res) {
	res.clearCookie('authUserId');
}
