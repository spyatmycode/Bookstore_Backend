import multer from "multer";
import path from 'path'


const storage =  multer.memoryStorage()

/* multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images');
    },
    filename: function(req, file, cb) {  
        
        const fileName =   `${Date.now()}${path.extname(file.originalname)}`
        req.imageFileName = fileName;
        
        cb(null,fileName);
    }
}); */

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}



export let upload = multer({ storage,limits:{fileSize:3000000, files: 1} });