var Class=require('../api/classes.js');
var FileType=require('../api/filetype.js');
var path=require('path');

var JavaScript=Class(function(){},FileType);

JavaScript.prototype.eval=function(w,callBack) {
    var self=this;
    this.course.run(function(cb) {
        var filename=(self.$realPath!==null?self.$realPath:self.filename);
        var res;
        try {
            //eval('(function (__filename, __dirname) {'+self.data+"\n});").call(w,filename,path.resolve(filename,'..'));
            var m=new module.constructor(filename,module);
            m.load(filename);
            res=m.exports;
        } catch(e) {
            self.throw(e);
        };
        if ((callBack||false).constructor===Function)
            callBack(res);
        cb();
    });
    return this;
};

module.exports=JavaScript;