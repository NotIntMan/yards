var Class=require('./classes.js');
var Sync=require('./sync.js');

var Course=Class(function() {
    this.course=[];
    this.status=this.STATUSES.READY;
});

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
/*If somethink will wrong this code work correctly, but requires harmony-generators
    if (this.isActive&&this.isReady&&this.course.length>0) {
        var self=this;
        Sync(function*(cb) {
            self.status=self.STATUSES.BUSY;
            while (self.course.length>0) {
                var f=self.course.splice(0,1)[0];
                yield f(cb);
            };
            if (self.isActive&&self.isBusy)
                self.status=self.STATUSES.READY;
        });
    };*/
    if (this.isActive) {
        if (this.course.length>0) {
            if (this.isReady)
                this.status=this.STATUSES.BUSY;
            else
                return;
            var f=this.course.splice(0,1)[0];
            var self=this;
            f(function() {
                if (self.isActive&&self.isBusy)
                    if (self.course.length>0) {
                        self.status=self.STATUSES.READY;
                        self.run();
                    } else
                        self.status=self.STATUSES.READY;
            });
        } else 
            self.status=self.STATUSES.READY;
    };
};

module.exports=Course;