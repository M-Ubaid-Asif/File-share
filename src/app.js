import express, { json, urlencoded } from "express"
import path from "path"
import errorHandler from "./helpers/errorHandler.js"
import filesRouter from "./routes/files"
import router from "./routes/show"

import downloadRouter from "./routes/download.js"

const app = express()

// public path
const viewpath = path.join(process.cwd().toString(), "/src/views")

app.use(json())
app.use(urlencoded({ extended: true }))

app.use(express.static("./public"))
app.use("/css", express.static("public"))
app.use("/img", express.static("public"))
// set view engine ejs
app.set("view engine", "ejs")
app.set("views", viewpath)
// app.use(expressLayouts);
// routes
app.use("/api/v1", filesRouter)
app.use("/files", router)
app.use("/files/download", downloadRouter)
app.use(errorHandler)
export default app
