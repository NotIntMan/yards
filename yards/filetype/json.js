var Class=require('../api/classes.js');
var FileType=require('../api/filetype.js');

var _JSON=Class(function(){},FileType);

_JSON.prototype.encode=function(data) {
    return JSON.stringify(data);
};

_JSON.prototype.decode=function(data) {
    return JSON.parse(data);
};

module.exports=_JSON;