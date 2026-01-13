import mongoose from "mongoose";



const messageSchema = new mongoose.Schema({

	// id by default goooon goon
	roomId: {
		type: mongoose.Types.ObjectId,
		ref: "Room"

	},
	userId: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	}
}, { timestamps: true })



messageSchema.index({ roomId: 1, createdAt: -1 })
messageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 })

export const Message = mongoose.model("Message", messageSchema)