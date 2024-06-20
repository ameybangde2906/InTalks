import multer from 'multer';

const storage = multer.memoryStorage();

const singleUpload = multer({ storage , limits: { fileSize: 100 * 1024 * 1024 }}).single("audioVideo")

export default singleUpload;