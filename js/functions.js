var diameter = 960,
    radius = diameter / 2,
    innerRadius = radius - 180,
    extra_width = 100;
var Hoverednumber = 0;
var Judge = false;

var tooltip = d3.select("body").append("div").attr("class", "toolTip");

var div1 = document.getElementById("text1");
var div2 = document.getElementById("text2");
var informationDiv = document.getElementById("proj_desc");

var svg = d3.select("#mainSVG").append("svg")
            .attr("width", diameter + extra_width)
            .attr("height", diameter + extra_width)
            .append("g")
            .attr("transform", "translate(" + (radius + extra_width/2) + "," + (radius + extra_width/2) + ")");
			

				   

var svgTimeLine = d3.select("#timeLineSVG").append("svg")
				  .attr("width", 400)
				  .attr("height",300)
				 ;
				  

var line = d3.radialLine()
             .curve(d3.curveBundle.beta(0.85))
             .radius(innerRadius)
             .angle(function(d) { return d / data_count * Math.PI * 2; });




var color11 = "#045C2E"; // PI - green
    color1 = "#3E8E64";

    color22 = "#7F2628"; // Action - red
    color2 = "#BF272E";


    color33 = "#043866"; // Sample - blue
    color3 = "#387DB4";

    color44 = "#e85f2f";// color for "Technical training" - arbitrary color
    color4 = "#e08f74";

    bigLabels = svg.append("g").attr("id", "Labels");
	bigLabels.append("text")
				   .text("Project")
				   .attr("x", -30)
				   .attr("y", -220)
				   .attr("transform", "rotate(70,0,0)")
				   .attr("fill", color1) 
				   .attr("class","bigLabel").on("mouseover", function(){console.log(this)});
	bigLabels.append("text")
				   .text("Activity")
				   .attr("x", -70)
				   .attr("y", -220)
				   .attr("transform", "rotate(220,0,0)")
				   .attr("fill", color2) 
				   .attr("class","bigLabel");				   

	bigLabels.append("text")
				   .text("Component")
				   .attr("x", -110)
				   .attr("y", -220)
				   .attr("transform", "rotate(-25,0,0)")
				   .attr("fill", color3) 
				   .attr("class","bigLabel");	
	
var node = svg.append("g");
    text = svg.append("g");
    link = svg.append("g").attr("id", "path");
					   
var Projects;

