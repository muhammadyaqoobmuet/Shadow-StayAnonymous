import mongoose from "mongoose";

export async function connectDb() {
	try {
		const db = await mongoose.connect(process.env.MONGO_URI);
		if (db.ConnectionStates.connected == 1) {
			console.log("db connected")
		} else if (db.ConnectionStates.disconnected == 0) {
			console.log("db disconnected")
		}
	} catch (error) {
		console.log(error)
		process.exit(1)
	}
}