function _player() {
	this.hp = 20;
	this.hpMax = 20;
	this.bloodcount = 0;
	this.goldCount = 0;
}

_player.prototype = {
	isDead : function() {
		if (this.hp <= 0) return true;
		else return false;
	},
	revive : function() {
		if (engine.dayStatus == "night") {
			this.healDamage(1);
		}
	},
	healDamage : function(heal) {
		if ((this.hp+heal) > this.hpMax) this.hp = this.hpMax;
		else this.hp += heal;
		engine.elements.alterHTML("hp",this.hp);
	},
	triggerDeath : function(cause,bloodLoss) {
		engine.elements.eventMsg("You have died from: "+cause);
		engine.elements.eventMsg("Your death has cost you "+bloodLoss+" pints of your precious blood!");
		if (this.bloodcount < 20) this.bloodcount = 0;
		else this.bloodcount -= bloodLoss;
		engine.elements.alterHTML("blood",this.bloodcount);
	},
	dealDamage : function(dmg,type,bloodLossOnDeath) {
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
	},
	hunt : function() {
		var bloodCollected = 0;
		engine.elements.alterHTML("bloodButton","Wait to hunt...");
		engine.elements.disableElement("bloodButton");
		if (engine.dayStatus == engine.statusCycle[0]) {
			this.dealDamage(10,"sunlight",20);
			engine.elements.eventMsg("Hunting in the daylight has hurt you! -10 HP!");
		} else {
			bloodCollected = 1*engine.multiplier;
			this.bloodcount += bloodCollected;
			console.log(bloodCollected);
			engine.elements.alterHTML("blood",this.bloodcount);
			engine.elements.eventMsg("Your hunt yielded "+bloodCollected+" pint(s) of blood!");
			this.healDamage(1);
		}
	},
	raid : function() {
		engine.elements.showElement("goldDiv");
		var goldCollected;
		var hpLoss = 0;
		engine.elements.alterHTML("raidButton","Wait to raid...");
		engine.elements.disableElement("raidButton");
		if (engine.dayStatus == engine.statusCycle[0]) {
			this.dealDamage(15,"sunlight");
			engine.elements.eventMsg("Raiding in the daylight has hurt you! -15 HP!");
		} else {
			hpLoss = Math.floor(Math.random()*(5-1+1)+1);
			goldCollected = Math.floor((Math.random()*100));
			this.goldCount += goldCollected;
			engine.elements.alterHTML("gold",this.goldCount);
			engine.elements.eventMsg("Your raid yielded "+goldCollected+" gold coins at the cost of "+hpLoss+"HP from the townspeople!");
			this.dealDamage(hpLoss,"raiding",15);
		}
	}
}