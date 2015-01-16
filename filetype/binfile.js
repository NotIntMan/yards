var Class=require('../api/classes.js');
var File=require('../api/filetype.js');
var Promise=require('../api/promise-mixin.js');

var Binary=Class(function() {
    this.$types=[];
},File);

Binary.prototype.regType=function(Class,encoder,decoder) {
    if (arguments.length<1)
        return this;
    encoder=encoder||function(a){return a;};
    decoder=decoder||encoder;
    this.$types.push({
        class:Class,
        encoder:encoder,
        decoder:decoder
    });
    return this;
};

var numToData=function(num) {
    num=Math.abs(num);
    var res=[];
    while (num>0) {
        var x=num%256;
        res.push(x);
        num=(num-x)/256;
    };
    return res.reverse();
};

var dataToNum=function(data) {
    var res=0;
    data=data.reverse();
    for (var i=0; i<data.length; i++) {
        res+=data[i]*Math.pow(256,i);
    };
    return res;
};

Binary.prototype._encode=function(data) {
    var info={
        isSimple:true,
        typeCode:0
    };
    var map=[];
    if (!Buffer.isBuffer(data)) {
        if (typeof(data)==="object") {
            if (data===null) {
                info.typeCode=8;
                data=new Buffer(0);
            } else {
                if (data.constructor===Array) {
                    info.typeCode=11;
                    var l=numToData(data.length);
                    map.push(l.length);
                    map=map.concat(l);
                    var dataArr=[];
                    for (var i=0; i<data.length; i++) {
                        var e=this._encode(data[i]);
                        var l=numToData(e.length);
                        map.push(l.length);
                        map=map.concat(l);
                        dataArr.push(e);
                    };
                    data=Buffer.concat(dataArr);
                } else {
                    info.typeCode=12;
                    check:
                    for (var i=0; i<this.$types.length; i++)
                        if (data instanceof this.$types[i].class||data.constructor===this.$types[i].class) {
                            data=this._encode(this.$types[i].encoder(data));
                            info.isSimple=false;
                            info.typeCode=i;
                            break check;
                        };
                    if (info.isSimple) {
                        var mapArr=[];
                        var dataArr=[];
                        var count=0;
                        for (var i in data) {
                            count++;
                            var name=this._encode(i);
                            var l=numToData(name.length);
                            mapArr.push(l.length);
                            mapArr=mapArr.concat(l);
                            dataArr.push(name);
                            var obj=this._encode(data[i]);
                            var l=numToData(obj.length);
                            mapArr.push(l.length);
                            mapArr=mapArr.concat(l);
                            dataArr.push(obj);
                        };
                        var l=numToData(count);
                        map.push(l.length);
                        map=map.concat(l);
                        map=map.concat(mapArr);
                        data=Buffer.concat(dataArr);
                    };
                };
            };
        } else {
            switch(typeof(data)) {
                case 'number':
                    info.typeCode=1;
                    if (isNaN(data)) {
                        info.typeCode=5;
                        data=new Buffer(0);
                        break;
                    };
                    if (data<0) {
                        info.typeCode+=1;
                        data=Math.abs(data);
                    };
                    var b=data%1;
                    var a=data-b;
                    var c=(data.toString().split('.')[1]||'').length;
                    var d=Math.pow(10,c);
                    b=Math.round(b*d)/d;
                    var dataArr=numToData(a);
                    map.push(dataArr.length);
                    if (b>0) {
                        while(b%1)b*=10;
                        info.typeCode+=2;
                        var tmp=numToData(b);
                        dataArr=dataArr.concat(tmp);
                        map.push(tmp.length);
                    };
                    data=new Buffer(dataArr);
                break;
                case 'boolean':
                    if (data)
                        info.typeCode=6;
                    else
                        info.typeCode=7;
                    data=new Buffer(0);
                break;
                case 'undefined':
                    info.typeCode=9;
                    data=new Buffer(0);
                break;
                case 'string':
                    info.typeCode=10;
                    var l=numToData(data.length);
                    map.push(l.length);
                    map=map.concat(l);
                    data=new Buffer(data);
                break;
            };
        };
    } else {
        var l=numToData(data.length);
        map.push(l.length);
        map=map.concat(l);
    };
    var code=info.typeCode;
    if (info.isSimple) code+=128;
    code=numToData(code);
    if (code.length===0)
        code=[0];
    return Buffer.concat([new Buffer(code.concat(map)),data]);
};

Binary.prototype.encode=function(data) {
    var self=this;
    return new Promise(function(a) {
        a(self._encode(data));
    });
};

var readData=function(buf,pos,len) {
    var out=[];
    for (var i=0; i<len; i++)
        out.push(buf[pos+i]);
    return out;
};

Binary.prototype._decode=function(data,pos) {
    if (!Buffer.isBuffer(data))
        return data;
    pos=pos||0;
    if (data[pos]<128) {
        return this.$types[data[pos]].decoder(this._decode(data,pos+1));
    } else {
        var typeCode=data[pos]-128;
        switch(typeCode) {
            case 0:
                var ll=data[pos+1];
                var l=dataToNum(readData(data,pos+2,ll));
                return new Buffer(readData(data,pos+2+ll,l));
            break;
            case 1:
            case 2:
            case 3:
            case 4:
                var l=data[pos+1];
                var res;
                if (typeCode>2) {
                    res=dataToNum(readData(data,pos+3,l));
                    var l0=data[pos+2];
                    var tmp=dataToNum(readData(data,pos+3+l,l0));
                    while(tmp>1)tmp/=10;
                    res+=tmp;
                } else
                    res=dataToNum(readData(data,pos+2,l));
                if (!(typeCode%2))
                    res*=-1;
                return res;
            break;
            case 5:
                return NaN;
            break;
            case 6:
                return true;
            break;
            case 7:
                return false;
            break;
            case 8:
                return null;
            break;
            case 9:
                return undefined;
            break;
            case 10:
                var ll=data[pos+1];
                var l=dataToNum(readData(data,pos+2,ll));
                var buf=new Buffer(readData(data,pos+2+ll,l));
                return buf.toString();
            break;
            case 11:
                var ll=data[pos+1];
                var l=dataToNum(readData(data,pos+2,ll));
                var lens=[];
                var position=pos+2+ll;
                for (var i=0; i<l; i++) {
                    var ll0=data[position];
                    var l0=dataToNum(readData(data,position+1,ll0));
                    lens.push(l0);
                    position+=ll0+1;
                };
                var res=[];
                for (var i=0; i<l; i++) {
                    var d=readData(data,position,lens[i]);
                    position+=lens[i];
                    res.push(this._decode(new Buffer(d)));
                };
                return res;
            break;
            case 12:
                var ll=data[pos+1];
                var l=dataToNum(readData(data,pos+2,ll))*2;
                var lens=[];
                var position=pos+2+ll;
                for (var i=0; i<l; i++) {
                    var ll0=data[pos+position];
                    var l0=dataToNum(readData(data,position+1,ll0));
                    lens.push(l0);
                    position+=ll0+1;
                };
                var res={};
                for (var i=0; i<l; i+=2) {
                    var name=readData(data,position,lens[i]);
                    position+=lens[i];
                    var obj=readData(data,position,lens[i+1]);
                    position+=lens[i+1];
                    name=this._decode(new Buffer(name));
                    obj=this._decode(new Buffer(obj));
                    res[name]=obj;
                };
                return res;
            break;
        };
    };
};

Binary.prototype.decode=function(data) {
    var self=this;
    return new Promise(function(a) {
        a(self._decode(data));
    });
};

module.exports=Binary;