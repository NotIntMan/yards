var yards=require('../yards');
var CoffeeScript=yards.FileType.CoffeeScript;

var f=new CoffeeScript('./test.coffee');
f.read('utf-8').then(function() {
    return f.eval(module);
}).then(function(res) {
    console.log('Script result:',res);
},function(err) {
    console.log(err.stack);
});
//require('./test.coffee');