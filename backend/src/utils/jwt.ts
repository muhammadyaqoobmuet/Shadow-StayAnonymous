import j, { type JsonWebTokenError } from "jsonwebtoken"
import getUniqueUser from "./genrateUniqueUser.js"
export interface JWTSession {
	token: string;
	name: string;
}

export function getJWT(): JWTSession | undefined {
	try {
		const name = getUniqueUser()
		const token = j.sign({ name }, process.env.JWT_SECRET, { expiresIn: "5h" })
		return { token, name }
	} catch (error) {
		console.log(error)
		return undefined
	}
}

export function verifyToken(token: any) {
	try {
		const decoded = j.verify(token, process.env.JWT_SECRET)
		return decoded
	} catch (error) {
		return null
	}
}