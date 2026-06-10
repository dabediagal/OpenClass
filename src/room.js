const OV_MEET_SERVER_URL = process.env.OV_MEET_SERVER_URL || 'http://localhost:9080/meet';
const OV_MEET_API_KEY = process.env.OV_MEET_API_KEY || 'meet-api-key';

export async function createRoom(roomName) {
	const room = await httpRequest('POST', 'rooms', { roomName });
	return room;
}

export async function deleteRoom(roomId) {
	await httpRequest('DELETE', `rooms/${roomId}`);
}

async function httpRequest(method, path, body) {
	const response = await fetch(`${OV_MEET_SERVER_URL}/api/v1/${path}`, {
		method,
		headers: {
			'Content-Type': 'application/json',
			'X-API-KEY': OV_MEET_API_KEY
		},
		body: body ? JSON.stringify(body) : undefined
	});
	const responseBody = await response.json();
	if (!response.ok) {
		const error = new Error(
			responseBody.message || 'Failed to perform request to OpenVidu Meet API'
		);
		error.statusCode = response.status;
		throw error;
	}
	return responseBody;
}
