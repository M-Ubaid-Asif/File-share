import mongoose from 'mongoose'
import db from '../connections/db'

const fileSchema = new mongoose.Schema(
	{
		fileName: {
			type: String,
			required: true,
		},
		path: {
			type: String,
			required: true,
		},
		size: {
			type: Number,
			required: true,
		},
		uuid: {
			type: String,
			required: true,
		},
		sender: {
			type: String,
		},
		receiver: {
			type: String,
			required: false,
		},
	},
	{
		timestamps: true,
	}
)

export default db.model('File', fileSchema)
