var yards=require('../yards');

var File=yards.API.File;
var Class=yards.API.Class;
var fs=require('fs');

var Strong=Class(function() {
    this.struct=[];
    this.$length=0;
},File);

var basicTypes=[
    'UInt8','UInt16LE','UInt16BE','UInt32LE','UInt32BE',
    'Int8','Int16LE','Int16BE','Int32LE','Int32BE',
    'FloatLE','FloatBE','DoubleLE','DoubleBE'
];

Strong.TYPES={
    basic:function(type) {
        if (basicTypes.indexOf(type)>-1)
            return {
                size:1,
                type:type
            };
        else
            return null;
    },
    string:function(l) {
        return {
            size:l,
            type:'UInt8',
            encode:function(data) {
                var data=data.toString();
                return new Buffer(data);
            },
            decode:function(buf) {
                return a.toString();
            }
        };
    }
};

Strong.prototype.__defineGetter__('blockLength',function() {
    var l=0;
    for (var i=0; i<this.struct.length; i++)
        if (!!this.struct[i].size)
            l+=this.struct[i].size;
    return l;
});

Strong.prototype.decode=function(data) {
    var res=[];
    var pos=0;
    for (var i=0; i<this.struct.length; i++) {
        var len=this.struct[i].size;
        var buf=new Buffer(len);
        data.copy(buf,0,pos,len);
        pos+=len;
        if (!!this.struct[i].decode) {
            res.push(this.struct[i].decode(buf));
        } else {
            
        };
    }    
};

Strong.prototype.read=function(position,callBack) {
    var position=parseInt(position);
    var self=this;
    this.course.run(function(cb) {
        if (self.$fileExists) {
            fs.open(self.$filename,'r',function(err, fd) {
                if (err) throw err;
                var size=self.blockLength;
                fs.read(fd,new Buffer(size),0,size,size*position,function(err, bytesRead, buffer) {
                    if (err) throw err;
                    fs.close(fd,function() {
                        self.data=self.decode(data);
                        if ((callBack||false).constructor===Function)
                            callBack(self.data);
                        cb();
                    });
                });
            });
        } else {
            if ((callBack||false).constructor===Function)
                callBack();
            cb();
        };
    });
    return this;
};

Strong.prototype.write=function(data,callBack) {
    var data=Array.apply(null,data);
    var self=this;
    this.course.run(function(cb) {
        fs.open(self.$filename,'w',function(err, fd) {
            if (err) throw err;
            fs.write(fd,self.encode(self.data),0,self.blockLength,null,function(err, written, buffer){
                if (err) throw err;
                fs.close(fd,function() {
                    if ((callBack||false).constructor===Function)
                        callBack();
                    cb();
                });
            });
        });
    });
    return this;
};

Strong.prototype.length=function(callBack) {
    var self=this;
    this.course.run(function(cb) {
        if (self.$fileExists) {
            fs.stat(self.$filename,function(err, stats){
                if (err) throw err;
                self.$length=Math.floor(stats.size/self.blockLength);
                if ((callBack||false).constructor===Function)
                    callBack(self.$length);
                cb();
            });
        } else {
            if ((callBack||false).constructor===Function)
                callBack(0);
            cb();
        }
    });
};

module.exports=Strong;

var MyStrong=Class(function(){
    this.struct=[
        Strong.TYPES.basic('Int32BE'),
        Strong.TYPES.string(256)
    ];
},Strong);

var f=new MyStrong('db.strong');
f.length(function(l) {
    if (l>0)
        for (var i=0; i<l; i++)
            f.read(i,console.log);
    f.write([Math.floor(Math.random()*256),'THIS IS STRING!!!']);
});