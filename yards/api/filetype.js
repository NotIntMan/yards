var Class=require('./classes.js');
var Course=require('./course.js');
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

FileType.prototype.fileExists=function(callBack) {
    var self=this;
    this.course.run(function(cb) {
        fs.exists(self.$filename,function(res) {
            self.$fileExists=res;
            if ((callBack||false).constructor===Function)
                callBack(res);
            cb();
        });
    });
    return this;
};

FileType.prototype.encode=function(data) {
    return data;
};

FileType.prototype.decode=function(data) {
    return data;
};

FileType.prototype.read=function(options,callBack) {
    var self=this;
    this.course.run(function(cb) {
        if (self.$fileExists) {
            fs.readFile(self.$filename,options,function(err,data) {
                if (err) self.throw(err);
                self.data=self.decode(data);
                if ((callBack||false).constructor===Function)
                    callBack(self.data);
                cb();
            });
        } else {
            if ((callBack||false).constructor===Function)
                callBack();
            cb();
        };
    });
    return this;
};

FileType.prototype.write=function(options,callBack) {
    var self=this;
    this.course.run(function(cb) {
        fs.writeFile(self.$filename,self.encode(self.data),options,function(err) {
            if (err) self.throw(err);
            if ((callBack||false).constructor===Function)
                callBack();
            cb();
        });
    });
    return this;
};

FileType.prototype.realPath=function(callBack) {
    var self=this;
    this.course.run(function(cb) {
        if (self.$fileExists)
            fs.realpath(self.$filename,function(err, resolvedPath) {
                if (err) self.throw(err);
                self.$realPath=resolvedPath;
                if ((callBack||false).constructor===Function)
                    callBack(resolvedPath);
                cb();
            });
        else {
            if ((callBack||false).constructor===Function)
                callBack(false);
            cb();
        };
    });
    return this;
};

FileType.prototype.rename=function(newPath,callBack) {
    var self=this;
    this.course.run(function(cb) {
        if (self.$fileExists)
            fs.rename(self.$filename,newPath,function() {
                self.filename=newPath;
                self.course.run(function(xb) {
                    self.$filename=self.$realPath;
                    if ((callBack||false).constructor===Function)
                        callBack(self.$fileExists);
                    xb();
                });
                cb();
            });
        else {
            if ((callBack||false).constructor===Function)
                callBack(false);
            cb();
        };
    });
    return this;
};

FileType.prototype.unlink=function(callBack) {
    var self=this;
    this.course.run(function(cb) {
        if (self.$fileExists)
            fs.unlink(self.$filename,function() {
                fs.exists(self.$filename,function(res) {
                    self.$fileExists=res;
                    if ((callBack||false).constructor===Function)
                        callBack(!res);
                    cb();
                });
            });
        else {
            if ((callBack||false).constructor===Function)
                callBack(true);
            cb();
        };
    });
    return this;
};

FileType.prototype.throw=function(e) {
    if (e!=null) {
        e.message='('+(this.$realPath!==null?this.$realPath:this.filename)+'): '+e.message;
        throw e;
    };
};

FileType.prototype.catch=function(fn) {
    this.throw=fn;
};

module.exports=FileType;