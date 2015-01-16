var yards=require('../yards');
var CoffeeScript=yards.FileType.CoffeeScript;

var logTime=function(begin) {
    console.log(Date.now()-begin);
};

var begin=Date.now();
logTime(begin);

console.log('Sync exports:',require('./test.coffee'));

logTime(begin);

var f=new CoffeeScript('./test.coffee');
f.read('utf-8').then(function() {
    return f.eval(module);
}).then(function(res) {
    logTime(begin);
    console.log('Script result:',res);
    
    console.log('Module exports:',f.$module.exports);
    logTime(begin);
    console.log('Sync exports:',require('./test.coffee'));
    logTime(begin);
},function(err) {
    console.log(err.stack);
});