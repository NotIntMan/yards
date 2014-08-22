function Class(constructor,parent) {
    constructor=constructor||function(){};
    parent=parent||false;
    if (parent) {
        var res=function(){
            parent.apply(this,arguments);
            constructor.apply(this,arguments);
        };
        var tmp=function(){};
        tmp.prototype=parent.prototype;
        res.prototype=new tmp;
        res.prototype.constructor=res;
        return res;
    } else 
        return constructor;
};

module.exports=Class;