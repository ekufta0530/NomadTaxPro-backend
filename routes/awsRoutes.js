import express from "express";
import { upload } from "../utils/aws.js";
import { uploadFile } from "../controllers/awsController.js";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadFile);

export default router;
