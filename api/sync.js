var Promise=require('./promise-mixin.js');

function Sync(fn,args) {
    return new Promise(function(success,reject) {
        var gen;
        var result;
        var callBack;
        callBack=function() {
            var args;
            if (result&&result.value&&((result.value.then||false).constructor===Function))
                args=arguments[0];
            else
                args=Array.prototype.slice.call(arguments,0);
            try {
                result=gen.next(args);
            } catch(e) {
                reject(e);
            }
            if (!result.done) {
                if (((result.value.then||false).constructor===Function)) {
                    result.value.then(function(res) {
                        callBack(res);
                    },function(err) {
                        reject(err);
                    });
                };
            } else
                success(result.value);
        };
        var f=fn.bind(null,callBack);
        gen=f.apply(null,args);
        callBack();
    });
};

Sync.fn=function(fn) {
    return function() {
        return Sync(fn,arguments);
    };
};

module.exports=Sync;