import { Router } from 'express'

import multer from 'multer'

import path from 'path'
import { v4 } from 'uuid'
import sendMail from '../services/emailService.js'
import emailTemplate from '../services/emailTemplate.js'
import logger from '../config/logger.js'
import FileModel from '../models/fileModel.js'
import AppError from '../utils/appError.js'

const filesRouter = Router()

const storage = multer.diskStorage({
	destination: 'public/img',
	filename: (req, file, cb) => {
		cb(
			null,
			`${file.originalname.split('.')[0]}-${Date.now()}${path.extname(
				file.originalname
			)}`
		)
	},
})

const checkFile = (req, file, cb) => {
	const fileType = /jpeg|jpg|png|pdf/
	const extname = fileType.test(path.extname(file.originalname))
	const mimetype = fileType.test(file.mimetype)
	if (extname && mimetype) {
		cb(null, true)
	} else {
		cb(new AppError('file should be in image or pdf format', 401), false)
	}
}

const upload = multer({
	storage,
	fileFilter: checkFile,
}).single('image')

filesRouter.post('/files', (req, res) => {
	try {
		// store file
		upload(req, res, async (err) => {
			console.log(req.file)
			if (err) {
				return res.status(400).json({
					status: 'failed',
					error: err.message,
				})
			}

			if (!req.file) {
				return res.json({ error: 'all fields are required' })
			}
			// store in database
			const file = new FileModel({
				fileName: req.file.filename,
				uuid: v4(),
				path: req.file.path,
				size: req.file.size,
			})

			const response = await file.save()
			return res.status(201).json({
				file: `${process.env.BASE_URL}/files/${response.uuid}`,
			})
		})

		// console.log(req.file);
		// res.send("hello from files");
	} catch (error) {
		console.log('error')
		return res.status(400).json({
			status: 'failed',
			message: error.message,
		})
	}
})

filesRouter.post('/files/send', async (req, res) => {
	try {
		const { uuid, emailTo, emailFrom } = req.body
		console.log('hello', req.body)
		// validate request
		if (!uuid || !emailTo || !emailFrom) {
			return res.status(400).json({
				error: 'all fields are required',
			})
		}
		const file = await FileModel.findOne({ uuid })
		console.log(file)
		if (file.sender) {
			return res.status(400).json({
				error: 'Email already sent.',
			})
		}
		file.sender = emailFrom

		file.receiver = emailTo
		await file.save()
		console.log('ya dude', file)
		// send email
		const downloadLink = `${process.env.BASE_URL}/files/${uuid}`
		// const size = parent(file.size / 1000) + ' KB'
		const expires = '24 hours'
		sendMail({
			from: emailFrom,
			to: emailTo,
			subject: 'File Sharing',
			text: `${emailFrom} shared a file with you download this fike having amazing contents`,
			html: `${emailTemplate(emailFrom, downloadLink, file.size, expires)}`,
		})

		console.log('yayay')
		return res.status(401).json({
			success: true,
		})
	} catch (error) {
		logger.error(error)
	}
})
export default filesRouter
