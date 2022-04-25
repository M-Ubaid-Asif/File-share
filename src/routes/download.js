import express from "express";
import path from "path";
import fileModel from "../models/fileModel";

const downloadRouter = express.Router();

downloadRouter.get("/:uuid", async (req, res) => {
  const file = await fileModel.findOne({ uuid: req.params.uuid });
  if (!file) {
    return res.render("download", { error: "link has been expired" });
  }

  const filePath = path.join(process.cwd().toString(), `${file.path}`);
  console.log(filePath);
  res.download(filePath);
});

export default downloadRouter;
