let NS = "http://www.w3.org/2000/svg";


let NODE_G = "node_g_";

let MENU = "menu_";
let MENU_G = MENU+"g_";
let MENU_UI = MENU + "ui_";
let MENU_UI_G = MENU_UI + "g_";

let MENU_TXT = MENU + "txt_";
let MENU_TXT_G = MENU_TXT + "g_";

var ID_NUMBER = 0;

var SIN45 = Math.sin(45 * 0.017453293);
var FFCMD_CONFIG = null;

function newid(prefix){
	ID_NUMBER ++;
	return prefix + ID_NUMBER;
}

var FF_NODE_TYPE = {};
FF_NODE_TYPE.INPUT="input";
FF_NODE_TYPE.OUTPUT="output";
FF_NODE_TYPE.CODEC="codec";
FF_NODE_TYPE.STREAM = "stream";
FF_NODE_TYPE.FILTER = "filter";

FF_NODE_TYPE.TEXT="text";
FF_NODE_TYPE.ROOT="root";
FF_NODE_TYPE.MUXER="muxer";
FF_NODE_TYPE.MENU="menu";

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
	menu:{
		r:50,	
	},
};

//菜单的动作
let FFCMD_MENU_ACTION = {
	//属性子菜单
	menu_attr:function(node_g){
		console.log("menu_attr");
		var node_cfg = FFCMD_CONFIG.getNode(node_g.type);
	},
	menu_stream:function(node_g){
		console.log("menu_stream");
	},
	menu_link:function(node_g){
		console.log("menu_link");
	},
	menu_filter:function(node_g){
		console.log("menu_filter");
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

var NodeNumber = 1;
function FFCmdNewNumber(){
	return NodeNumber++;
}

function FFCmdShowEditBox(doc, elem){
	if(doc.edit_box == null || doc.edit_box == undefined){
		doc.edit_box = doc.page_doc.getElementById("edit_box");
	}
	var bbox = elem.getBBox();
	var x = bbox.x + doc.parent.offsetLeft;
	var y = bbox.y + doc.parent.offsetTop;
	if(elem.reg){
		doc.edit_box.reg = elem.reg;
	}
	doc.edit_box.innerText = Math.random();
	doc.edit_box.setAttribute("style", "background:#fff;position:absolute;left:"+x+"px;top:"+y+"px;min-width:"+bbox.width + "px;min-height:" + bbox.height+"px");
	doc.edit_box.addEventListener("beforeprint", function(e){
		console.log("-" + this.textContent);
	});
	doc.edit_box.addEventListener("input", function(e){
		console.log(e);
		if(this.textContent == ""){
			this.last = this.textContent;
			return;
		}
		if(this.reg && this.reg.test(this.textContent) == false){
			if(this.last){
				this.textContent = this.last;
			}else{
				this.textContent = "";
			}
		}else{
			this.last = this.textContent;
		}
	});
}

function FFCmdCreateNodeMenu(doc, node){
	var path = null;
	var d = "";
	var r = FFCmdDef.menu.r;
	var Q = parseInt(SIN45 * r);

	var cfg = FFCMD_CONFIG.getMenu(node.type);
	var points = [{
		a:{x:-Q,y:-Q},
		b:{x:2*Q,y:0},
		m:{x:-Q,y:Q},
	},{
		a:{x:Q,y:-Q},
		b:{x:0,y:2*Q},
		m:{x:-Q,y:-Q}
	},{
		a:{x:Q,y:Q},
		b:{x:-2*Q,y:0},
		m:{x:Q,y:-Q},
	},{
		a:{x:-Q,y:Q},
		b:{x:0,y:-2*Q},
		m:{x:Q,y:Q}
	}];
	//创建根节点
	var g = doc.createElementNS(NS, "g");
	g.setAttribute("id", newid(MENU_G));
	//创建四个选项的ui
	var path_g = doc.createElementNS(NS, "g");
	path_g.setAttribute("id", newid(MENU_UI_G));
	for(var i = 0; i < points.length; i++){
		var pt = points[i];
		d = "m 0 0 l " + pt.a.x + " " + pt.a.y + " a " + r + " " + r + " 0 0 1 " + pt.b.x + " " + pt.b.y + " m " + pt.m.x + " " + pt.m.y + " z";
		path = doc.createElementNS(NS, "path");
		var action  = FFCMD_MENU_ACTION[cfg[i].action];
		path.action = action;
		path.setAttribute("id", newid(MENU_UI));
		path.index = i;
		path.action_node = node;
		path.g = g;
		path.focusin = function(){
			var path_style = FFCMD_CONFIG.getStyle("menu_path");
			for(var t = 0; t < path_style.focus.length; t++){
				this.setAttribute(path_style.focus[t].name, path_style.focus[t].value);
			}
		}
		path.focusout = function(){
			var path_style = FFCMD_CONFIG.getStyle("menu_path");
			for(var t = 0; t < path_style.normal.length; t++){
				this.setAttribute(path_style.normal[t].name, path_style.normal[t].value);
			}
		}
		path.focusout();
		path.setAttribute("d", d);
		path_g.appendChild(path);	
	}
	
	//创建四个选项的文字
	var text_g = doc.createElementNS(NS, "g");
	text_g.setAttribute("id", newid(MENU_TXT_G));
	for(var i = 0; i < 4; i ++){
		var txt = FFCmdCreateTextElem(doc);
		var action  = FFCMD_MENU_ACTION[cfg[i].action];
		txt.action = action;
		txt.index = i;
		txt.action_node = node;
		txt.g = g;
		txt.setAttribute("id", newid(MENU_TXT));
		txt.focusin = function(){
			var txt_style = FFCMD_CONFIG.getStyle("menu_text");
			for(var t = 0; t < txt_style.focus.length; t++){
				this.setAttribute(txt_style.focus[t].name, txt_style.focus[t].value);
			}
		}
		txt.focusout = function(){
			var txt_style = FFCMD_CONFIG.getStyle("menu_text");
			for(var t = 0; t < txt_style.normal.length; t++){
				this.setAttribute(txt_style.normal[t].name, txt_style.normal[t].value);
			}
		}
		txt.focusout();
		text_g.appendChild(txt);
	}
	for(var i = 0; i < 4 && i < cfg.length; i++){
		text_g.childNodes.item(i).textContent = cfg[i].name;
	}

	g.appendChild(path_g);
	g.appendChild(text_g);
	g.focus = function(index){
		if(g.focus_path){
			g.focus_path.focusout();
			g.focus_path = null;
		}
		if(g.focus_text){
			g.focus_text.focusout();
			g.focus_text = null;
		}
		if(index < 0 || index > 4){
			return;
		}
		var p = path_g.childNodes[index];
		var t = text_g.childNodes[index];
		p.focusin();
		t.focusin();
		g.focus_path = p;
		g.focus_text = t;
	}
	g.move = function(x, y){
		for(var i = 0; i < g.childNodes.length; i++){
			var elem = g.childNodes.item(i);
			if(elem.tagName == "g") {
				if(elem.getAttribute("id").indexOf(MENU_TXT_G) == 0){
					g.movetxt(elem, x, y);
				}else if(elem.getAttribute("id").indexOf(MENU_UI_G) == 0){
					g.moveui(elem, x, y);
				}
			}
		}
	}
	g.movetxt = function(txt_g, x, y){
		if(txt_g.tagName == "g" && txt_g.getAttribute("id").indexOf(MENU_TXT_G) == 0){
			var box = g.getBBox();
			
			var item = txt_g.childNodes.item(0);
			item.setAttribute("x", x);
			item.setAttribute("y", y - box.height / 4);
			
			item = txt_g.childNodes.item(1);
			item.setAttribute("x", x + box.width / 4);
			item.setAttribute("y", y);
			
			item = txt_g.childNodes.item(2);
			item.setAttribute("x", x);
			item.setAttribute("y", y + box.height / 4);
			
			item = txt_g.childNodes.item(3);
			item.setAttribute("x", x - box.width / 4);
			item.setAttribute("y", y);
		}
	}
	g.moveui = function(ui_g, x,y){
		if(ui_g.tagName == "g" && ui_g.getAttribute("id").indexOf(MENU_UI_G) == 0){//移动ui
			for(var i = 0; i < ui_g.childNodes.length; i++){
				var item = ui_g.childNodes.item(i);
				var d = item.getAttribute("d"); 
				var idx = d.indexOf("l");
				d = "M "+ x + " " + y + " " + d.slice(idx);
				item.setAttribute("d", d);
			}
		}
	}

	doc.rootElement.appendChild(g);
	return g;
}

function FFCmdCreateNode(doc, type){
	var elem = null;
	var g = doc.createElementNS(NS, 'g');
	g.setAttribute("id", newid(NODE_G));
	var txt = FFCmdCreateTextElem(doc);
	var rect = FFCmdCreateRectElem(doc);
	txt.textContent = "新节点" + FFCmdNewNumber();
	g.appendChild(rect);
	g.appendChild(txt);
	g.type = type;
	g.config = FFCMD_CONFIG.getNode(type);
	g.outputs = new Array();
	g.inputs = new Array();
	doc.rootElement.appendChild(g);
	if(g){
		g.focusin = function(){
			var sty = FFCMD_CONFIG.getStyle("node");
			sty.focus.forEach(function(item){
				rect.setAttribute(item.name, item.value);
			});
			sty = FFCMD_CONFIG.getStyle("node_text");
			sty.focus.forEach(function(item){
				txt.setAttribute(item.name, item.value);
			});
		}
		g.focusout = function(){
			var sty = FFCMD_CONFIG.getStyle("node");
			sty.normal.forEach(function(item){
				rect.setAttribute(item.name, item.value);
			});
			sty = FFCMD_CONFIG.getStyle("node_text");
			sty.normal.forEach(function(item){
				txt.setAttribute(item.name, item.value);
			});
		}
		g.move = function(x, y){
			rect.setAttribute("x", x);
			rect.setAttribute("y", y);
			var r = g.rect();
			var xx = r.x + r.width / 2;
			var yy = r.y + r.height / 2;
			txt.setAttribute("x", xx);
			txt.setAttribute("y", yy);
		};
		g.moveto = function(x, y){
			var r = g.rect();
			g.move(r.x + x, r.y + y);
		};
		g.groupmove = function(x, y){
			var r = elem.rect();
			var mx = x - r.x;
			var my = y - r.y;
			elem.move(x, y);
			elem.outputs.forEach(function(v){
				v.groupmoveto(mx, my);
			});
		};
		g.groupmoveto = function(x, y){
			console.log("groupmoveto" + x + "," + y);
			g.moveto(x, y);
			g.outputs.forEach(function(v){
				v.groupmoveto(x, y);
			});
		};
		g.rect = function(){
			var r = rect.getBBox();
//			r.x = rect.x.baseVal.value;
//			r.y = rect.y.baseVal.value;
//			r.width = rect.width.baseVal.value;
//			r.height = rect.height.baseVal.value;
			
			r.top = r.y;
			r.bottom = r.y + r.height;
			r.left = r.x;
			r.right = r.x + r.width;
			return r;
		};
		
		g.grouprect = function(){
			var gr = g.rect();
			var group = {};
			group.x = gr.x;
			group.y = gr.x;
			group.right = gr.right;
			group.bottom = gr.bottom;
			g.outputs.forEach(function(v){
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
		g.focusout();
		g.move(0, 0);
	}
	return g;
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

function FFCmdCreatePathElem(doc){
	var elem = doc.createElementNS(NS, "path");
}

function FFCmdCreateCircleElem(doc){
	var elem = doc.createElementNS(NS, "circle");
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

function FFCmdShowMenu(doc, x, y, tag){
	if(doc.menu == null){
		return;
	}
	if(tag && tag.menu_items){
		doc.menu.setItems(tag.menu_items);
	}
	if(x < FFCmdDef.menu.r){
		x = FFCmdDef.menu.r;
	}
	if(y < FFCmdDef.menu.r){
		y = FFCmdDef.menu.r;
	}
	doc.menu.move(x, y);
}

function FFCmdHiddenMenu(doc){
	if(doc.menu){
		var s = doc.rootElement;
		var nodes = s.childNodes;
		var del = null;
		for(var i = 0; i < nodes.length; i++){
			var item = nodes.item(i);
			if(item.tagName == "g" && item.getAttribute("id").indexOf(MENU_G) == 0){
				del = item;
				break;
			}
		}
		if(del){
			s.removeChild(del);
			doc.menu = null;
		}
	}
}

function eventPathPass(e, id_prefix){
	for(var i = 0; i < e.path.length; i++){
		var item = e.path[i];
		if(item.getAttribute){
			var id = item.getAttribute("id");
			if(id && id.indexOf(id_prefix) == 0){
				return item;
			}
		}
	}
	return null;
}

function FFCmdDocInit(doc){
	doc.press = false;
	doc.drapX = 0;
	doc.drapY = 0;
	doc.drapElem = null;
	doc.drapElemX = null;
	doc.drapElemY = null;
	doc.inputs = new Array();
	doc.menu = null;
	doc.curr_node = null;
	doc.oncontextmenu = function(){
    		return false;
	}
	doc.ondblclick = function(e){
		if(e.button == 0){//左键
			var g = eventPathPass(e, NODE_G);
			if(g){
				
				g.reg = new RegExp("^0");
				FFCmdShowEditBox(doc, g);
			}
		}
	}
	doc.onmousedown = function(e){
		if(e.button == 0){//左键
			var g = null;
			//菜单
			g = eventPathPass(e, MENU_G);
			if(g){
				if(e.target.g && e.target.index != undefined){
					g.focus(e.target.index);
				}
				if(e.target.action && e.target.action_node){
					e.target.action(e.target.action_node);
				}
				return;
			}
			//节点
			g = eventPathPass(e, NODE_G);
			if(g){
				if(doc.curr_node){
					doc.curr_node.focusout();
					doc.curr_node;
				}
				g.focusin();
				doc.curr_node = g;
				
				doc.drapElem = g;
				var r = g.rect();
				doc.drapElemX = r.x;
				doc.drapElemY = r.y;
				doc.drapX = e.x;
				doc.drapY = e.y;
				doc.press = true;
				//svg.drapElem.getfocus();
				console.log("button down,x=" + e.x + ",y=" + e.y);
				return;
			}
			
			
			//没有点击任何元素
			if(doc.menu){
				FFCmdHiddenMenu(doc);
			}else if(doc.curr_node){
				doc.curr_node.focusout();
				doc.curr_node = null;
			}
		}else if(e.button == 2){//右键
			var g = eventPathPass(e, NODE_G);
			if(g){
				if(doc.menu){
					FFCmdHiddenMenu();
				}
				g.focusin();
				doc.curr_node = g;
				doc.menu = FFCmdCreateNodeMenu(doc, g);
				FFCmdShowMenu(doc, e.x, e.y);
			}
		}
	}
	doc.onmousemove = function(e){
		//console.log(e.button);
		if(e.button == 0){
			g = eventPathPass(e, MENU_G);
			if(g){
				if(e.target.g && e.target.index != undefined){
					g.focus(e.target.index);
				}
				return;
			}
			if(doc.press && doc.drapElem){
	
				doc.drapElem.groupmoveto(e.x - doc.drapX, e.y - doc.drapY);
				doc.drapX = e.x;
				doc.drapY = e.y;
				console.log("x="+(doc.drapElemX + (e.x - doc.drapX))+"y="+(doc.drapElemX + (e.y - doc.drapY)) + "dx=" +doc.drapX + "dy="+doc.drapY);
			}
		}
	}
	doc.onmouseup = function(e){
		if(e.button == 0){
			//svg.drapElem.losefocus();
			doc.press = false;
			doc.drapElem = null;
		}
	}
	doc.onkeydown = function(e){
		console.log(e.keyCode);
		if(e.keyCode == 32){//空格
			if(doc.curr_node){
				if(!doc.menu){
					var r = doc.curr_node.rect();
					doc.menu = FFCmdCreateNodeMenu(doc, doc.curr_node); 
					FFCmdShowMenu(doc, r.x+r.width/2, r.y+r.height/2);
				}
				
			}
		}else if(e.keyCode == 37){//左
			if(doc.menu){
				doc.menu;
			}
		}else if(e.keyCode == 38){//上
			if(doc.menu){
				
			}
		}else if(e.keyCode == 39){//右
			if(doc.menu){
				
			}
		}else if(e.keyCode == 40){//下
			
		}
	}
	doc.onkeyup = function(e){
		
	}
	doc.onkeypress = function(e){
		
		if(doc.menu){
			
		}
		if(doc.curr_node){
			
		}else{
			
		}
		
	}
}

function FFCmd(page_doc, parent, config){
	FFCMD_CONFIG = config;
	var doc = parent.getSVGDocument();
	doc.page_doc = page_doc;
	doc.parent = parent;
	FFCmdDocInit(doc);
	doc.inputs = new Array();
	doc.addVideoSource = function(){
		var elem = FFCmdCreateNode(doc, FF_NODE_TYPE.INPUT);
		if(doc.inputs.length > 0){
			var last = doc.inputs[doc.inputs.length - 1];
			var last_rect = last.grouprect();
			elem.move(last_rect.x, last_rect.bottom + FFCmdDef.spacing.y);
		}
		
		elem.menu_items = ["删除", "下级", "链接", "重复"];
		doc.inputs.push(elem);
	}
	
	doc.addAudioSource = function(){
		var elem = FFCmdCreateNode(doc, FF_NODE_TYPE.INPUT);
		doc.rootElement.appendChild(elem);
		doc.inputs.push(elem);
	}
	
	doc.autoLayout = function(){
		
	}
	
	doc.onLclick = function(){
		
	}
	doc.onRclick = function(){
		
	}
	return doc;
}


