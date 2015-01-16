var Class=require('../api/classes.js');
var JavaScript=require('./javascript.js');
var Coffee2JS=require('coffee-script');
var JS2Coffee=require('js2coffee');
var Promise=require('../api/promise-mixin.js');
var fs=require('fs');

var CoffeeScript=Class(function(){},JavaScript);

CoffeeScript.prototype.encode=function(data) {
    return new Promise(function(a) {
        try {
            a(JS2Coffee.build(data));
        } catch(e) {
            b(e);
        }
    });
};

CoffeeScript.prototype.decode=function(data) {
    return new Promise(function(a,b) {
        try {
            a(Coffee2JS.compile(data));
        } catch(e) {
            b(e);
        }
    });
};

module.constructor._extensions['.coffee']=function (module, filename) {
    var content=fs.readFileSync(filename, 'utf8');
    module._compile(Coffee2JS.compile(content), filename);
};

module.exports=CoffeeScript;