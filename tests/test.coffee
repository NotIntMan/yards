yards = require '../yards'
TextFile = yards.API.FileType
new TextFile 'test.cs'
    .read 'utf-8',(data)->
        console.log data
