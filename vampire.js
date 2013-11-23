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
	this.goHunting;
	this.elm = function(name,props,style) {
		var el = document.createElement(name);
		for(var prop in props) if(props.hasOwnProperty(prop)) el[prop] = props[prop];
		for(var prop in style) if(style.hasOwnProperty(prop)) el.style[prop] = style[prop];
		return el;
	}
	this.showElement = function(id) {
		document.getElementById(id).className = "";
	}
	this.disableElement = function(id,txt) {
		document.getElementById(id).disabled = true;
		document.getElementById(id).innerHTML = txt;
	}
	this.alterHTML = function(id,txt) {
		document.getElementById(id).innerHTML = txt;
	}
	this.enableButton = function(id,e,txt) {
		var element = document.getElementById(id);
		if (engine.player.isDead() && engine.dayStatus != "night") 
			engine.elements.eventMsg("You are too weak to "+e+" until pure darkness allows it!");
		else {
			element.disabled = false;
			this.alterHTML(id,txt);
		}
	}
	this.addBorder = function(id) {
		document.getElementById(id).style.border = "1px solid black";
	}
	this.eventMsg = function(txt) {
		this.addBorder("msg");
		var temp = document.getElementById("msg");
		txt = "-"+txt+"<br />"+temp.innerHTML;
		temp.innerHTML = txt;
	}
	this.bloodButton = function() { 
		this.goHunting = this.elm("button",{innerHTML:"Hunt for Blood", id:"bloodButton"},{}); 
		document.body.appendChild(this.goHunting);
		this.goHunting.addEventListener("click",engine.player.hunt.bind());
	}
	this.raidButton = function() { 
		this.goRaiding = this.elm("button",{innerHTML:"Raid for Gold", id:"raidButton"},{}); 
		document.body.appendChild(this.goRaiding);
		this.goRaiding.addEventListener("click",engine.player.raid.bind());
	}
}

function _player() {
	this.hp = 20;
	this.hpMax = 20;
	this.bloodcount = 0;
	this.goldCount = 0;
	this.isDead = function() {
		if (this.hp <= 0) return true;
		else return false;
	}
	this.revive = function() {
		if (engine.dayStatus == "night") {
			engine.player.healDamage(1);
		}
	}
	this.healDamage = function(heal) {
		if ((this.hp+heal) > this.hpMax) this.hp = this.hpMax;
		else this.hp += heal;
	}
	this.triggerDeath = function(cause,bloodLoss) {
		engine.elements.eventMsg("You have died from: "+cause);
		engine.elements.eventMsg("Your death has cost you "+bloodLoss+" pints of your precious blood!");
		if (this.bloodcount < 20) this.bloodcount = 0;
		else this.bloodcount -= bloodLoss;
		engine.elements.alterHTML("blood",this.bloodcount);
	}
	this.dealDamage = function(dmg,type,bloodLossOnDeath) {
		if (!engine.firstHPLoss) {
			engine.firstHPLoss = true;
			engine.elements.showElement("hpDiv");
		}
		if ((this.hp-dmg) <= 0) {
			this.hp = 0;
			this.triggerDeath(type,bloodLossOnDeath);
		} else {
			this.hp -= dmg;
		}
	}
	this.hunt = function() {
		var bloodCollected = 0;
		engine.elements.alterHTML("bloodButton","Wait to hunt...");
		engine.elements.goHunting.disabled = true;
		if (engine.dayStatus == engine.statusCycle[0]) {
			this.dealDamage(10,"sunlight",20);
			engine.elements.eventMsg("Hunting in the daylight has hurt you! -10 HP!");
		} else {
			bloodCollected = 1*engine.multiplier;
			engine.player.bloodcount += bloodCollected;
			engine.elements.alterHTML("blood",engine.player.bloodcount);
			engine.elements.eventMsg("Your hunt yielded "+bloodCollected+" pint(s) of blood!");
			engine.player.healDamage(1);
			engine.elements.alterHTML("hp",engine.player.hp);
		}
	}
	this.raid = function() {
		engine.elements.showElement("goldDiv");
		var goldCollected;
		var hpLoss = 0;
		engine.elements.alterHTML("raidButton","Wait to raid...");
		engine.elements.goRaiding.disabled = true;
		if (engine.dayStatus == engine.statusCycle[0]) {
			engine.player.dealDamage(15,"sunlight");
			engine.elements.eventMsg("Raiding in the daylight has hurt you! -15 HP!");
		} else {
			hpLoss = Math.floor(Math.random()*(5-1+1)+1);
			goldCollected = Math.floor((Math.random()*100));
			engine.player.goldCount += goldCollected;
			engine.elements.alterHTML("gold",engine.player.goldCount);
			engine.elements.eventMsg("Your raid yielded "+goldCollected+" gold coins at the cost of "+hpLoss+"HP from the townspeople!");
			engine.player.dealDamage(hpLoss,"raiding",15);
			engine.elements.alterHTML("hp",engine.player.hp);
		}
	}
}

function _engine() {
	this.count = 0;
	this.cycleFlag = false;
	this.firstHPLoss = false;
	this.raidFlag = false;
	this.multiplier = 1;
	this.dayStatus = "dusk";
	this.statusCycle = [
		"day",
		"dusk",
		"night",
		"dawn"
	];
	this.huntStatus = {
		"day":0,
		"dusk":3,
		"night":4,
		"dawn":2
	};
	this.dayFlavor = [
		"The sun is bright outside..",
		"The sun is setting..",
		"The moon shines brightly..",
		"The sun is rising.."
	];
	this.player = (function(){ return new _player(); }());
	this.elements = (function(){ return new _elements(); }());
	this.triggers = function(c) {
		if (c == 5) this.elements.bloodButton();
		if (!(c%1) && c > 5) this.elements.enableButton("bloodButton","hunt","Hunt for Blood");
		if (!(c%1) && engine.player.bloodcount > 5) this.elements.enableButton("raidButton","raid","Raid for Gold");
		if (engine.player.bloodcount >= 5 && !this.raidFlag) {
			this.elements.raidButton();
			this.raidFlag = true;
		}
		if (engine.player.bloodcount >= 10 && !this.cycleFlag) {
			this.initDayCycle();
			this.cycleFlag = true;
		}
		if (!(c%10) && this.cycleFlag) this.nextDayCycle();
	}
	this.initDayCycle = function() {
		engine.elements.showElement("divCycle");
		engine.elements.alterHTML("cycle",this.dayStatus);
		engine.multiplier = 3;
	}
	this.nextDayCycle = function() {
		var index = this.statusCycle.indexOf(this.dayStatus);
		var cycleNext = this.statusCycle[(index+1)];
		if (cycleNext) {
			this.dayStatus = cycleNext;
			this.multiplier = this.huntStatus[cycleNext];
		}
		else {
			this.dayStatus = this.statusCycle[0];
			this.multiplier = this.huntStatus[this.dayStatus];
		}
		engine.elements.alterHTML("cycle",this.dayStatus);
		var newIndex = this.statusCycle.indexOf(this.dayStatus);
		engine.elements.eventMsg(this.dayFlavor[newIndex]);
	}
}

var engine = (function(){ return new _engine(); }());

setInterval(function() { 
	engine.count++;
	engine.elements.alterHTML("counter",engine.count);
	engine.triggers(engine.count);
	if (engine.player.isDead()) {
		engine.elements.disableElement("bloodButton","You are dead..");
		engine.elements.disableElement("raidButton","You are dead..");
		engine.player.revive();
	}
}, 1000);