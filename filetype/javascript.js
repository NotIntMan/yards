var Class=require('../api/classes.js');
var FileType=require('../api/filetype.js');
var path=require('path');
var Promise=require('../api/promise-mixin.js');

var JavaScript=Class(function(){
    this.$module=null;
},FileType);

JavaScript.prototype.read=function() {
    var filename=(this.$realPath!==null?this.$realPath:this.filename);
    if (!!module.constructor._cache[filename])
        return Promise.resolve('');
    else
        return FileType.prototype.read.apply(this,arguments);
};

JavaScript.prototype.eval=function(parent) {
    var self=this;
    return this.course.run(function(cb,errCb) {
        var filename=(self.$realPath!==null?self.$realPath:self.filename);
        if (!!module.constructor._cache[filename]) {
            self.$module=module.constructor._cache[filename];
            return cb(module.constructor._cache[filename].exports);
        };
        var res;
        var m=new module.constructor(filename,parent);
        m.filename=filename;
        try {
            //eval('(function (__filename, __dirname) {'+self.data+"\n});").call(w,filename,path.resolve(filename,'..'));
            var paths=[path.resolve(filename,'..')];
            var doIt=true;
            while(doIt) {
                var lastPath=paths.slice(-1)[0];
                var _path=path.resolve(lastPath,'..');
                if (lastPath!==_path)
                    paths.push(_path);
                else
                    doIt=false;
            };
            m.paths=paths.map(function(p) {
                return path.resolve(p,'node_modules');
            });
        } catch(e) {
            errCb(e);
        };
        try {
            m._compile(self.data,m.filename);
        } catch(e) {
            errCb(e);
        };
        module.constructor._cache[m.filename]=self.$module=m;
        cb(m.exports);
    });
};

module.exports=JavaScript;