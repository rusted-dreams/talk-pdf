import express from "express";
import cors from "cors";
import multer from "multer";
import Redis from "ioredis";

const redis = new Redis();

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
  const jobData = {
    filename: req.file.originalname,
    destination: req.file.destination,
    path: req.file.path
  };

  await redis.lpush("bull:file-upload-queue", JSON.stringify(jobData));
  console.log("📤 Job pushed to queue");

  res.json({ msg: "uploaded" });
})

app.listen(8000, () => {
  console.log(`backend up at http://localhost:8000`);

})
