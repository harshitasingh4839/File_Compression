const express = require('express');
const multer = require('multer');
const path = require('path');
const zlib = require('zlib');
const gzip = zlib.createGzip();
const fs = require('fs');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));
app.use(express.urlencoded({ extended: false }));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.render(path.join(__dirname, '/views/index.ejs'));
});

app.post('/upload', upload.single('Upload'), (req, res) => {
    const inputFile = path.join(__dirname, `uploads/${req.file.filename}`);
    const outputFile = path.join(__dirname, `compressed/${req.file.filename}`);
    
    const inp = fs.createReadStream(inputFile);
    const out = fs.createWriteStream(outputFile);

    inp.pipe(gzip).pipe(out); 

    console.log(req.file);
    res.redirect('/');
});

app.listen(8080, () => {
    console.log('Server started on port 8080');
});

