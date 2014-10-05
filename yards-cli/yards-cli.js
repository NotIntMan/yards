var Builder=require('./node-webkit-builder');
var path=require('path');

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
    console.log(options);
    console.log(opts);
    var builder=new Builder(opts);
    if ((callBack||false).constructor===Function)
        return builder.build(callBack);
    else
        return builder.build();
};