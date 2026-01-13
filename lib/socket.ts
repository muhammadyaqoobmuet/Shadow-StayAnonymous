import { io } from "socket.io-client";

export function getSocketConnetion(token: string) {

	const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000', {
		auth: {
			token,
		},
	})
	return socket;
}