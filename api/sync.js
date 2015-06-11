var Promise=require('./promise-mixin.js');

function Sync(fn,args) {
    return new Promise(function(success,reject) {
        var gen;
        var result;
        var callBack;
        callBack=function() {
            var args=arguments[0];
            try {
                result=gen.next(args);
            } catch(e) {
                reject(e);
            }
            if (!result.done) {
                Promise.resolve(result.value).then(function(res) {
                    callBack(res);
                },function(err) {
                    reject(err);
                });
            } else
                success(result.value);
        };
        gen=fn.apply(this,args);
        callBack();
    });
};

Sync.fn=function(fn) {
    return function() {
        return Sync(fn,arguments);
    };
};

module.exports=Sync;
