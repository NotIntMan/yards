var yards={
    API:{
        Class:require('./api/classes.js'),
        Sync:require('./api/sync.js'),
        File:require('./api/filetype.js'),
        Course:require('./api/course.js'),
        PromiseCourse:require('./api/promise-course.js'),
        Module:require('./api/module.js'),
        PromiseMixin:require('./api/promise-mixin.js')
    },
    FileType:{
        JavaScript:require('./filetype/javascript.js'),
        JSON:require('./filetype/json.js'),
        Dir:require('./filetype/dir.js'),
        CoffeeScript:require('./filetype/coffeescript.js'),
        BinFile:require('./filetype/binfile.js'),
        Package:require('./filetype/package.js')
    },
    Libs:{
        CoffeeScript:require('coffee-script'),
        JS2Coffee:require('js2coffee')
    }
};

module.exports=yards;