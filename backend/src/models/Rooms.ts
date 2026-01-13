import mongoose from "mongoose"


const roomSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	location: {
		type: {
			type: String,
			enum: ['Point'],
			required: true
		},
		coordinates: {
			type: [Number],
			required: true
		}
	}
}, { timestamps: true })

roomSchema.index({ location: '2dsphere' }); // help to calculate geomtries
roomSchema.index({ createdAt: 1 },
	{ expireAfterSeconds: 60 * 60 * 24 } // 24 hour to expire the rooms
)
export const Room = mongoose.model("Room", roomSchema);


