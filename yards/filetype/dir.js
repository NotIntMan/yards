var Class=require('../api/classes.js');
var Course=require('../api/course.js');
var FileType=require('../api/filetype.js');
var fs=require('fs');

var Dir=Class(function(){},FileType);

Dir.prototype.read=function(callBack) {
    var self=this;
    return this.course.run(function(cb,errCb) {
        if (self.$fileExists)
            fs.readdir(self.$filename,function(err,data) {
                if (err) errCb(err);
                self.decode(data).then(function(res) {
                    cb(self.data=res);
                })
            });
    });
};

Dir.prototype.write=undefined;

module.exports=Dir;