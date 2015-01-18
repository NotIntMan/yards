var yards=require('..');
var Promise=yards.API.PromiseMixin;
var fs=require('fs');

var exists=Promise.denodeifySpec(fs.exists,function(res) {
    return res;
});

var log=console.log.bind(console);

exists('sync.js').then(
    log.bind(null,'RESULT:'),
    function(e) {
        log('ERROR:',e.stack||e);
    }
);