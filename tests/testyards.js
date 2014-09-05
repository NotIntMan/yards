var yards=require('../yards');

var Package=yards.FileType.Package;
var Class=yards.API.Class;
var Module=yards.API.Module;
var fs=require('fs');
var File=yards.API.File;

var PackageDir;
PackageDir=Class(function() {
    var self=this;
    this.struct=[
        [/.*/,function(path) {
            if (fs.lstatSync(path).isDirectory())
                return new PackageDir(path);
            else
                return new File(path);
        }]
    ];
},Module);

var NodePackage=Class(function(){
    this.module=PackageDir;
},Package);

var y=new NodePackage('yards.package');
y.fileExists(function(exists) {
    console.log('Exists:',exists);
    if (exists) {
        y.read({},function() {
            console.log('File readed');
            y.writeToDir('../yards2',function() {
                console.log('Dir writed');
                console.log(y.data);
            });
        });
    } else {
        y.readFromDir('../yards',function(data) {
            console.log('Dir readed');
            y.write({},function() {
                console.log('File writed');
                console.log(y.data);
            });
        });
    };
});