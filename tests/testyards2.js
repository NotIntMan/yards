var yards=require('../yards');
var Browserify=require('browserify');
var File=yards.API.File;

var b=Browserify({
    entries:['./testyards.js'],
    builtins:false,
    commondir:false,
    detectGlobals:false,
    igv:'__filename,__dirname'
});

b.bundle(function(err,buf) {
    if (err) {
        console.error(err);
        throw err;
    }
    var f=new File('testyards.min.js');
    f.data=buf;
    f.write({},function() {
        console.log('Bundle complete!');
        require('./testyards.min.js');
    });
});