var yards=require('../yards');
var CoffeeScript=yards.FileType.CoffeeScript;
var File=yards.API.File;
var Sync=yards.API.Sync;

var read=function(filename) {
    var f=new File(filename);
    return f.read('utf-8');
};

var write=function(filename,data) {
    var f=new File(filename);
    f.data=data;
    return f.write('utf-8');
};

Sync(function*() {
    var data=yield read('testyards.js');
    console.log('Read');
    var result=yield CoffeeScript.prototype.encode(data);
    console.log('Encode');
    yield write('testyards4.coffee',result);
    return result;
}).then(console.log,console.log);