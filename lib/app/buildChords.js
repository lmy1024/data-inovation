/**
 * Created by z on 2015/10/19.
 */
//建弦
function buildChords(y) {

    countries=countriesGrouped[y].values;
    //console.log(countries);
    countries.sort(function (a,b) {
        //Descending Sort    出口降序排列
        if (a.Exports > b.Exports) return -1;
        else if (a.Exports < b.Exports) return 1;
        else return 0;
    });

    export_countries=countries.slice(0,topCountryCount);            //取输出前20的城市
    //console.log(export_countries[0].Country);


    countries.sort(function (a,b) {
        //Descending Sort        进口降序排列
        if (a.Imports > b.Imports) return -1;
        else if (a.Imports < b.Imports) return 1;
        else return 0;
    });

    import_countries=countries.slice(0,topCountryCount);        //输入前20的城市
    //console.log(import_countries);
    var  import_matrix = [],                                    //定义输入矩阵
        export_matrix = [];                                     //定义输出矩阵

    e_buf_indexByName=e_indexByName;                        //
    i_buf_indexByName=i_indexByName;

    e_indexByName=[];
    e_nameByIndex=[];
    i_indexByName=[];
    i_nameByIndex=[];
    n = 0;

    // Compute a unique index for each package name     //为每个输出计算一个独立的索引
    totalExports=0;
    export_countries.forEach(function(d) {                      //遍历输出前20城市
        totalExports+= Number(d.Exports);
        d = d.Country;
        if (!(d in e_indexByName)) {
            e_nameByIndex[n] = d;                           //e_nameByIndex[n]
            e_indexByName[d] = n++;                         //e_indexByName[d]
        }
    });
    //console.log("totalExports="+totalExports);
    export_countries.forEach(function(d) {                            //遍历输出前20城市
        var source = e_indexByName[d.Country],                        //source输出索引号
            row = export_matrix[source];
        if (!row) {
            row = export_matrix[source] = [];
            for (var i = -1; ++i < n;) row[i] = 0;
        }
        row[e_indexByName[d.Country]]= d.Exports;       //row[]=d.exports
    });
       //console.log("export_matrix"+export_matrix);
    // Compute a unique index for each country name.        //为每个输入名建立一个独立的索引
    n=0;
    totalImports=0;
    import_countries.forEach(function(d) {
        totalImports+= Number(d.Imports);
        d = d.Country;
        if (!(d in i_indexByName)) {
            i_nameByIndex[n] = d;
            i_indexByName[d] = n++;
        }
    });
    //console.log("totalImports="+totalImports);

    import_countries.forEach(function(d) {
        var source = i_indexByName[d.Country],
            row = import_matrix[source];
        if (!row) {
            row = import_matrix[source] = [];
            for (var i = -1; ++i < n;) row[i] = 0;
        }
        row[i_indexByName[d.Country]]= d.Imports;
    });

    //alert(JSON.stringify(import_countries));

    var exportRange= 150;  //angleRange*(totalExports/(totalExports + totalImports));//输出角范围
    //console.log("exportRange"+exportRange);

    var importRange=180;//angleRange*(totalImports/(totalExports + totalImports));            //输入角范围
    export_chord.startAngle(-(exportRange/2))                                                       //输出弦起始角
        .endAngle((exportRange/2));

    import_chord.startAngle(180-(importRange/2))                                            //输入弦起始角
        .endAngle(180+(importRange/2));

    import_chord.matrix(import_matrix);                                                     //输入弦
    export_chord.matrix(export_matrix);

    //console.log("export_matrix=");
    //console.log(export_matrix);
    //console.log("export_groups()");
    //console.log(export_chord.groups());
    //console.log("export_chord");
    //console.log(export_chord.chords());


    var tempLabels=[];                                      //临时标签
    var tempChords=[];                                       //临时弦

    for (var i=0; i < e_labels.length; i++) {
        e_labels[i].label='null';
        e_chords[i].label='null';
    }

    //console.log(import_chord.groups());
    //console.log(import_chord.chords());
    //将每个节点及弦对象保存在d中
    for (var i=0; i < export_chord.groups().length; i++) {          //
        var d={}                                    //定义一个数组接收数据
        var g=export_chord.groups()[i];         //定义输出节点对象
        var c=export_chord.chords()[i];         //定义输出弦对象


        //console.log("c.source="+c.source);
        d.index=i;                                 //d索引号
        d.angle= (g.startAngle + g.endAngle) / 2;       //弧的角度
        d.label = e_nameByIndex[g.index];               //d标签
        d.exports= g.value;
        //console.log("c.source.value"+d.exports);
        var bIndex=e_buf_indexByName[d.label];      //输出缓存索引
        if (typeof bIndex != 'undefined') {  //Country already exists so re-purpose node.    已经在的城市，重新定义节点
            e_labels[bIndex].angle= d.angle;
            e_labels[bIndex].label= d.label;
            e_labels[bIndex].index= i;
            e_labels[bIndex].exports= d.exports;

            e_chords[bIndex].index= i;
            e_chords[bIndex].label= d.label;
            /*e_chords[bIndex].source= c.source;*/
            e_chords[bIndex].source.index= i;
            e_chords[bIndex].source.label= d.label;
            e_chords[bIndex].source.startAngle= c.source.startAngle;
            e_chords[bIndex].source.subindex= i;
            e_chords[bIndex].source.endAngle= c.source.endAngle;
            e_chords[bIndex].target= c.target;
            e_chords[bIndex].exports = d.exports;

        }
        else { //Country doesnt currently exist so save for later               不存在的城市，储存下来供以后使用
            tempLabels.push(d);       //临时标签
            tempChords.push(c);       //临时弦
        }
    }
    //console.log("e_chords=");
    //
    //console.log(e_chords);

    //Now use up unused indexes
    for (var i=0; i < e_labels.length-1; i++) {
        if (e_labels[i].label=="null") {
            var o=tempLabels.pop();
            //By Linhao 增加
            if(!o){
                continue;
            }
            e_labels[i].index=e_indexByName[o.label];
            e_labels[i].label= o.label;
            e_labels[i].angle= o.angle;
            e_labels[i].exports= o.exports;

            var c=tempChords.pop();
            var source = new Object();
            source.index= o.index;
            source.startAngle= c.source.startAngle;
            source.subindex=  o.index;
            source.value= o.exports;
            source.endAngle= c.source.endAngle;
            e_chords[i].label= o.label;
            e_chords[i].index= o.index;
            /*e_chords[i].source= c.source;*/
            e_chords[i].source=source;
            /*e_chords[bIndex].source.index= o.index;
            e_chords[bIndex].source.label= o.label;
            e_chords[bIndex].source.startAngle= c.source.startAngle;
            e_chords[bIndex].source.subindex=  o.index;
            e_chords[bIndex].source.endAngle= c.source.endAngle;*/
            e_chords[i].target= c.target;
            e_chords[i].exports= o.exports;

        }
    }


    tempLabels=[];
    tempChords=[];

    for (var i=0; i < i_labels.length; i++) {
        i_labels[i].label='null';
        i_chords[i].label='null';
    }

    for (var i=0; i < import_chord.groups().length; i++) {
        var d={}
        var g=import_chord.groups()[i];
        var c=import_chord.chords()[i];
        d.index=i;
        d.angle= (g.startAngle + g.endAngle) / 2;
        d.label = i_nameByIndex[g.index];
        d.imports = g.value;
        var bIndex=i_buf_indexByName[d.label];
        if (typeof bIndex != 'undefined') {  //Country already exists so re-purpose node.
            i_labels[bIndex].angle= d.angle;
            i_labels[bIndex].label= d.label;
            i_labels[bIndex].imports= d.imports;
            i_labels[bIndex].index= i;

            i_chords[bIndex].index= i;
            i_chords[bIndex].label= d.label;
            i_chords[bIndex].source= c.source;
            i_chords[bIndex].target= c.target;
            i_chords[bIndex].imports= d.imports;

        }
        else { //Country doesnt currently exist so save for later
            tempLabels.push(d);
            tempChords.push(c);
        }
    }

    //Now use up unused indexes
    for (var i=0; i < i_labels.length; i++) {
        if (i_labels[i].label=="null") {
            var o=tempLabels.pop();

            //By Linhao 增加
            if(!o){
                continue;
            }

           /* console.dir(o);*/

            i_labels[i].index=i_indexByName[o.label];
            i_labels[i].label= o.label;
            i_labels[i].angle= o.angle;
            i_labels[i].imports= o.imports;

            var c=tempChords.pop();
            i_chords[i].label= o.label;
            i_chords[i].index= o.index;
            i_chords[i].source= c.source;
            i_chords[i].target= c.target;
            i_chords[i].imports= o.imports;

        }
    }

    //获取第一个索引号
    function getFirstIndex(index,indexes) {
        for (var i=0; i < topCountryCount; i++) {
            var found=false;
            for (var y=index; y < indexes.length; y++) {
                if (i==indexes[y]) {
                    found=true;
                }
            }
            if (found==false) {
                return i;
                //  break;
            }
        }
        //      console.log("no available indexes");
    }
    //根据名字获取标签索引号
    function getLabelIndex(name) {
        for (var i=0; i < topCountryCount; i++) {
            if (e_buffer[i].label==name) {
                return i;
                //   break;
            }
        }
        return -1;
    }


}

