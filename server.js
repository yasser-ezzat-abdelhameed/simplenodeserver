// require modules
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');

// mimeTypes
var mimeTypes = {
    html:       'text/html',
    jpeg:       'image/jpeg',
    jpg:        'image/jpeg',
    png:        'image/png',
    javascript: 'text/javascript',
    css:        'text/css'
};

// create server
http.createServer(function (req, res) {
    var uri = url.parse(req.url).pathname;
    var fileName = path.join(process.cwd(), unescape(uri));// process.cwd(): returns the current dir process
    console.log('Loading ' + uri);
    var stats;
    try{
        stats = fs.lstatSync(fileName);
    } catch (e) {
        console.log(e);
        res.writeHead(404, {'Content-type': 'text/plain'});
        res.write('404 Not Found!\n');
        res.end();
        return;
    }

    // check if file or dir
    if (stats.isFile()) {
        var mimeType = mimeTypes[path.extname(fileName).split('.').reverse[0]];
        res.writeHead(200, {'Content-type': mimeType});
        var fileStream = fs.createReadStream(fileName);
        fileStream.pipe(res);
    } else if (stats.isDirectory()) {
        res.writeHead(302, {
            Location: 'index.html'
        });
        res.end();
    } else {
        res.writeHead(500, {'Content-type': 'text/plain'});
        res.write('500 Internal Error!\n');
        res.end();
    }
}).listen(3000);