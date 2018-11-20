let NS = "http://www.w3.org/2000/svg";
let NODE_G = "ffcmd_g_";
var node_g = 0;
function nodeid(){
	node_g++;
	return NODE_G + node_g;
}
var FF_NODE_TYPE = {};
FF_NODE_TYPE.TEXT="text";

var FFNodeRectTypes = new Array();
FF_NODE_TYPE.ROOT="root";
FFNodeRectTypes.push(FF_NODE_TYPE.ROOT);

FF_NODE_TYPE.INPUT="input";
FFNodeRectTypes.push(FF_NODE_TYPE.INPUT);

FF_NODE_TYPE.OUTPUT="output";
FFNodeRectTypes.push(FF_NODE_TYPE.OUTPUT);

FF_NODE_TYPE.DEMUXER="demuxer";
FFNodeRectTypes.push(FF_NODE_TYPE.DEMUXER);

FF_NODE_TYPE.MUXER="muxer";
FFNodeRectTypes.push(FF_NODE_TYPE.MUXER);

FF_NODE_TYPE.ENCODER="encoder";
FFNodeRectTypes.push(FF_NODE_TYPE.ENCODER);

let FFCmdDef={
	spacing:{
		x:10,
		y:20,
	},
	rect:{
		width:80,
		height:30,
		text:{
			
		},
	},
};

//function FFCmdNode(type){
//	if(FFNodeTypes.indexOf(type) == -1){
//		return null;
//	}
//	var obj = new Object();
//	obj.type = type;
//	obj.element;
//	obj.in_pin = 0;
//	obj.out_pin = 1;
//	return obj;
//}

//function FFCmdGetRect(){
//	
//}

function FFCmdNodeOnMouseDown(){
	
}

function FFCmdNodeOnMouseUp(){
	
}
var NodeNumber = 1;
function FFCmdNewNumber(){
	return NodeNumber++;
}
function FFCmdCreateNode(doc, type){
	var elem = null;
	
	if(FFNodeRectTypes.indexOf(type) != -1){
		var g = doc.createElementNS(NS, 'g');
		g.setAttribute("id", nodeid());
		var txt = FFCmdCreateTextElem(doc);
		var rect = FFCmdCreateRectElem(doc);
		txt.textContent = "新节点" + FFCmdNewNumber();
		g.appendChild(rect);
		g.appendChild(txt);
		g.outputs = new Array();
		g.inputs = new Array();
		doc.rootElement.appendChild(g);
		elem = g;
	}
	if(elem){
		elem.move = function(x, y){
			elem.childNodes[0].setAttribute("x", x);
			elem.childNodes[0].setAttribute("y", y);
			if(elem.childNodes[1]){
				var r = elem.rect();
				var xx = r.x + r.width / 2;
				var yy = r.y + r.height / 2;
				elem.childNodes[1].setAttribute("x", xx);
				elem.childNodes[1].setAttribute("y", yy);
			}
		};
		elem.moveto = function(x, y){
			var r = elem.rect();
			elem.move(r.x + x, r.y + y);
		};
		elem.groupmove = function(x, y){
			var r = elem.rect();
			var mx = x - r.x;
			var my = y - r.y;
			elem.move(x, y);
			elem.outputs.forEach(function(v){
				v.groupmoveto(mx, my);
			});
		};
		elem.groupmoveto = function(x, y){
			console.log("groupmoveto" + x + "," + y);
			elem.moveto(x, y);
			elem.outputs.forEach(function(v){
				v.groupmoveto(x, y);
			});
		};
		elem.rect = function(){
			var rect = new Object();
			rect.x = elem.childNodes[0].x.baseVal.value;
			rect.y = elem.childNodes[0].y.baseVal.value;
			rect.width = elem.childNodes[0].width.baseVal.value;;
			rect.height = elem.childNodes[0].height.baseVal.value;;
			
			rect.top = rect.y;
			rect.bottom = rect.y + rect.height;
			rect.left = rect.x;
			rect.right = rect.x + rect.width;
			return rect;
		};
		
		elem.grouprect = function(){
			var rect = elem.rect();
			var group = {};
			group.x = rect.x;
			group.y = rect.x;
			group.right = rect.right;
			group.bottom = rect.bottom;
			elem.outputs.forEach(function(v){
				var r = v.rect();
				if(r.x > group.x){
					group.x = r.x;
				}
				if(r.y > group.y){
					group.y = r.y;
				}
				if(r.right > group.right){
					group.right = r.right;
				}
				if(r.bottom > group.bottom){
					group.bottom = r.bottom;
				}
			})
			group.top = group.y;
			group.left = group.x;
			group.width = group.right - group.x;
			group.height = group.bottom - group.y;
			return group;
		};
		elem.move(0, 0);
	}
	return elem;
}

