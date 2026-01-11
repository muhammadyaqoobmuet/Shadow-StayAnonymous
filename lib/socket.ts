import { io } from "socket.io-client";

export function getSocketConnetion(token: string) {

	const socket = io('http://localhost:3000', {
		auth: {
			token,
		},
	})
	return socket;
}