window.CollapsiblePageTree = {};

var backgroundPageConnection = chrome.runtime.connect({
    name: "devtools-page"
});

CollapsiblePageTree.render = function() {
	backgroundPageConnection.postMessage({action: "log", msg: "render CollapsiblePageTree"});
	$('#itemsInfoTable').html(Mustache.to_html(_templates.spinner));

	var treeData = [];

	chrome.devtools.inspectedWindow.eval(
		SerializerUtil.buildExpressionForEval("b$.portal.portalModel.firstChild"),
		function (result, isException) {
			if(!isException) {
				var firstChild = SerializerUtil.toObject(result);

				function traverse(node) {
					var tmpNode = {
						"_jxid": node._jxid,
						"extendedItemName": node.extendedItemName || "",
						"name": node.name || "application",
						"parent": node.name == "" ? "application" : (node.parentItemName || "null"),
					};
					if(node.firstChild) {
						node.childNodes.forEach(function (child) {
							var tmpChild = traverse(child);
							if(!tmpNode.children) {
								tmpNode.children = [];
							}
							tmpNode.children.push(tmpChild);
						});
					}
					return tmpNode;
				}

				treeData.push(traverse(firstChild));

				// S************** Generate the tree diagram	 *****************
				var margin = {top: 30, right: 20, bottom: 30, left: 20},
				    width = 960 - margin.left - margin.right,
				    barHeight = 20,
				    barWidth = width * .8;

				var i = 0,
				    duration = 400,
				    root;

				var tree = d3.layout.tree()
				    .nodeSize([0, 20]);

				var diagonal = d3.svg.diagonal()
				    .projection(function(d) { return [d.y, d.x]; });

				$('#itemsInfoTable').html(Mustache.to_html(_templates.d3CollapsiblePageTreeStyle));
				var svg = d3.select("#itemsInfoTable").append("svg")
				    .attr("width", width + margin.left + margin.right)
				  .append("g")
				    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				flare = treeData[0];
				flare.x0 = 0;
				flare.y0 = 0;
				update(root = flare);

				function update(source) {

				  // Compute the flattened node list. TODO use d3.layout.hierarchy.
				  var nodes = tree.nodes(root);

				  var height = Math.max(500, nodes.length * barHeight + margin.top + margin.bottom);

				  d3.select("svg").transition()
				      .duration(duration)
				      .attr("height", height);

				  d3.select(self.frameElement).transition()
				      .duration(duration)
				      .style("height", height + "px");

				  // Compute the "layout".
				  nodes.forEach(function(n, i) {
				    n.x = i * barHeight;
				  });

				  // Update the nodes…
				  var node = svg.selectAll("g.node")
				      .data(nodes, function(d) { return d.id || (d.id = ++i); });

				  var nodeEnter = node.enter().append("g")
				      .attr("class", "node")
				      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
				      .style("opacity", 1e-6);

				  // Enter any new nodes at the parent's previous position.
				  nodeEnter.append("rect")
				      .attr("y", -barHeight / 2)
				      .attr("height", barHeight)
				      .attr("width", barWidth)
				      .style("fill", color)
				      .on("click", click)
				      .on("dblclick", dblclick);

				  nodeEnter.append("text")
				      .attr("dy", 3.5)
				      .attr("dx", 5.5)
				      .text(function(d) { 
							var text = d.name;
							if(d.extendedItemName != "") {
								text += " ["+d.extendedItemName+"]";
							}
							return text; 
				      });

				  // Transition nodes to their new position.
				  nodeEnter.transition()
				      .duration(duration)
				      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
				      .style("opacity", 1);

				  node.transition()
				      .duration(duration)
				      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
				      .style("opacity", 1)
				    .select("rect")
				      .style("fill", color);

				  // Transition exiting nodes to the parent's new position.
				  node.exit().transition()
				      .duration(duration)
				      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
				      .style("opacity", 1e-6)
				      .remove();

				  // Update the links…
				  var link = svg.selectAll("path.link")
				      .data(tree.links(nodes), function(d) { return d.target.id; });

				  // Enter any new links at the parent's previous position.
				  link.enter().insert("path", "g")
				      .attr("class", "link")
				      .attr("d", function(d) {
				        var o = {x: source.x0, y: source.y0};
				        return diagonal({source: o, target: o});
				      })
				    .transition()
				      .duration(duration)
				      .attr("d", diagonal);

				  // Transition links to their new position.
				  link.transition()
				      .duration(duration)
				      .attr("d", diagonal);

				  // Transition exiting nodes to the parent's new position.
				  link.exit().transition()
				      .duration(duration)
				      .attr("d", function(d) {
				        var o = {x: source.x, y: source.y};
				        return diagonal({source: o, target: o});
				      })
				      .remove();

				  // Stash the old positions for transition.
				  nodes.forEach(function(d) {
				    d.x0 = d.x;
				    d.y0 = d.y;
				  });
				}

				// Toggle children on click.
				function click(d) {
				  if (d.children) {
				    d._children = d.children;
				    d.children = null;
				  } else {
				    d.children = d._children;
				    d._children = null;
				  }
				  update(d);
				}

				// Go to item detail
				function dblclick(d) {
					ItemsInPage.renderItemDetail(d._jxid);
				}

				function color(d) {
				  return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
				}
				// E************** Generate the tree diagram	 *****************

			} else {
				backgroundPageConnection.postMessage({action: "log", msg: isException});
			}
		}
	);

}

