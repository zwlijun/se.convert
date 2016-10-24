(function main(){
    var args = WScript.Arguments;
    var tmp = [];
    
    for(var i = 0, count = args.count(); i < count; i++){
        tmp.push(args.item(i));
    }
    
    Util.convert.apply(Util, tmp);
})();