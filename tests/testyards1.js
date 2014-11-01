var yards=require('../yards');
var File=yards.API.File;
var Sync=yards.API.Sync;
var PromiseMixin=yards.API.PromiseMixin;

var scanner=Sync.fn(function*(cb,prefix,postfix) {
    var arr=[];
    for (var i=1; i<=4; i++)
        arr.push(i);
    arr=arr.map(function(i) {
        var f=new File(prefix+i+postfix);
        f.data='';
        f.read('utf-8');
        return f.promise();
    });
    arr=yield PromiseMixin.all(arr);
    arr.forEach(function(f) {
        console.log('Filename:',f.filename);
        console.log('FileExists:',f.$fileExists);
        console.log('RealPath:',f.$realPath);
        console.log('DataLength:',f.data.length);
        console.log('---------------------------');
    });
    return 'Done.';
});

Sync(function*() {
    console.log(yield scanner('testyards','.js'));
});