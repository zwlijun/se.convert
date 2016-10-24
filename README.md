# SE.Convert

<pre>
convert.reg  //注册表（需要修改里面的路径）
convert.cmd  //命令行
convert.wsf  //windows宿主脚本
util.js      //核心实现
convert.js   //转换JS

//--------------------------------
//             说明
//--------------------------------

1、修改convert.reg中的文件目录
2、如果之前有注册过，建议选删除原来的注册项
   STEP1: 运行 -> regedit
   STEP2: 展开 HKEY_CLASSES_ROOT\AllFilesystemObjects\
   STEP3: 删除 shell 下面相关项
3、双击convert.reg
</pre>
