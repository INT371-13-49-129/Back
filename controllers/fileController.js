const admin = require("firebase-admin");
const multer = require("multer");
const serviceAccount = require("../jaidstorage-firebase-adminsdk-dzi4x-1045a2d7ac.json");
const { v4: uuidv4 } = require("uuid");
const { statusCode, errorResponse } = require("../utils/errorResponse");
const redis = require("redis");
const config = require("../config/config");

const client = redis.createClient({
  host: config.redis,
  port: 6379,
});
client
  .connect()
  .then(async (res) => {
    console.log("redis connected");
  })
  .catch((err) => {
    console.log(err);
  });

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "jaidstorage.appspot.com",
});
const storage = admin.storage();
const bucket = storage.bucket();

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});

exports.uploadFile = async (req, res) => {
  const upload = multerMid.single("img");
  upload(req, res, () => {
    try {
      const folder = "image";
      const file_id = `${Date.now()}_${uuidv4()}`;
      const fileName = `${folder}/${file_id}`;
      const fileUpload = bucket.file(fileName);
      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      blobStream.on("error", (err) => {
        res.status(405).json(err);
      });

      blobStream.on("finish", () => {
        res.status(200).send({
          status: "success",
          file_id,
        });
      });

      blobStream.end(req.file.buffer);
    } catch (error) {
      console.log(error);
      errorResponse(res, {
        statusResponse: 500,
        statusCode: statusCode(1001),
        errorMessage: error,
      });
    }
  });
};

exports.getFile = async (req, res) => {
  const { file_id } = req.params;
  try {
    const cached = await client.get(file_id);

    if (cached) {
      const { file, hash } = JSON.parse(cached);
      res.contentType(file.metadata.contentType);
      return res.end(Buffer.from(hash[0]), "binary");
    }
    const file = bucket.file(`image/${file_id}`);
    const hash = await file.download();
    client.setEx(file_id, 60 * 60 * 24, JSON.stringify({ file, hash }));
    res.contentType(file.metadata.contentType);
    res.end(hash[0], "binary");
  } catch (error) {
    console.log(error);
    errorResponse(res, {
      statusResponse: 500,
      statusCode: statusCode(1001),
      errorMessage: error,
    });
  }
};
