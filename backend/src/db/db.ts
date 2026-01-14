import mongoose from "mongoose";

export async function connectDb() {
	try {
		await mongoose.connect(process.env.MONGO_URI, {
			autoIndex: true
		});

		console.log("db connected ✅");
	} catch (error) {
		console.error("db connection failed ❌", error);
		process.exit(1);
	}
}
