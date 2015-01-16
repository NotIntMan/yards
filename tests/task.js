var yards=require('../yards');
var TaskManager=yards.API.TaskManager;
var fs=require('fs');

var t=new TaskManager(function(name) {
    this.length=0;
    this.name=name||'Unnamed';
});

var begin=Date.now();
for (var i=0; i<1; i++)
    t.runTask(function(ok,err,data) {
        try {
            fs.readFile('big.zip',{},function(error,res) {
                if (error) return err(error);
                data.length=res.length;
                ok(res);
            });
        } catch(e) {
            err(e);
        };
    },i);

t.then(function(data) {
    data.forEach(function(d) {
        console.log(d);
        console.log('-----------------');
    });
    console.log('Time:',Date.now()-begin);
});