var log=console.log;

module.constructor.prototype._require=module.constructor.prototype.require;

module.constructor.prototype.require=function(name) {
    try {
        return this._require(name);
    } catch(e) {
        console.log(name);
        throw e;
    }
};

require('fs');
require('fs2');

module._compile("\n"+'console.log("2+2 =",2!+2)','azaza.js');