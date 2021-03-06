var smr = smr || {};

var ua = navigator.userAgent.toLowerCase();
smr.isChrome = ua.match(/chrome\/([\d.]+)/);
smr.isSafari = ua.match(/version\/([\d.]+)/);
smr.isFirefox = ua.match(/firefox\/([\d.]+)/);
smr.isOpera = ua.match(/opera\/([\d.]+)/);

(function($){

	  var json = {
				  "name": "Users",
				  "children": [
					   {"name": "UserA","weight":6},
					   {"name": "UserB","weight":13},
					   {"name": "UserC","weight":9},
					   {"name": "UserD","weight":5},
					   {"name": "UserE","weight":7},
					   {"name": "UserF","weight":8},
					   {"name": "UserG","weight":8},
					   {"name": "UserH","weight":11},
					   {"name": "UserI","weight":8},
					   {"name": "UserJ","weight":11},
					   {"name": "UserK","weight":10},
					   {"name": "UserL","weight":12},
					   {"name": "UserM","weight":18},
					   {"name": "UserN","weight":20},
					   {"name": "UserO","weight":15},
					   {"name": "UserP","weight":14},
					   {"name": "UserQ","weight":17},
					   {"name": "UserR","weight":11},
					   {"name": "UserS","weight":12},
					   {"name": "UserT","weight":9},
					   {"name": "UserU","weight":9},
					   {"name": "UserV","weight":9},
					   {"name": "UserW","weight":8},
					   {"name": "UserX","weight":6},
					   {"name": "UserY","weight":11},
					   {"name": "UserZ","weight":16}
				  ]
			 };
	
	// --------- Component Interface Implementation ---------- //
	function D3ForceClusterChart(){};
	smr.D3ForceClusterChart = D3ForceClusterChart; 
  
	D3ForceClusterChart.prototype.create = function(cdata,config){
		var html = hrender("tmpl-D3ForceClusterChart",{});
		return html;
	}
		
	D3ForceClusterChart.prototype.postDisplay = function(cdata, config) {
		var w = 1280,
	    h = 800,
	    rx = w / 2,
	    ry = h / 2,
	    rotate = 0;

		var radialGradients=[{id:"radialGradientNodes",endColor:"#FCA000",startColor:"#F8F28A",r:8},
							 {id:"radialGradientOrigin",endColor:"#006400",startColor:"#6DA202",r:12}];
		
		var cluster = d3.layout.cluster()
		    .size([360, ry - 120])
		    .sort(function(a, b){return d3.descending(a.weight, b.weight);});
	
		var svg = d3.select("#D3ForceClusterChart").append("div")
		    .style("width", w + "px")
		    .style("height", 800 + "px")
		    .style("overflow", "auto")
		    .append("svg:svg")
		    .attr("width", w)
		    .attr("height", 800);


		
		var vis = svg.append("svg:g")
		    .attr("transform", "translate(" + 300 + "," + 350 + ")");
		
		var defs = vis.append("defs");
		
		var radialGradient = defs.selectAll("radialGradient")
			.data(radialGradients)
		  .enter()
			.append("radialGradient")
			.attr("id",function(d){return d.id})
			.attr("r","70%")
			.attr("cx", "50%")
		    .attr("cy", "50%")
		    .attr("rx", "50%")
		    .attr("ry", "50%");
		
		radialGradient.append("stop")
			.attr("offset","0%")
			.style("stop-color",function(d){return d.startColor})
			.style("stop-opacity","1");
		radialGradient.append("stop")
			.attr("offset","100%")
			.style("stop-color",function(d){return d.endColor})
			.style("stop-opacity","1");
		
		
		  var nodes = cluster.nodes(json);
		 	  
		  function xs(d) { return (d.depth>0?(d.y-150+(d.weight*5)):d.y) * Math.cos((d.x - 90) / 180 * Math.PI); }
		  function ys(d) { return (d.depth>0?(d.y-150+(d.weight*5)):d.y) * Math.sin((d.x - 90) / 180 * Math.PI); }	  

		  var link = vis.selectAll("g.link")
	          .data(nodes)
	          .enter()
	          .append("svg:g")
	          .attr("class", "link")
	          .append("line")
	          .attr("x1", function(d) { return xs(d); })
	          .attr("y1", function(d) { return ys(d); })
	          .attr("x2", function(d) { return xs(nodes[0]); })
	          .attr("y2", function(d) { return ys(nodes[0]); });
	
		  vis.selectAll(".dot")
			  .data(nodes)
			.enter().append("ellipse")
			  .attr("class", function(d){ return (d.depth==0) ? "origin" : "nodes";})
			  .attr("cx", function(d) { return xs(d); })
			  .attr("cy", function(d) { return ys(d); })
			  .attr("rx", function(d){ return (d.depth==0) ? 12 : 8; })
			  .attr("ry", function(d){ return (d.depth==0) ? 12 : 8; })
			  .attr("style",function(d){return (d.depth==0) ? "fill:url(#radialGradientOrigin)" : "fill:url(#radialGradientNodes)";})
		  
		  var node = vis.selectAll("g.node")
		      .data(nodes)
		    .enter().append("g")
		      .attr("class", "node")
		      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + getNodeTranslate(d) + ")"; })
		    .append("svg:text")
		      .attr("dx", function(d) { return d.x < 180 ? 12 : -18; })
		      .attr("dy", ".31em")
		      .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
		      .attr("transform", function(d) { return d.x < 180 ? null : "rotate(180)"; })
		      .text(function(d) { return d.name; });
		  
	        $('svg .nodes').tipsy({ 
		        gravity: 'w', 
		        html: true, 
		        title: function() {
		          var d = this.__data__;
		          return 'Weight: ' + d.weight; 
		        }
		    });
	        
	        function getNodeTranslate(d){
	        	var translate = (d.depth>0?(d.y-150+(d.weight*5)):d.y);
	        	if(smr.isFirefox || smr.isOpera){
	        		return translate <=180 ? translate+15 : translate;
	        	}else{
	        		return translate;
	        	}
	        }
	
	}
	
	// --------- /Component Interface Implementation ---------- //
	
	
	// --------- Component Registration --------- //
	brite.registerView("D3ForceClusterChart",{
		emptyParent: true,
		loadTmpl: false
	},
	function(){
		return new smr.D3ForceClusterChart();
	});	
	// --------- /Component Registration --------- //
	
})(jQuery);
