var Class=require('../api/classes.js');
var JavaScript=require('./javascript.js');
var Coffee2JS=require('coffee-script');
var JS2Coffee=require('js2coffee');

var CoffeeScript=Class(function(){},JavaScript);

CoffeeScript.prototype.encode=function(data) {
    return JS2Coffee.build(data);
};

CoffeeScript.prototype.decode=function(data) {
    return Coffee2JS.compile(data);
};

module.exports=CoffeeScript;