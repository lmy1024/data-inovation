/**
 * Created by z on 2015/10/20.
 */
playPause.on("click",stopStart);

//
function stopStart() {
	if (running==true) {
		running=false;
		clearInterval(refreshIntervalId);
		//playPause.attr("src","images/play_bw.png");
		$("#playPause").find(">i.icon").removeClass("pause").addClass("play");

		eChords.interrupt();
		iChords.interrupt();
		iText.interrupt();
		eText.interrupt();

	}else {
		running=true;
		//playPause.attr("src","images/pause_bw.png");
		$("#playPause").find(">i.icon").removeClass("play").addClass("pause");

		update(year);
		refreshIntervalId=setInterval(run,delay);
	}
}


function node_onMouseOver_export(d) {
	var t;
	//console.log(JSON.stringify(d));
	if (typeof d.imports == "undefined") {
		if(d.exports > -10000000){
			t="人均消费: " + formatCurrency(Number(d.exports))+"元";
		}else{
			t="人均消费: 0"
		}
	}else {
		if(d.imports > -10000000){
			t="人均消费: " + formatCurrency(Number(d.imports))+"元";
		}else{
			t="人均消费: 0"
		}
	}

	var left = $("#content").offset().left;
	if(left > 0){
		left = d3.event.pageX -left+40;
	}else{
		left = d3.event.pageX;
	}

	toolTip.transition()
		.duration(200)
		.style("opacity", ".9");
	header.text((d.index+1) + ". " + d.label);
	header1.text(2015);
	header2.text(t);
	toolTip.style("left", (left+15) + "px").style("top", (d3.event.pageY) + "px")
		.style("height", "120px");
}

function node_onMouseOver_import(d) {
	var t;
	//console.log(JSON.stringify(d));
	if (typeof d.imports == "undefined") {
		if(d.exports > -10000000){
			t="人均消费: " + formatCurrency(Number(d.exports))+"元";
		}else{
			t="人均消费: 0"
		}
	}else {
		if(d.imports > -10000000){
			t="人均消费: " + formatCurrency(Number(d.imports))+"元";
		}else{
			t="人均消费: 0"
		}
	}

	var left = $("#content").offset().left;
	if(left > 0){
		left = d3.event.pageX -left+40;
	}else{
		left = d3.event.pageX;
	}

	toolTip.transition()
		.duration(200)
		.style("opacity", ".9");
	header.text((d.index+1) + ". " + d.label);
	header1.text(2016);
	header2.text(t);
	toolTip.style("left", (left+15) + "px").style("top", (d3.event.pageY) + "px")
		.style("height", "120px");
}

function node_onMouseOut(d) {

	toolTip.transition()									// declare the transition properties to fade-out the div
		.duration(500)									    // it shall take 500ms
		.style("opacity", "0");							// and go all the way to an opacity of nil

}
/** Returns an event handler for fading a given chord group. */
function fade(opacity) {

	return;

	return function(g, i) {
		svg.selectAll("path.chord")
			.filter(function(d) {
				//  return true;
				return d.source.index != i && d.target.index != i;
			})
			.transition()
			.style("opacity", opacity);
	};
}
