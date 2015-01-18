var Promise=require('promise');

Promise.prototype.next=function() {
    return this.then.apply(this,Array.prototype.map.call(arguments,function(f) {return Promise.denodeify(f)}));
};

Promise.denodeifySpec=function(fn,callBack) {
    return function() {
        var args=Array.prototype.slice.call(arguments);
        return new Promise(function(resolve,reject) {
            args.push(function() {
                try {
                    resolve(callBack.apply(this,arguments));
                } catch(e) {
                    reject(e);
                };
            });
            fn.apply(this,args);
        });
    };
};

module.exports=Promise;