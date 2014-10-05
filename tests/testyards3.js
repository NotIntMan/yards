var yards=require('../yards');

var File=yards.API.File;
var Sync=yards.API.Sync;
var JS=yards.FileType.JavaScript;

var g=Sync.fn(function*(cb,filename) {
    var f=new JS(filename);
    yield f.read('utf-8',cb);
    var res=yield f.eval(module,cb);
    console.log(res[0]);
});

g('1/testyards1.js');