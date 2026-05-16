import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const videoDir = path.join(process.cwd(), "uploads", "videos");
const docDir = path.join(process.cwd(), "uploads", "documents");

if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });
if (!fs.existsSync(docDir)) fs.mkdirSync(docDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname.includes("videoFile")) cb(null, videoDir);
    else if (file.fieldname.includes("file")) cb(null, docDir);
    else cb(null, path.join(process.cwd(), "uploads", "misc"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname.includes("videoFile")) {
    if (file.mimetype.startsWith("video/")) cb(null, true);
    else cb(new Error("Only video files are allowed"), false);
  } else if (file.fieldname.includes("file")) {
    const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "text/plain"];
    if (allowed.includes(file.mimetype) || /\.(pdf|doc|docx|ppt|pptx|txt)$/i.test(file.originalname)) cb(null, true);
    else cb(new Error("Only documents (PDF, DOC, PPT, TXT) are allowed"), false);
  } else cb(null, false);
};

export const uploadCourseFiles = multer({ storage, fileFilter, limits: { fileSize: 200 * 1024 * 1024 } }).any();