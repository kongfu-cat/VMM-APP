// var handleReadFileSuccess = (res) => {
//     this.testValue = res.data
// }
// var handleWriteFileSuccess = (fileEntry) => {
//     readFile(fileEntry)
// }

function writeFile (fileEntry, dataObj, handleWriteFileSuccess) {
    fileEntry.createWriter(function (fileWriter) {
        fileWriter.onwriteend = function () {
            console.log("Successful file write...");
            handleWriteFileSuccess(fileEntry);
        };
        fileWriter.onerror = function (e) {
            console.log("Failed file write: " + e.toString());
        };
        if (!dataObj) {
            console.log("Failed file write: no data to write");
            // dataObj = new Blob(['some file data'], { type: 'text/plain' });
            dataObj = ''
        }
        fileWriter.write(dataObj);
    });
}
function readFile (fileEntry, handleReadFileSuccess) {
    fileEntry.file(function (file) {
        var reader = new FileReader();
        reader.onloadend = function () {
            console.log("Successful file read: " + this.result);
            handleReadFileSuccess({ path: fileEntry.fullPath, data: this.result });
        };
        reader.readAsText(file);
    }, errorCallback);
}
function errorCallback (error) {
    console.log("file system error: " + error)
}
export function doWriteFile (filename, data, handleWriteFileSuccess) {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
        console.log('file system open: ' + fs.name);
        fs.root.getFile(filename, { create: true, exclusive: false }, function (fileEntry) {
            console.log("fileEntry is file?" + fileEntry.isFile.toString());
            // fileEntry.name == 'someFile.txt'
            // fileEntry.fullPath == '/someFile.txt'
            writeFile(fileEntry, data, handleWriteFileSuccess);
        }, errorCallback);
    }, errorCallback);
}
export function doReadFile (filename, handleReadFileSuccess) {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
        console.log('file system open: ' + fs.name);
        fs.root.getFile(filename, { create: true, exclusive: false }, function (fileEntry) {
            console.log("fileEntry is file?" + fileEntry.isFile.toString());
            // fileEntry.name == 'someFile.txt'
            // fileEntry.fullPath == '/someFile.txt'
            readFile(fileEntry, handleReadFileSuccess);
        }, errorCallback);
    }, errorCallback);
}
// doWriteFile('hello.txt', JSON.stringify({ 'hello': 'world' }))
// doReadFile('hello.txt')