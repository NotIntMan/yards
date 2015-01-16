var Class=require('./classes.js');
var Promise=require('./promise-mixin.js');

var TaskManager=Class(function(fn) {
    if (!!fn)
        this.taskConstructor=fn;
    this.tasks=[];
    this.promises=[];
});

TaskManager.prototype.taskConstructor=function(){};

TaskManager.prototype.runTask=function(fn) {
    var task={
        state:{
            done:false,
            error:null,
            result:null
        },
        data:{}
    };
    this.taskConstructor.apply(task.data,Array.prototype.slice.call(arguments,1));
    var promise=new Promise(function(ok) {
        fn(function(data) {
            task.state.done=true;
            task.state.result=data;
            task.state.error=null;
            ok(task);
        },function(error) {
            task.state.done=true;
            task.state.result=null;
            task.state.error=error;
            ok(task);
        },task.data);
    });
    this.tasks.push(task);
    this.promises.push(promise);
    return promise;
};

TaskManager.prototype.then=function() {
    var p=Promise.all(this.promises);
    p.then.apply(p,Array.prototype.slice.call(arguments));
};

module.exports=TaskManager;