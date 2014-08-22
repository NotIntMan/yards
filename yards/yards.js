var yards={
    API:{
        Class:require('./api/classes.js'),
        Sync:require('./api/sync.js'),
        FileType:require('./api/filetype.js'),
        Course:require('./api/course.js'),
        Module:require('./api/module.js')
    },
    FileType:{
        JavaScript:require('./filetype/javascript.js'),
        JSON:require('./filetype/json.js'),
        Dir:require('./filetype/dir.js'),
        CoffeeScript:require('./filetype/coffeescript.js')
    },
    Libs:{
        CoffeeScript:require('coffee-script'),
        JS2Coffee:require('js2coffee'),
        Promise:require('promise')
    }
};

module.exports=yards;