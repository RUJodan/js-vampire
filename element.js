function _element() {
	this.bloodElement;
	this.raidElement;
	this.goHunting;
	this.goRaiding;
}

_element.prototype = {
	initCounter : function() {
		document.getElementById("spanCounter").style.display = "block";
		document.getElementById("spanInitMsg").style.display = "none";
	},
	pluralize : function(id) {
		document.getElementById(id).innerHTML = "s";
	},
	alterHTML : function(id,txt) {
		document.getElementById(id).innerHTML = txt;
	},
	makeElement : function(name,props,style) {
		var el = document.createElement(name);
		for(var prop in props) if(props.hasOwnProperty(prop)) el[prop] = props[prop];
		for(var prop in style) if(style.hasOwnProperty(prop)) el.style[prop] = style[prop];
		return el;
	},
	showElement : function(id,style) {
		document.getElementById(id).style.display = style;
	},
	disableElement : function(id,txt) {
		var element = document.getElementById(id);
		element.disabled = true;
		element.innerHTML = txt;
		element.style.color = "#666666";
	},
	enableButton : function(id,e,txt) {
		var element = document.getElementById(id);
		if (engine.player.isDead() && engine.dayStatus != "night") 
			this.eventMsg("You are too weak to <span>"+e+"</span> until pure darkness allows it!");
		else {
			element.disabled = false;
			this.alterHTML(id,txt);
			element.style.color = "#BB0000";
		}
	},
	addBorder : function(id) {
		document.getElementById(id).style.border = "1px solid black";
	},
	eventMsg : function(txt) {
		this.showElement("log","inline-table");
		var msg = document.getElementById("msg");
		txt = "-"+txt+"<br />"+msg.innerHTML;
		msg.innerHTML = txt;
	},
	bloodButton : function() { 
		this.goHunting = this.makeElement("button",{innerHTML:"Hunt for Blood", id:"bloodButton"},{}); 
		document.getElementById("stats").appendChild(this.goHunting);
		this.goHunting.addEventListener("click",engine.player.hunt.bind());
	},
	raidButton : function() { 
		this.goRaiding = this.makeElement("button",{innerHTML:"Raid for Gold", id:"raidButton"},{}); 
		document.getElementById("stats").appendChild(this.goRaiding);
		this.goRaiding.addEventListener("click",engine.player.raid.bind());
	}
}