d3.json("data/data1.json", function(error, json){

    var data_count = json.length;
    var circle_radius = innerRadius;
    var text_radius = innerRadius;
    var position = -13;
    var adjust_node_angle = -0.005;
    var adjust_text_angle = -1;
	
	Projects = json;
 
 	
    node = node.selectAll("circle")
               .data(json)
               .enter().append("circle")
               .attr("transform", function(i, d) {  angle = ((d + position) / data_count + adjust_node_angle) * 2 * Math.PI;
                                                   return "translate(" + circle_radius * Math.cos(angle) + "," + circle_radius * Math.sin(angle) + ")"; })
               .attr("cx", 0)
               .attr("cy", 0)
               .attr("r", 8)
               .attr("fill", function(i, d) { if (i.size == 1) { return color1; }
                                              else if (i.size == 2) { return i.name == "Technical Training xxx" ? color4 : color2}
                                              else if (i.size == 3) { return color3; }
                                              else { return "white"; } })
               .attr("opacity", function(i, d) { if (i.size < 10) { return 1; }
                                                 else { return 0; } })
               .attr("class", function(i, d) { return "node n" + (d+1) })
			   .on("mouseover", mouseovered)
               .on("mouseout", mouseouted)
               .on("click",mousedown);

    text = text.selectAll("text")
               .data(json)
               .enter().append("text")
               .text(function(i, d) { return i.name; })
               .attr("transform", function(i, d) {  angle = (d + position) / data_count * 360;
                                                   if (90 < angle && angle <= 270) { return "rotate(" + (angle + adjust_text_angle) + ",0,0)translate(320, -6)rotate(180,0,0)"; }
                                                   else { return "rotate(" + (angle + adjust_text_angle) + ",0,0)translate(320, 6)"; }
                                                    })
               .attr("text-anchor", function(i, d) {  angle = (d + position) / data_count * 360;
                                                     if (90 < angle && angle <= 270) { return "end"; }
                                                     else { return "start"; } })
               .attr("opacity", function(i, d) { if (i.size < 10) { return 1; }
                                                 else { return 0; } })
               .attr("fill", function(i, d) { if (i.size == 1) { return color1 }
                                               else if (i.size == 2) { return i.name == "Technical Training xxx" ? color4 : color2 }
                                               else if (i.size == 3) { return color3 }
                                               else { return "white" }
                                             })
               .attr("class", function(i, d) { return "font t" + (i.number) })
               .on("mouseover", mouseovered)
               .on("mouseout", mouseouted)
               .on("click",mousedown);




    function mouseovered(d) {


        Hoverednumber = d.number;
		
        schedules = getScheduleByNumber(Hoverednumber);
		
 
		project = getObjectByNumber(Hoverednumber);
		
 		drawSchedules(schedules);
		
		/*
        d3.select(".t"+d.number)
          .transition()
          .style("font-size", "18px")
          .style("font-weight", 700)
          .style("cursor", "pointer");
		*/
		 d3.select(".t"+d.number).style("cursor", "pointer");
		 
        if (d.size == 1) {
            // console.log(d3.select(".p"+d.number));
            // d3.selectAll(".p"+d.number).classed("line1", true);
            d3.selectAll(".link")
              .transition()
              .style("fill-opacity", 0);

            d3.selectAll(".p"+d.number)
              .transition()
              .style("fill", color11)
              .style("fill-opacity", 0.15);

            // change information in pos-left div
            informationDiv.textContent = '';
            informationDiv.innerHTML =  d.description ;

        } else if (d.size == 2) {
            // d3.selectAll(".p"+d.number).classed("line2", true);
            d3.selectAll(".link")
              .transition()
              .style("fill-opacity", 0);

            d3.selectAll(".p"+d.number)
              .transition()
              .style("fill", function() {return d.name == "Technical Training" ? color4 : color2})
              .style("fill-opacity", 0.15);
            // change information in pos-left div
            informationDiv.textContent = '';
            informationDiv.innerHTML =  d.description ;
			 

        } else if (d.size == 3) {
            // d3.selectAll(".p"+d.number).classed("line3", true);
            d3.selectAll(".link")
              .transition()
              .style("fill-opacity", 0);

            d3.selectAll(".p"+d.number)
              .transition()
              .style("fill", color33)
              .style("fill-opacity", 0.15);
            // change information in pos-left div
            informationDiv.textContent = '';
            informationDiv.innerHTML =  d.description ;
        } else {}

    }

    function mouseouted(d) {
		return;
        Hoverednumber = d.number;

        //to be modified (just a try)
        d3.selectAll(".link")
          .attr('opacity', 0);
        setTimeout(function() {
          // clearTimeout();
          d3.selectAll(".link")
            .attr('opacity', 1);
        }, 1000);

        d3.selectAll(".p"+d.number)
          .transition()
          .style("fill-opacity", 0);

        d3.selectAll(".t"+d.number)
          .transition()
          .style("font-size", "15px")
          .style("font-weight", 350);

        if (d.size == 1) {
            d3.selectAll(".link")
              .transition()
              .style("fill", color11)
              .style("fill-opacity", 0.075);
        } else if (d.size == 2) {
            d3.selectAll(".link")
              .transition()
              .style("fill", color22)
              .style("fill-opacity", 0.075);
        } else if (d.size == 3) {
            d3.selectAll(".link")
              .transition()
              .style("fill", color33)
              .style("fill-opacity", 0.075);
        } else {}

        Hoverednumber = 0;
    }

    function mousedown(d) {
        // text.classed("text4", function(l){if (l === d && l.size !== 10) return true});
      div1.textContent = d.name;
      div2.textContent = d.pi;
    }


});

 var allLinks;
 
function getObjectByNumber(number){
 
	Projects.forEach(function(d){
		
		if (d.number == number){
			 
			result = d;	
		}
	});	
	return result;
} 
 
function getScheduleByNumber(number){
	schedules = [];
	//console.log(number);
	allLinks.forEach(function(d){
		if (d.project == number || d.action == number || d.sample == number){
			name = getObjectByNumber(d.project).name +  " / "+getObjectByNumber(d.action).name+" / "+getObjectByNumber(d.sample).name;
 			schedules.push({"name":name, "schedule": d.schedule, "links":[d.project, d.action, d.sample ]});
			
		}
		});	
	return schedules;
}

