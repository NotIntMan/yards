var Class=require('../api/classes.js');
var FileType=require('../api/filetype.js');
var Promise=require('../api/promise-mixin.js');

var _JSON=Class(function(){},FileType);

_JSON.prototype.encode=function(data) {
    return new Promise(function(a) {
        a(JSON.stringify(data));
    });
};

_JSON.prototype.decode=function(data) {
    return new Promise(function(a) {
        a(JSON.parse(data));
    });
};

module.exports=_JSON;