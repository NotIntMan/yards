var yards=require('../yards');

var Module=yards.API.Module;
var Class=yards.API.Class;
var File=yards.API.FileType;
var Promise=yards.Libs.Promise;
var fs=require('fs');

var PackageDir;
PackageDir=Class(function() {
    var self=this;
    this.struct=[
        ['node_modules',true],
        [/.*/,function(path) {
            if (fs.lstatSync(path).isDirectory())
                return new PackageDir(path);
            else
                return new File(path);
        }]
    ];
},Module);

var Package=Class(function(){
    this.module=Module;
},File);

Package.prototype.readMod=function(mod,obj,name,callBack) {
    var self=this;
    mod.read(function(data) {
        obj[name]={};
        var prs=[];
        for (var i in data)
            if (data[i] instanceof Module)
                prs.push(new Promise(function(okay) {
                    self.readMod(data[i],obj[name],i,okay);
                }));
            else
                if (data[i] instanceof File)
                    prs.push(new Promise(function(okay) {
                        var x=i;
                        data[x].read({},function(d) {
                            obj[name][x]=d;
                            okay();
                        });
                    }));
                else
                    obj[name][i]=data[i];
        Promise.all(prs).then(function() {
            if ((callBack||false).constructor===Function)
                callBack(obj[name]);
        });
    });
};

Package.prototype.readFromDir=function(path,callBack) {
    var self=this;
    var dir=new this.module(path);
    this.course.run(function(cb) {
        self.readMod(dir,self,'data',function(data) {
            if ((callBack||false).constructor===Function)
                callBack(data);
            cb();
        });
    });
};

Package.prototype.writeObj=function(path,obj,callBack) {
    var self=this;
    new Promise(function(next) {
        fs.exists(path,function(ex) {
            if (!ex)
                fs.mkdir(path,next);
            else
                fs.lstat(path,function(err,stat) {
                    if (err) throw err;
                    if (stat.isFile()||stat.isSymbolicLink())
                        fs.unlink(path,function() {
                            fs.mkdir(path,next);
                        });
                    else next();
                });
        });
    }).then(function() {
        var prs=[];
        for (var i in obj)
            if (obj[i].constructor===Object)
                prs.push(new Promise(function(next) {
                    self.writeObj(path+'/'+i,obj[i],next);
                }));
            else
                prs.push(new Promise(function(next) {
                    fs.writeFile(path+'/'+i,obj[i],function(err) {
                        if (err) throw err;
                        next();
                    });
                }));
        Promise.all(prs).then(function() {
            if ((callBack||false).constructor===Function)
                callBack();
        });
    });
};

Package.prototype.writeToDir=function(path,callBack) {
    var self=this;
    this.course.run(function(cb) {
        self.writeObj(path,self.data,function() {
            if ((callBack||false).constructor===Function)
                callBack();
            cb();
        });
    });
};

var NodePackage=Class(function(){
    this.module=PackageDir;
},Package);

var y=new NodePackage('yards.package');
y.readFromDir('../yards',console.log);
y.writeToDir('../yards2',function() {
    console.log('Write complete!');
})