/**
 * Created by lmy on 2016/11/6.
 */
var maxWidth=Math.max(600,Math.min(screen.height,screen.width)-300);

var outerRadius = (maxWidth / 2),               //外半径
    innerRadius = outerRadius - 100,                //内半径
    monthWidth=Math.max(400,(innerRadius*2)-250);       //月份轴宽度


var iText,iChords,eText,eChords;

var angleRange=320,             //角范围
    baseYear=2008,             //起始年份
    maxMonth=1,
    maxYear=12,
    monthOffset=(monthWidth)/(maxYear*12+maxMonth),
    countries,
    e_labels=[],                //出口标签
    e_chords=[],                //出口弦
    i_labels=[],                //进口标签
    i_chords=[],                //进口弦
    topCountryCount=21,     //最大城市数
    e_buf_indexByName={},
    e_indexByName = {},     //通过名字，得到的输出索引序号
    e_nameByIndex = {},     //通过输出索引序号，得到的名字
    i_indexByName = {},     //通过名字，得到的输入索引序号
    i_nameByIndex = {},        //通过输入索引序号，得到的名字
    i_buf_indexByName={},
    export_countries=[],        //输出城市（前20）
    import_countries=[],        //输入城市（前20）
    e_colorByName={},           //输出城市颜色，通过名字
    i_colorByName={},              //输入城市颜色，通过名字
    months=[],                         //月份数
    monthlyExports=[],                  //
    monthlyImports=[],                   //
    yearlyImports=[],
    yearlyExports=[],
    countriesGrouped,                   //
    delay=3000,
    refreshIntervalId,
    year= 0,
    month=-1,
    running=true,                       //运行
    formatNumber = d3.format(",.0f"),
    formatCurrency = function(d) { return  formatNumber(d)},
    eTextUpdate,                //输出文字更新
    eChordUpdate,               //输出弦更新
    TextUpdate,                    //文字更新
    iChordUpdate;                   //输入弦更新


var toolTip = d3.select(document.getElementById("toolTip"));
var header = d3.select(document.getElementById("head"));
var header1 = d3.select(document.getElementById("header1"));
var header2 = d3.select(document.getElementById("header2"));

var e_fill= d3.scale.ordinal().range(["rgb(231,158,41)","rgb(236,192,49)","rgb(229,197,81)","rgb(214,153,39)","rgb(249,243,197)"]);   //输出弦填充颜色随机
var i_fill= d3.scale.ordinal().range(["rgb(7,33,13)","rgb(18,91,48)","rgb(2,100,0)","rgb(119,146,71)","rgb(136,194,58)"]);      //输入弦填充颜色随机

//var monthsMap=["Jan","Feb","Mar","Apr","May","Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];      //月份轴


/*
 d3.select(document.getElementById("mainDiv"))
 .style("width",(outerRadius*2 + 200) + "px")
 .style("height",(outerRadius*2 + 200) + "px");

 */

d3.select(document.getElementById("bpg"))
    .style("min-width",(outerRadius*2 + 150) + "px");


var playPause=d3.select(document.getElementById("playPause"));      //暂停停止

d3.select(document.getElementById("imgDiv"))            //imgdiv样式
    .style("left",((outerRadius-monthWidth/2))+"px");

var svg = d3.select(document.getElementById("svgDiv"))      //设置svg样式
    .style("width", (outerRadius*2+120) + "px")
    .style("height", (outerRadius*2+120) + "px")            //原来的(outerRadius*2+200)
    .append("svg")
    .attr("id","svg")
    .style("width", (outerRadius*2+120) + "px")
    .style("height", (outerRadius*2+120) + "px");            //原来的(outerRadius*2+200)


var export_chord = d3.layout.arc_chord()            //输出额arc_弦图布局
    .padding(.05)
    .sortSubgroups(d3.descending)
    .sortChords(d3.descending)
    .yOffsetFactor(-0.8);

var import_chord = d3.layout.arc_chord()            //输入额arc_弦图布局
    .padding(.05)
    .yOffsetFactor(0.7)
    .sortSubgroups(d3.descending)
    .sortChords(d3.descending);

var arc = d3.svg.arc()                            //弧生成器
    .innerRadius(innerRadius)
    .outerRadius(innerRadius + 5);


var dGroup = svg.append("g")                //添加g<mainLabel>标签
    .attr("class","mainLabel")

dGroup.append("text")                              //添加文字,投入经费
    .attr("id","mainLabel")
    .attr("class","mainLabel")
    .attr("transform", "translate(" + (outerRadius +  5) + ","  + (outerRadius + 30) +")")
    .style("font-size","0px");


dGroup.append("text")                       //年份
    .attr("id","midLabel")
    .attr("class","midLabel")
    .attr("transform", "translate(" + (outerRadius + 5) + ","  + (outerRadius + 40) +")")
    .style("font-size","0px");


dGroup.append("text")                               //添加文字，输出课题数
    .attr("id","secondLabel")
    .attr("class","secondLabel")
    .attr("transform", "translate(" + (outerRadius - 90) + ","  + (outerRadius + 50) +")")
    .style("font-size","0px");





var gY=(outerRadius-(innerRadius *.8/2));

gradientGroup =svg.append("g")
    .attr("class","gradient")
    .attr("transform","translate(" + (outerRadius+44) + "," + (gY+70)  + ")" );

gradientGroup.append("rect")
    .attr("height",((outerRadius + innerRadius *.7/2)-gY))
    .attr("width",0)
    .style("fill","url(#gradient1)");

var mGroup=svg.append("g")
    .attr("class","months")
    .attr("transform", "translate(" + (outerRadius-monthWidth/2-20) + ","  + 40 + ")");

var eGroup=svg.append("g")
    .attr("class","exports")
    .attr("transform", "translate(" + (outerRadius+50) + "," + (outerRadius+70) + ")");

var iGroup=svg.append("g")
    .attr("class","imports")
    .attr("transform", "translate(" + (outerRadius+50) + "," + (outerRadius+70) + ")");