var yards=require('../yards');
var Class=yards.API.Class;

var Block=Class(function(xoptions){
    this.exp=/["]+([^"]*)["]+/;
    this.diviver='';
    this.datatype=String;
    this.structBlock=false;
    for (var i in xoptions)
        this[i]=xoptions[i];
});

Block.prototype.stringify=Block.prototype.parse=function(data) {
    return data;
};

var Parser=Class(function(xoptions){
    this.blocks=[];
    for (var i in xoptions)
        this[i]=xoptions[i];
});

Parser.prototype.parse=function(data,block) {
    console.log(data,block); 
    data=(data||'').toString();
    block=block||false;
    this.findBlock();
};

Parser.prototype.findBlock=function(data) {
    
};

Parser.prototype.stringify=function(data) {

};

var json=new Parser({
    blocks:[
        new Block({
            exp:/<([^<>]*)>/g
        }),
        new Block({
            exp:/\[([^\[\]]*)\]/g,
            diviver:',',
            datatype:Array,
            structBlock:true
        })
    ]
});

console.log(json.parse('[[<This is text>,<This is text2>],<This is text3>]'));