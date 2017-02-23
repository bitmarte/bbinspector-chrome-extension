window.CollapsiblePageGraph = {};

var backgroundPageConnection = chrome.runtime.connect({
    name: "devtools-page"
});

CollapsiblePageGraph.render = function() {
	backgroundPageConnection.postMessage({action: "log", msg: "render CollapsiblePageGraph"});
	$('#itemsInfoTable').html(Mustache.to_html(_templates.spinner));

	var treeData = [];

	chrome.devtools.inspectedWindow.eval(
		SerializerUtil.buildExpressionForEval("b$.portal.portalModel.firstChild"),
		function (result, isException) {
			if(!isException) {
				var firstChild = SerializerUtil.toObject(result);

				function traverse(node) {
					var tmpNode = {
						"name": node.name || "application",
						"parent": node.name == "" ? "application" : (node.parentItemName || "null")
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

				// ************** Generate the tree diagram	 *****************
				var width = 960,
				    height = 800,
				    root;

				var force = d3.layout.force()
				    .linkDistance(300)
				    .charge(-120)
				    .gravity(.05)
				    .size([width, height])
				    .on("tick", tick);

				$('#itemsInfoTable').html(Mustache.to_html(_templates.d3CollapsiblePageGraphStyle));
				var svg = d3.select("#itemsInfoTable").append("svg")
				    .attr("width", width)
				    .attr("height", height);

				var link = svg.selectAll(".link"),
				    node = svg.selectAll(".node");

				root = treeData[0];
				update();

				function update() {
				  var nodes = flatten(root),
				      links = d3.layout.tree().links(nodes);

				  // Restart the force layout.
				  force
				      .nodes(nodes)
				      .links(links)
				      .start();

				  // Update links.
				  link = link.data(links, function(d) { return d.target.id; });

				  link.exit().remove();

				  link.enter().insert("line", ".node")
				      .attr("class", "link");

				  // Update nodes.
				  node = node.data(nodes, function(d) { return d.id; });

				  node.exit().remove();

				  var nodeEnter = node.enter().append("g")
				      .attr("class", "node")
				      .on("click", click)
				      .call(force.drag);

				  nodeEnter.append("circle")
				      .attr("r", function(d) {
				      	var dim = Math.sqrt(d.size) / 10 || 4.5;
				      	if(d.name === "application") {
				      		dim = dim * 3;
				      	}
				      	return dim;
				  });

				  nodeEnter.append("text")
				      .attr("dy", ".35em")
				      .text(function(d) { return d.name; });

				  node.select("circle")
				      .style("fill", color);
				}

				function tick() {
				  link.attr("x1", function(d) { return d.source.x; })
				      .attr("y1", function(d) { return d.source.y; })
				      .attr("x2", function(d) { return d.target.x; })
				      .attr("y2", function(d) { return d.target.y; });

				  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
				}

				function color(d) {
					// leaf node
					var color = "#fd8d3c";
					if(d._children) {
						// collapsed package
						color = "#3182bd";
					} else if(d.children) {
						// expanded package
						color = "#c6dbef";
					}
					if(d.name === "application") {
						// application node, the root
						color = "#73FF00";
					}
					return color;
				}

				// Toggle children on click.
				function click(d) {
				  if (d3.event.defaultPrevented) return; // ignore drag
				  if (d.children) {
				    d._children = d.children;
				    d.children = null;
				  } else {
				    d.children = d._children;
				    d._children = null;
				  }
				  update();
				}

				// Returns a list of all nodes under the root.
				function flatten(root) {
				  var nodes = [], i = 0;

				  function recurse(node) {
				    if (node.children) node.children.forEach(recurse);
				    if (!node.id) node.id = ++i;
				    nodes.push(node);
				  }

				  recurse(root);
				  return nodes;
				}
							
			} else {
				backgroundPageConnection.postMessage({action: "log", msg: isException});
			}
		}
	);

}

