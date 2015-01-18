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
                if (result.value&&((result.value.then||false).constructor===Function)) {
                    result.value.then(function(res) {
                        callBack(res);
                    },function(err) {
                        reject(err);
                    });
                } else reject(new Error("YIELD called with not THENable object.\nUse Promise.resolve() for functions with unknown result."));
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