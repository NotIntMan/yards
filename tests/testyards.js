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
y.promise().then(function() {
    var exists=y.$fileExists;
    console.log('Exists:',exists);
    if (exists) {
        y.read().then(function() {
            console.log('File readed');
            y.writeToDir('../yards2').then(function() {
                console.log('Dir writed');
            });
        });
    } else {
        y.readFromDir('../yards').then(function(data) {
            console.log('Dir readed');
            y.write().then(function() {
                console.log('File writed');
            });
        });
    };
});