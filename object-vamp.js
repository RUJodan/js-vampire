function _elements() {
	this.counter;
	this.blood;
	this.gold;
	this.spanHP;
	this.divHP;
	this.bloodElement;
	this.raidElement;
	this.msg;
	this.goldDiv;
	this.day;
	this.cycle;
	this.elm = function(name,props,style) {
		var el = document.createElement(name);
		for(var prop in props) if(props.hasOwnProperty(prop)) el[prop] = props[prop];
		for(var prop in style) if(style.hasOwnProperty(prop)) el.style[prop] = style[prop];
		return el;
	}
	this.alterHTML = function(id,txt) {
		document.getElementById(id).innerHTML = txt;
	}
	this.enableButton = function(id,e,txt) {
		var element = document.getElementById(id);
		element.disabled = false;
		this.alterHTML(id,txt);
		/*if (_player.isDead() && dayStatus != "night") addEventMsg("You are too weak to "+bEvent+" until pure darkness allows it!");
		else {
			element.disabled = false;
			element.innerHTML = newTxt;
		}*/
	}
	this.addBorder = function(id) {
		document.getElementById(id).style.border = "1px solid black";
	}
	this.eventMsg = function(txt) {
		var temp = document.getElementById(id);
		txt = "-"+txt+"<br />"+temp.innerHTML;
		temp.innerHTML = txt;
	}
	this.bloodButton = function() { 
		var goHunting = this.elm("button",{innerHTML:"Hunt for Blood", id:"bloodButton"},{}); 
		document.body.appendChild(goHunting);
		goHunting.addEventListener("click",hunt.bind());
	}
}

function _engine() {
	this.count = 0;
	this.player = (function(){ return new _player(); }());
	this.elements = (function(){ return new _elements(); }());
	this.triggers = function(c) {
		if (c == 5) this.elements.bloodButton();
	}
}

function _player() {
	this.hp = 20;
	this.hpMax = 20;
	this.isDead = function() {
		if (this.hp < 0) return true;
		else return false;
	}
}

var engine = (function(){ return new _engine(); }());

setInterval(function() { 
	engine.count++;
	engine.elements.alterHTML("counter",engine.count);
	engine.triggers(engine.count);
}, 1000);