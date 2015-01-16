var Class=require('./classes.js');
var Course=require('./promise-course.js');
var Promise=require('./promise-mixin.js');
var fs=require('fs');

var FileType=Class(function(filename) {
    this.course=new Course;
    this.$fileExists=false;
    this.$realPath=null;
    this.data=null;
    this.filename=(filename||'').toString();
});

FileType.prototype.__defineGetter__('filename',function() {
    return this.$filename;
});
FileType.prototype.__defineSetter__('filename',function(v) {
    this.$filename=v.toString();
    this.fileExists();
    this.realPath();
    return this.$filename;
});

FileType.prototype.promise=function() {
    var self=this;
    return this.course.next().then(function() {
        return self;
    });
};

FileType.prototype.fileExists=function() {
    var self=this;
    return this.course.run(function(cb) {
        fs.exists(self.$filename,function(res) {
            cb(self.$fileExists=res);
        });
    });
};

FileType.prototype.encode=function(data) {
    return new Promise(function(a) {
        a(data);
    });
};

FileType.prototype.decode=function(data) {
    return new Promise(function(a) {
        a(data);
    });
};

FileType.prototype.read=function(options) {
    var self=this;
    return this.course.run(function(cb,errCb) {
        fs.readFile(self.$filename,options,function(err,data) {
            if (err) return errCb(err);
            self.decode(data).then(function(res) {
                cb(self.data=res);
            },errCb);
        });
    });
};

FileType.prototype.write=function(options) {
    var self=this;
    return this.course.run(function(cb,errCb) {
        self.encode(self.data).then(function(data) {
            fs.writeFile(self.$filename,data,options,function(err) {
                if (err) return errCb(err);
                cb();
            });
        },errCb);
    });
};

FileType.prototype.realPath=function() {
    var self=this;
    return this.course.run(function(cb,errCb) {
        if (self.$fileExists)
            fs.realpath(self.$filename,function(err, resolvedPath) {
                if (err) return errCb(err);
                self.$realPath=resolvedPath;
                cb(resolvedPath);
            });
        else {
            cb(false);
        };
    });
};

FileType.prototype.rename=function(newPath) {
    var self=this;
    return this.course.run(function(cb,errCb) {
        if (self.$fileExists)
            fs.rename(self.$filename,newPath,function() {
                self.filename=newPath;
                fs.realpath(self.$filename,function(err, resolvedPath) {
                    if (err) return errCb(err);
                    cb(self.$filename=self.$realPath=resolvedPath);
                });
            });
        else {
            cb(false);
        };
    });
};

FileType.prototype.unlink=function() {
    var self=this;
    return this.course.run(function(cb) {
        fs.unlink(self.$filename,function() {
            fs.exists(self.$filename,function(res) {
                self.$fileExists=res;
                cb(!res);
            });
        });
    });
};

module.exports=FileType;