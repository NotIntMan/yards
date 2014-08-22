var Class=require('./classes.js');
var Course=require('./course.js');
var FileType=require('./filetype.js');
var Dir=require('../filetype/dir.js');

var Module=Class(function(path) {
    this.struct=[
        [/.*/,FileType]
    ];
    this.files={};
    this.dir=new Dir(path);
    this.dir.read();
    this.course=this.dir.course;
});

Module.prototype.read=function(callBack) {
    var self=this;
    this.course.run(function(cb) {
        if (self.dir.$fileExists) {
            var newStruct={};
            for (var i=0; i<self.struct.length; i++)
                for (var j=0; j<self.dir.data.length; j++)
                    if (!newStruct[self.dir.data[j]])
                        if (self.dir.data[j].replace(self.struct[i][0],'').length===0)
                            if ((self.struct[i][1]||false).constructor===Function)
                                newStruct[self.dir.data[j]]=new self.struct[i][1](self.dir.$filename+'/'+self.dir.data[j]);
                            else
                                newStruct[self.dir.data[j]]=self.struct[i][1];
            self.files=newStruct;
        };
        if ((callBack||false).constructor===Function)
            self.course.run(function(cb) {
                callBack(newStruct);
                cb();
            });
        cb();
    });
    return this;
};

module.exports=Module;