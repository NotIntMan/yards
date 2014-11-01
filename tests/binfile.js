var yards=require('../yards');

var Binary=yards.FileType.BinFile;

var b=new Binary('file.bin');
b.read().then(console.log);
b.course.run(function(cb) {
    b.data={
        object:{
            array:[
                'String',
                null,
                undefined,
                NaN
            ],
            numbers:[
                12,
                -12,
                12.5,
                -12.5
            ]
        }
    };
    cb();
});
b.write();