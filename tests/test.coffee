yards=require '../yards'
BinFile=yards.FileType.BinFile

module.exports=new Promise (a)=>
    new BinFile('file.bin')
        .read()
        .then (r)=>
            a(module.exports=r)