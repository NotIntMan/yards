function Sync(fn) {
    var gen;
    var callBack=function() {
        gen.next(Array.prototype.slice.call(arguments,0));
    };
    gen=fn(callBack);
    gen.next();
};

module.exports=Sync;