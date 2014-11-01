var Class=require('./classes.js');

var Course=Class(function() {
    this.course=[];
    this.status=this.STATUSES.READY;
    this.currentRunCount=0;
});

Course.prototype.maxRunCount=3;

Course.prototype.STATUSES={
    UNACTIVE:0,
    READY:1,
    BUSY:2
};

Course.prototype.__defineGetter__('isActive',function() {
    return this.status>this.STATUSES.UNACTIVE;
});

Course.prototype.__defineGetter__('isReady',function() {
    return this.status===this.STATUSES.READY;
});

Course.prototype.__defineGetter__('isBusy',function() {
    return this.status===this.STATUSES.BUSY;
});

Course.prototype.run=function(fn) {
    fn=fn||false;
    switch(fn.constructor) {
        case Function:
            this.course.push(fn);
        break;
        case Array:
            for (var i=0; i<fn.length; i++)
                this.run(fn[i]);
        break;
    };
    if (this.isActive) {
        if (this.course.length>0) {
            if (this.isReady)
                this.status=this.STATUSES.BUSY;
            else
                return;
            var f=this.course[0];
            var self=this;
            var nextFn=function() {
                if (self.isActive&&self.isBusy)
                    if (self.course.length>0) {
                        self.status=self.STATUSES.READY;
                        self.run();
                    } else
                        self.status=self.STATUSES.READY;
            };
            var okFn=function() {
                self.currentRunCount=0;
                self.course.splice(0,1);
                nextFn();
            };
            var errFn=function() {
                if (self.currentRunCount>=self.maxRunCount-1)
                    okFn();
                else
                    setTimeout(nextFn,(self.currentRunCount+=1)*1000);
            };
            f(okFn,errFn);
        } else 
            self.status=self.STATUSES.READY;
    };
};

module.exports=Course;