var Class=require('../api/classes.js');
var FileType=require('../api/filetype.js');
var path=require('path');

var JavaScript=Class(function(){},FileType);

JavaScript.prototype.eval=function(parent) {
    var self=this;
    return this.course.run(function(cb,errCb) {
        var filename=(self.$realPath!==null?self.$realPath:self.filename);
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
        cb(m);
    }).next(function(m,cb) {
        try {
            m._compile(self.data,m.filename);
        } catch(e) {
            cb(e);
        };
        cb(null,m.exports);
    });
};

module.exports=JavaScript;