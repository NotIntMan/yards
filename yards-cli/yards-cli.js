var Builder=require('./node-webkit-builder');
var path=require('path');
var yards=require('yards');
var Promise=yards.API.PromiseMixin;
var template=require('./template.js');
var fs=require('fs');
var nodewebkit=require('nodewebkit');
var ChildProcess=require('child_process');


var _asIs=function(name,val,opts) {opts[name]=val};
var o=function(def,decode) {
    return {
        def:def,
        decode:decode||_asIs
    };
};

var platforms=function(name,val,opts) {
    if (val) {
        if (!opts.platforms)
            opts.platforms=[name];
        else
            opts.platforms.push(name);
    };
};

var _options={
    path:o('./',function(name,val,opts) {
        opts.files=path.resolve(val,'**','**');
    }),
    version:o('latest'),
    win:o(false,platforms),
    osx:o(false,platforms),
    linux32:o(false,platforms),
    linux64:o(false,platforms),
    appName:o(false),
    appVersion:o(false),
    buildDir:o('./build',function(name,val,opts) {
        opts.buildDir=path.resolve(val);
    }),
    cacheDir:o('./cache',function(name,val,opts) {
        opts.cacheDir=path.resolve(val);
    }),
    buildType:o('default'),
    forceDownload:o(false),
    credits:o(false,function(name,val,opts) {
        opts.macCredits=val;
    }),
    ico:o(false,function(name,val,opts) {
        opts.winIco=val;
    }),
    icns:o(false,function(name,val,opts) {
        opts.macIcns=val;
    }),
    zip:o(false,function(name,val,opts) {
        opts.macZip=val;
    }),
    plist:o(false,function(name,val,opts) {
        opts.macPlist=val;
    })
};

module.exports.build=function(options,callBack) {
    var opts={};
    for (var i in _options) {
        var val;
        if (!!options[i])
            val=options[i];
        else
            val=_options[i].def;
        _options[i].decode(i,val,opts);
    };
    var builder=new Builder(opts);
    if ((callBack||false).constructor===Function)
        return builder.build(callBack);
    else
        return builder.build();
};

var _projOptions={
    path:o('./',function(name,val,opts) {
        opts.path=path.resolve(val);
    }),
    template:o('')
};

module.exports.newProject=function(options) {
    var opts={};
    for (var i in _projOptions) {
        var val;
        if (!!options[i])
            val=options[i];
        else
            val=_projOptions[i].def;
        _projOptions[i].decode(i,val,opts);
    };
    var y=new template('');
    y.readFromDir(path.resolve(__dirname,'node_modules','yards'));
    var mkdir=Promise.denodeify(fs.mkdir);
    return mkdir(path.resolve(opts.path)).then(function() {
        return mkdir(path.resolve(opts.path,'node_modules'));
    }).then(null,function(){}).then(function() {
        return y.writeToDir(path.resolve(opts.path,'node_modules','yards'));
    }).then(function() {
        var arr=[
            opts.template,
            path.resolve(__dirname,'templates',opts.template+'.bin')
        ].map(function(p) {
            var t=new template(p);
            return t.promise();
        });
        return Promise.all(arr);
    }).then(function(arr) {
        for (var i=0; i<arr.length; i++)
            if (arr[i].$fileExists) {
                console.log('Using template',path.relative(path.resolve(arr[i].filename,'..'),arr[i].filename));
                arr[i].read();
                return arr[i].writeToDir(opts.path);
            };
    });
};

var _templateOptions={
    path:o('./',function(name,val,opts) {
        opts.path=path.resolve(val);
    }),
    outputFile:o('./template.bin',function(name,val,opts) {
        opts.outputFile=path.resolve(val);
    })
};

module.exports.newTemplate=function(options) {
    var opts={};
    for (var i in _templateOptions) {
        var val;
        if (!!options[i])
            val=options[i];
        else
            val=_templateOptions[i].def;
        _templateOptions[i].decode(i,val,opts);
    };
    var t=new template(opts.outputFile);
    return t.readFromDir(opts.path).then(function() {
        return t.write();
    });
};

module.exports.run=function(p) {
    var exebin=nodewebkit.findpath();
    var exec=Promise.denodeify(ChildProcess.exec);
    return exec(exebin+' "'+path.resolve(p)+'"');
};