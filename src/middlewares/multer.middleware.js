import multer from 'multer'

const storage = multer.diskStorage({
    destination: function (req, file, cb) { // req can contain json and all but not file so that why we have another parameter file 
        cb(null, "./public/temp") // store files in ./public/temp destination  
    },

    filename: function (req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) // right now we don't need this suffix it will add unique name to our file 
        // cb(null, file.fieldname + '-' + uniqueSuffix) // changing file name 
        cb(null, file.originalname) // for now just name it as it was


    }
})

export const upload = multer({ storage })