function FFCmdCreateRectElem(doc){
	var elem = doc.createElementNS(NS, "rect");
	elem.setAttribute("width", FFCmdDef.rect.width);
	elem.setAttribute("height", FFCmdDef.rect.height);
	elem.setAttribute("x", 0);
	elem.setAttribute("y", 0);
	return elem;
}

function FFCmdCreateLineElem(doc){
	var elem = doc.createElementNS(NS, "line");
	return elem;
}

function FFCmdCreateTextElem(doc){
	var elem = doc.createElementNS(NS, "text");
	return elem;
}

function FFInput(type){
	var obj = new Object();
	obj.type = type;
	obj.in_pin = 0;
	obj.out_pin = 1;
	return obj;
}

function FFAutoLayout(elem){
	if(elem.autoLayout == undefined){
		
	}
}
function FFCmdSvgInit(svg){
	svg.press = false;
	svg.drapX = 0;
	svg.drapY = 0;
	svg.drapElem = null;
	svg.drapElemX = null;
	svg.drapElemY = null;
	svg.inputs = new Array();
	var doc = svg.getSVGDocument();
	doc.onmousedown = function(e){
		if(e.button == 0){//左键
			var g = null;
			if(e.target.nodeName == "text" || e.target.nodeName == "rect"){
				var id = e.target.parentNode.getAttribute("id");
				if(id && id.indexOf(NODE_G) != 0){
					return;
				}
				g = e.target.parentNode;
			}else if(e.target.nodeName == "g"){
				var id = e.target.getAttribute("id");
				if(id && id.indexOf(NODE_G) != 0){
					return;
				}
				g = e.target;
			}
			if(g){
				svg.drapElem = g;
				var r = g.rect();
				svg.drapElemX = r.x;
				svg.drapElemY = r.y;
				svg.drapX = e.x;
				svg.drapY = e.y;
				svg.press = true;
				//svg.drapElem.getfocus();
				console.log("button down,x=" + e.x + ",y=" + e.y);
			}
		}else if(e.button == 2){//右键
			
		}
	}
	doc.onmousemove = function(e){
		//console.log(e.button);
		if(e.button == 0){
			if(svg.press && svg.drapElem){
	
				svg.drapElem.groupmoveto(e.x - svg.drapX, e.y - svg.drapY);
				svg.drapX = e.x;
				svg.drapY = e.y;
				console.log("x="+(svg.drapElemX + (e.x - svg.drapX))+"y="+(svg.drapElemX + (e.y - svg.drapY)) + "dx=" +svg.drapX + "dy="+svg.drapY);
			}
		}
	}
	doc.onmouseup = function(e){
		if(e.button == 0){
			//svg.drapElem.losefocus();
			svg.press = false;
			svg.drapElem = null;
		}
	}
}

function FFCmd(svg){
	var doc = svg.getSVGDocument();
	//var doc = svg.document;
	FFCmdSvgInit(svg);
	
	svg.inputs = new Array();
	
	svg.addVideoSource = function(){
		var elem = FFCmdCreateNode(doc, FF_NODE_TYPE.INPUT);
		if(svg.inputs.length > 0){
			var last = svg.inputs[svg.inputs.length - 1];
			var last_rect = last.grouprect();
			elem.move(last_rect.x, last_rect.bottom + FFCmdDef.spacing.y);
		}
		svg.inputs.push(elem);
	}
	
	svg.addAudioSource = function(){
		var elem = FFCmdCreateNode(doc, FF_NODE_TYPE.INPUT);
		doc.rootElement.appendChild(elem);
		svg.inputs.push(elem);
	}
	
	svg.autoLayout = function(){
		
	}
	
	svg.onLclick = function(){
		
	}
	svg.onRclick = function(){
		
	}
	return svg;
}


