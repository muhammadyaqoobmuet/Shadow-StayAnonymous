import { io } from "socket.io-client";

export function getSocketConnetion(token: string) {

	const socket = io(process.env.NEXT_PUBLIC_API_URL || 'https://seal-app-66ijj.ondigitalocean.app', {
		auth: {
			token,
		},
	})
	return socket;
}