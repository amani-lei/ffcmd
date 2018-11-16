let NS = "http://www.w3.org/2000/svg";

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

let SVG={
	spacing:{
		x:10,
		y:20,
	},
	rect:{
		width:80,
		height:30,
		fill:"rgb(100,100,100)",
		stroke:"rgb(0,0,0)",
		text:{
			fill:'rgb(0,0,255)',	
			stroke:"rgb(0,0,0)",
			stroke_width:".5",
		},
	},
	line:{
		stroke:"rgb(0,0,0)",
		stroke_width:1,
	}
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

function FFCmdCreateNode(doc, type){
	var elem = null;
	if(FFNodeRectTypes.indexOf(type) != -1){
		var txt = FFCmdCreateTextElem(doc, SVG.rect.text);
		
		elem = FFCmdCreateRectElem(doc, SVG.rect);
		doc.rootElement.appendChild(txt);
		doc.rootElement.appendChild(elem);
		
		
		elem.text = txt;
	}
	return elem;
}

function FFCmdCreateRectElem(doc, style){
	var elem = doc.createElementNS(NS, "rect");
	elem.setAttribute('width', style.width);
	elem.setAttribute('height', style.height);
	elem.setAttribute('fill', style.fill);
	elem.setAttribute('stroke', style.stroke);
	return elem;
}

function FFCmdCreateLineElem(doc, style){
	var elem = doc.createElementNS(NS, "line");
	elem.setAttribute('stroke', style.stroke);
	elem.setAttribute('stroke-width', style.stroke_width);
	return elem;
}

function FFCmdCreateTextElem(doc, style){
	var elem = doc.createElementNS(NS, "text");
	elem.setAttribute('fill', style.fill);
	elem.setAttribute('stroke', style.stroke);
	elem.setAttribute('stroke-width', style.stroke_width);
	elem.setAttribute('x', 50);
	elem.setAttribute('y', 50);
	elem.textContent = "123";
	elem.x.baseVal.value = 100;
	elem.y.baseVal.value = 100;
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
			if(e.target && e.target.tagName == "rect"){
				e.target.textContent = "11111";
				svg.drapElem = e.target;
				svg.drapElemX = svg.drapElem.x.baseVal.value;
				svg.drapElemY = svg.drapElem.y.baseVal.value;
				svg.drapX = e.x;
				svg.drapY = e.y;
				svg.press = true;
			}
		}else if(e.button == 2){//右键
			
		}
	}
	doc.onmousemove = function(e){
		console.log(e.button);
		if(e.button == 0){
			if(svg.press && svg.drapElem){
				svg.drapElem.x.baseVal.value = svg.drapElemX + (e.x - svg.drapX);
				svg.drapElem.y.baseVal.value = svg.drapElemY + (e.y - svg.drapY);
			}
		}
	}
	doc.onmouseup = function(e){
		console.log(e.button);
		if(e.button == 0){
			svg.press = false;
			svg.drapElem = null;
		}
	}
	doc.onclick = function(e){
		if(e.button == 0){
			if(e.target && e.target.tagName == "rect"){
					svg.drapElem = e.target;
			}			
		}else if(e.button == 2){
			console.log(e.button);
		}
	}
	
	doc.onkeydown
}

function FFCmd(svg){
	var doc = svg.getSVGDocument();
	//var doc = svg.document;
	FFCmdSvgInit(svg);
	
	svg.inputs = new Array();
	
	svg.addVideoSource = function(){
		var elem = FFCmdCreateNode(doc, FF_NODE_TYPE.INPUT);
		doc.rootElement.appendChild(elem);
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


