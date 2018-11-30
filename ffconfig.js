function FFConfig(json){
	json.getCodec = function(codec_name){
		return json.codecs[codec_name];
	}
	json.getNode = function(node_type){
		return json.nodes[node_type];
	}
	json.getMenu = function(node_type){
		return json.menus[node_type];
	}
	json.getStyle = function(elem_type){
		return json.styles[elem_type];
	}
	return json;
}
