var yards=require('..');
var Sync=yards.API.Sync;
var Promise=yards.API.PromiseMixin;

var longFunc=function(x) {
    return new Promise(function(ok) {
        setTimeout(ok.bind(null,x),2500);
    });
};

var log=function() {
    console.log.apply(console,arguments);
}

Sync(function*() {
    console.log(1);
    var res=yield longFunc(2);
    console.log(res);
    return true;
}).then(
    log.bind(null,'RESULT:'),
    function(e) {
        log('ERROR:',e.stack||e);
    }
)