var Class=require('../api/classes.js');
var Course=require('../api/course.js');
var FileType=require('../api/filetype.js');
var fs=require('fs');

var Dir=Class(function(){},FileType);

Dir.prototype.read=function(callBack) {
    var self=this;
    this.course.run(function(cb) {
        if (self.$fileExists)
            fs.readdir(self.$filename,function(err,data) {
                if (err) self.throw(err);
                self.data=self.decode(data);
                if ((callBack||false).constructor===Function)
                    callBack(self.data);
                cb();
            });
    });
};

Dir.prototype.write=undefined;

module.exports=Dir;