var yards={
    API:{
        get Class() {
            return require('./api/classes.js')
        },
        get Sync() {
            return require('./api/sync.js')
        },
        get File() {
            return require('./api/filetype.js')
        },
        get Course() {
            return require('./api/course.js')
        },
        get PromiseCourse() {
            return require('./api/promise-course.js')
        },
        get Module() {
            return require('./api/module.js')
        },
        get PromiseMixin() {
            return require('./api/promise-mixin.js')
        },
        get TaskManager() {
            return require('./api/task-manager.js')
        }
    },
    FileType:{
        get JavaScript() {
            return require('./filetype/javascript.js')
        },
        get JSON() {
            return require('./filetype/json.js')
        },
        get Dir() {
            return require('./filetype/dir.js')
        },
        get BinFile() {
            return require('./filetype/binfile.js')
        },
        get Package() {
            return require('./filetype/package.js')
        }
    }
};

module.exports=yards;