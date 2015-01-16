var Promise=require('promise');

Promise.prototype.next=function() {
    return this.then.apply(this,Array.prototype.map.call(arguments,function(f) {return Promise.denodeify(f)}));
};

module.exports=Promise;