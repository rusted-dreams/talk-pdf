import express from "express";
import cors from "cors";
import multer from "multer";
import { Queue } from "bullmq";

const queue = new Queue("file-upload-queue", {
  connection: {
    host: "localhost",
    port: "6379"
  }
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + "-" + file.originalname)
  }
})

const upload = multer({ storage: storage })

const app = express();

app.use(cors())

app.get("/", (req, res) => {
  res.status(200).json({
    msg: "all good"
  })
})

app.post("/api/upload/pdf", upload.single("pdf"), async (req, res) => {
  // add the file to the queue
  await queue.add('file-ready',
    JSON.stringify({
      filename: req.file.originalname,
      destination: req.file.destination,
      path: req.file.path
    })
  )

  res.json({ msg: "uploaded" })
})

app.listen(8000, () => {
  console.log(`backend up at http://localhost:8000`);

})
