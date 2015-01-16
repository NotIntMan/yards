var Class=require('./classes.js');
var Course=require('./course.js');
var PromiseMixin=require('./promise-mixin.js');

var PromiseCourse=Class(function(){},Course);

PromiseCourse.prototype.run=function(fn) {
    var self=this;
    fn=fn||false;
    switch(fn.constructor) {
        case Function:
            return new PromiseMixin(function(okF,errF) {
                Course.prototype.run.call(self,function(okFn,errFn) {
                    fn(function(val) {
                        okF(val);
                        okFn();
                    },function(val) {
                        if (self.currentRunCount>=self.maxRunCount-1)
                            errF(val);
                        errFn();
                    });
                });
            });
        break;
        case Array:
            return PromiseMixin.all(fn.map(function(f) {return self.run(f)}));
        break;
        default:
            Course.prototype.run.call(this);
    };
};

PromiseCourse.prototype.next=function() {
    return this.run(function(ok) {
        ok();
    });
};

module.exports=PromiseCourse;