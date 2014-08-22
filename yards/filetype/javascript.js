var Class=require('../api/classes.js');
var FileType=require('../api/filetype.js');

var JavaScript=Class(function(){},FileType);

JavaScript.prototype.checkCode=function() {
    try {
        eval('var x=function(){'+this.data+'}');
    } catch(e) {
        return false;
    };
    return true;
};

JavaScript.prototype.eval=function(w,callBack) {
    var self=this;
    this.course.run(function(cb) {
        var res;
        if (res=self.checkCode()) {
            eval('var x=function(){'+self.data+'}');
            x.call(w);
        };
        if ((callBack||false).constructor===Function)
            callBack(res);
        cb();
    });
    return this;
};

module.exports=JavaScript;