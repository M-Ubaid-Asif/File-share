import express from "express"
import fileModel from "../models/fileModel"

const router = express.Router()

router.get("/:uuid", async (req, res) => {
	try {
		const { uuid } = req.params
		// console.log(uuid);
		const file = await fileModel.findOne({ uuid })
		if (!file) {
			return res.render("download", { error: "Link has been expired." })
		}
		return res.render("download", {
			uuid: file.uuid,
			fileName: file.fileName,
			fileSize: file.size,
			downloadLink: `${process.env.BASE_URL}/files/download/${file.uuid}`,
		})
	} catch (error) {
		return res.render("download", { error: "somthing went wrong." })
	}
})

export default router
