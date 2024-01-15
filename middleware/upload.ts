import multer from 'multer';
import path from 'path';


export const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadsDir = path.resolve(__dirname,'..', 'uploads');
        cb(null, uploadsDir); // Use absolute path for the destination
    },
    filename: function (req, file, cb) {
        cb(null,  file.originalname);
    }
});

export const upload = multer({ storage: storage });
