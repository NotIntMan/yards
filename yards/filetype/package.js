var Module=require('../api/module.js');
var Class=require('../api/classes.js');
var File=require('../api/filetype.js');
var BinFile=require('../filetype/binfile.js');
var Promise=require('../api/promise-mixin.js');
var fs=require('fs');

var Package=Class(function(){
    this.module=Module;
},BinFile);

Package.prototype.readMod=function(mod,obj,name,callBack,badCallBack) {
    var self=this;
    mod.read().then(function(data) {
        obj[name]={};
        var prs=[];
        for (var i in data)
            if (data[i] instanceof Module)
                prs.push(new Promise(function(okay) {
                    self.readMod(data[i],obj[name],i,okay,badCallBack);
                }));
            else
                if (data[i] instanceof File)
                    prs.push(new Promise(function(okay) {
                        var x=i;
                        data[x].read().then(function(d) {
                            obj[name][x]=d;
                            okay();
                        },badCallBack);
                    }));
        Promise.all(prs).then(function() {
            if ((callBack||false).constructor===Function)
                callBack(obj[name]);
        });
    },badCallBack);
};

Package.prototype.readFromDir=function(path) {
    var self=this;
    var dir=new this.module(path);
    return this.course.run(function(cb,errCb) {
        self.readMod(dir,self,'data',function(data) {
            cb(data);
        },function(err) {
            errCb(err);
        });
    });
};

Package.prototype.writeObj=function(path,obj,callBack,badCallBack) {
    var self=this;
    new Promise(function(next) {
        fs.exists(path,function(ex) {
            if (!ex)
                fs.mkdir(path,next);
            else
                fs.lstat(path,function(err,stat) {
                    if (err) badCallBack(err);
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
                    self.writeObj(path+'/'+i,obj[i],next,badCallBack);
                }));
            else
                prs.push(new Promise(function(next) {
                    fs.writeFile(path+'/'+i,obj[i],function(err) {
                        if (err) badCallBack(err);
                        next();
                    });
                }));
        Promise.all(prs).then(function() {
            if ((callBack||false).constructor===Function)
                callBack();
        });
    });
};

Package.prototype.writeToDir=function(path) {
    var self=this;
    return this.course.run(function(cb,erCb) {
        self.writeObj(path,self.data,function() {
            cb();
        },function(err) {
            errCb(err);
        });
    });
};

module.exports=Package;