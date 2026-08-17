const http = require('http');
const fs = require('fs');
const path = require('path');

const responseData = (req, res, file) => {



    const extname = path.extname(req.url);
    if (extname !== '') {

        var filename = file;
        var filepath = path.join(__dirname, filename);

        var encoding = (extname === '.png' || extname === '.jpg') ? null : 'utf8';

        if (extname === '.css') {

            res.writeHead(200, { 'Content-Type': 'text/css' });


        } else if (extname === '.js') {
            res.writeHead(200, { 'Content-Type': 'text/js' });

        } else if (extname === '.png') {

            // console.log('image')
            res.writeHead(200, { 'Content-type': 'image/png' });

            //console.log(data);

        }







    }
    else {
        var filename = file + '.html';
        var filepath = path.join(__dirname, 'routes', filename);

        res.writeHead(200, { 'Content-Type': 'text/html' });
    }




    // console.log('Looking for:', filepath);

    if (fs.existsSync(filepath)) {

        fs.readFile(filepath, encoding, (err, data) => {

            if (err) {
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });

                res.end('Internal Server Error');
                return;
            }
            /*if (extname === '.png') {
                console.log(data)
            }*/

            res.end(data);
        });

    } else {

        res.writeHead(404, {
            'Content-Type': 'text/html'
        });

        res.end('No data found');
    }
};

http.createServer((req, res) => {

    // console.log('server started');
    //console.log('Requested URL:', req.url);

    if (req.url === '/' || req.url === '/index') {

        responseData(req, res, 'index');

    } else {

        // Remove the leading /
        const file = req.url.substring(1);

        responseData(req, res, file);
    }

}).listen(9000);
