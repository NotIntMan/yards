function Class(constructor,parent,noNeedParentConstructor) {
    constructor=constructor||function(){};
    parent=parent||false;
    noNeedParentConstructor=noNeedParentConstructor||false;
    if (parent) {
        var res=function(){
            parent.apply(this,arguments);
            constructor.apply(this,arguments);
        };
        if (noNeedParentConstructor)
            res=constructor;
        var tmp=function(){};
        tmp.prototype=parent.prototype;
        res.prototype=new tmp;
        res.prototype.constructor=res;
        return res;
    } else 
        return constructor;
};

module.exports=Class;