var Util = (function main(){
    var Encoder = {
        getEncodeBytes : function(encode){
            var o = {
                "charset" : "unknown",
                "bytes" : []
            };
            
            switch(encode){
                case "utf-8":
                    o["charset"] = "utf-8";
                    o["bytes"] = [0xEF, 0xBB, 0xBF];
                break;
                case "utf-8(without BOM)":
                    o["charset"] = "utf-8";
                    o["bytes"] = [];
                break;
                case "utf-16(Little Endian)":
                    o["charset"] = "unicode";
                    o["bytes"] = [0xFF, 0xFE];
                break;
                case "utf-16(Big Endian)":
                    o["charset"] = "unicode";
                    o["bytes"] = [0xFE, 0xFF];
                break;
                case "utf-32(Little Endian)":
                    o["charset"] = "unicode";
                    o["bytes"] = [0xFF, 0xFE, 0x00, 0x00];
                break;
                case "utf-32(Big Endian)":
                    o["charset"] = "unicode";
                    o["bytes"] = [0x00, 0x00, 0xFE, 0xFF];
                break;
                case "gb2312":
                case "ansi":
                    o["charset"] = "gb2312";
                    o["bytes"] = [];
                case "gbk":
                    o["charset"] = "gb2312";
                    o["bytes"] = [];
                break;                
            }
            
            return o;
        },
        getFileEncode : function(pathname){
            var encode = GetFileEncode(pathname);

            return this.getEncodeBytes(encode);
        },
        readFile : function(pathname){
            var stream = new ActiveXObject("ADODB.Stream");
            var content = "";
            var fileEncode = this.getFileEncode(pathname);
            
            if(fileEncode.charset == "unknown"){
                throw new Error("unsupport charset");
            }
            
            stream.type = 2;
            stream.mode = 3;
            stream.charset = fileEncode.charset;
            stream.open();
            stream.loadFromFile(pathname);
            
            content = stream.readText;
            
            stream.close();
            stream = null;
            
            return content;
        },
        writeFile : function(pathname, content, encoding, withoutBOM){
            var stream = new ActiveXObject("ADODB.Stream");
            var bom = null;
            var fileEncode = this.getEncodeBytes(encoding);
            var charset = fileEncode.charset;
            var bytes = fileEncode.bytes;
            
            if(charset == "unknown"){
                throw new Error("unsupport charset");
            }
            
            stream.type = 2;
            stream.mode = 3;
            stream.charset = charset;
            stream.open();
            stream.writeText(content);
            
            if("1" == withoutBOM){
                //ȥBOM
                bom = new ActiveXObject("ADODB.Stream");
                stream.position = 3;
                bom.type = 1;
                bom.mode = 3;
                bom.open();
                stream.copyTo(bom);
                bom.saveToFile(pathname, 2);
                //-------------------------
                bom.flush();
                bom.close();
            }else{
                stream.saveToFile(pathname, 2);
            }
            
            stream.flush();
            stream.close();
            stream = null;
            bom = null;
        },
        convertTo : function(pathname, charset, withoutBOM){
            var extPattern = /\.(txt|js|css|html|htm|shtml|json)/i;
            
            if(extPattern.test(pathname)){
                this.writeFile(pathname, this.readFile(pathname), charset, withoutBOM);
            }else{
                WScript.echo("this file type is not support. \nsupport list: txt|js|css|html|htm|shtml|json");
            }
        },
        convertAll : function(pathname, charset, withoutBOM){
            var fso = new ActiveXObject("Scripting.FileSystemObject");
            var folder = fso.GetFolder(pathname);
            var files = new Enumerator(folder.Files);

            for(; !files.atEnd(); files.moveNext()){
                var name = files.item();
                this.convertTo(name, charset, withoutBOM)
            }
            
        },
        convert : function(pathname, charset, withoutBOM){
            var fso = new ActiveXObject("Scripting.FileSystemObject");
            
            if(fso.FileExists(pathname)){
                this.convertTo(pathname, charset, withoutBOM);
            }else if(fso.FolderExists(pathname)){
                this.convertAll(pathname, charset, withoutBOM);
            }else{
                WScript.echo("file not found, pathname = " + pathname);
            }
            
            fso = null;
        }
    };
    
    
    return {
        convert : function(pathname, charset, withoutBOM){
            //Encoder.getFileEncode(pathname);
            Encoder.convert(pathname, charset, withoutBOM);
        }
    };
})();