import multer from "multer";
import multerS3 from "multer-s3";
import AWS from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME;

// Setup AWS S3 bucket
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

// Upload file to S3 bucket
export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucketName,
    key: function (req, file, cb) {
      const originalString = file.originalname;
      const dashedString = originalString.replace(/ /g, "-");
      cb(null, Date.now().toString() + "-" + dashedString);
    },
  }),
});

// Delete a single file from S3
export const deleteS3File = async (fileUrl) => {
  try {
    const key = new URL(fileUrl).pathname.substring(1);
    await s3
      .deleteObject({
        Bucket: bucketName,
        Key: key,
      })
      .promise();
  } catch (error) {
    console.error("Error deleting files from S3:", error);
  }
};
