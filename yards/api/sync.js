function Sync(fn,args) {
    var gen;
    var callBack=function() {
        gen.next(Array.prototype.slice.call(arguments,0));
    };
    var f=fn.bind(null,callBack);
    gen=f.apply(null,args);
    gen.next();
};

Sync.fn=function(fn) {
    return function() {
        Sync(fn,arguments);
    };
};

module.exports=Sync;