function drawSchedules(schedule){
 	
	xspace = 33;
	barWidth = 32.5;
	svgTimeLine.selectAll("g").remove();
	svgTimeLine.append("g").attr("id", "timelineLabel").append("text").text("Time Line").attr("x",330).attr("y",300);
	g = svgTimeLine.append("g").attr("id","bars")
		.attr("transform","translate(0,290), scale(1,-1)");
	gaxis = svgTimeLine.append("g").attr("id","time")
		.attr("transform","translate(0,300)");
	
	texts = ["18F","   W","   U","   S","19F","   W","   U","   S","20F","   W" ];
	for(i=0;i<texts.length;i++){
		gaxis.append("text")
			 .attr("x",i*xspace)
			 .attr("y",0)
			 .text(texts[i])
			 .attr("fill","#cccccc");
	}
	
	height = 220;
	width = 360;
 
	 var x = d3.scaleBand()
		.rangeRound([0, width])
		.paddingInner(0.05)
		.align(0.1);
	
	// set y scale
	var y = d3.scaleLinear()
		.rangeRound([height, 0]);
	
	// set the colors
	
	if (schedule.length<11){
		colors = d3.schemeCategory20;	
	}else{
		colors = d3.schemeCategory20;
	}
	

	 
	 ypos = [];
	 ypos=[0,0,0,0,0,0,0,0,0,0,0,0];
	schedule.forEach(function(d,i){
 
		d.schedule.forEach(function(dd,j){
			if (dd==1 || dd==0) {ypos[j]+=10;
			
				g.append("rect")
					.attr("x", j*xspace)
					.attr("y", ypos[j])
					.attr("height",8)
					.attr("width",barWidth)
					.attr("fill",function(){		
						if(dd==1){
						 
	 						return colors[d.links[0]-2];
						 
						}else{
							return "#ffffff";	
						}
					})
					.on("mousemove", function(){
					        tooltip
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("display", "inline-block")
              .html(d.name);
        		}).on("mouseout", function(d){ tooltip.style("display", "none");});
			}
		});
	});
 	
}

d3.json("data/data2.json", function(error, json){
    var data_count = 57;
    var radialLineGenerator = d3.radialLine()
                            .curve(d3.curveBundle.beta(0.8));

    var line_radius = innerRadius - 7.5;

    allLinks = json;
	
 
	
	json.forEach(function(d){

        
        var points1 = [
        [d.project / data_count * 2 * Math.PI, line_radius],[0,0],[(d.action-98) / data_count * 2 * Math.PI, line_radius],
        ];
        var radialLine1 = radialLineGenerator(points1);


        var points2 = [
        [(d.action-98) / data_count * 2 * Math.PI, line_radius],[0,0],[(d.sample-198) / data_count * 2 * Math.PI, line_radius],
        ];

        var radialLine2 = radialLineGenerator(points2);


        var points3 = [
        [(d.sample-198) / data_count * 2 * Math.PI, line_radius],[0,0],[d.project / data_count * 2 * Math.PI, line_radius],
        ];

        var radialLine3 = radialLineGenerator(points3);

        var pt1 = "p" + d.project.toString();
        var pt2 = "p" + d.action.toString();
        var pt3 = "p" + d.sample.toString();

       svgPath = d3.select("#path");
	   
           onePath = svgPath.append("path")
          .attr('d', radialLine1  + "L" + radialLine2.split("L")[1] + "L" + radialLine2.split("L")[2] + "L" + radialLine3.split("L")[1] + "L" + radialLine3.split("L")[2] + "Z") // draw 3 paths into 1
          .attr("class","link " + pt1 + " " + pt2 + " " + pt3)
		   .on("mouseover", function(){
			 console.log(this);  
		   });
		  
/*		  console.log(onePath);
		  svgPath.on("click", function(){
			  console.log("moved");
			 rpos = svgPath.createSVGRect();
			rpos.x = evt.clientX;
			rpos.y = evt.clientY;
			rpos.width = rpos.height = 1;
			console.log(svgPath.getIntersectionList(rpos,null));
		});*/

    });

});