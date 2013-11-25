function _player() {
	this.hp = 20;
	this.hpMax = 20;
	this.bloodcount = 0;
	this.goldCount = 0;
}

_player.prototype = {
	isDead : function() {
		if (engine.player.hp <= 0) return true;
		else return false;
	},
	revive : function() {
		if (engine.dayStatus == "night") {
			engine.player.healDamage(1);
		}
	},
	healDamage : function(heal) {
		if ((engine.player.hp+heal) > engine.player.hpMax) engine.player.hp = engine.player.hpMax;
		else engine.player.hp += heal;
		engine.elements.alterHTML("hp",engine.player.hp);
	},
	triggerDeath : function(cause,bloodLoss) {
		engine.elements.eventMsg("You have died from: "+cause);
		engine.elements.eventMsg("Your death has cost you "+bloodLoss+" pints of your precious blood!");
		if (engine.player.bloodcount < 20) engine.player.bloodcount = 0;
		else engine.player.bloodcount -= bloodLoss;
		engine.elements.alterHTML("blood",engine.player.bloodcount);
		engine.elements.disableElement("bloodButton","Wait to Hunt...");
		engine.elements.disableElement("raidButton","Wait to Raid...");
	},
	dealDamage : function(dmg,type,bloodLossOnDeath) {
		if (!engine.firstHPLoss) {
			engine.firstHPLoss = true;
			engine.elements.showElement("hpDiv","block");
		}
		if ((engine.player.hp-dmg) <= 0) {
			engine.player.hp = 0;
			engine.player.triggerDeath(type,bloodLossOnDeath);
		} else {
			engine.player.hp -= dmg;
		}
		engine.elements.alterHTML("hp",engine.player.hp);
	},
	hunt : function() {
		var bloodCollected = 0;
		engine.elements.disableElement("bloodButton","Wait to Hunt...");
		if (engine.dayStatus == engine.statusCycle[0]) {
			engine.player.dealDamage(10,"sunlight",20);
			engine.elements.eventMsg("Hunting in the daylight has hurt you! -10 HP!");
		} else {
			bloodCollected = 1*engine.multiplier;
			engine.player.bloodcount += bloodCollected;
			engine.elements.alterHTML("blood",engine.player.bloodcount);
			engine.elements.eventMsg("Your hunt yielded "+bloodCollected+" pint(s) of blood!");
			engine.player.healDamage(1);
		}
	},
	raid : function() {
		engine.elements.showElement("goldDiv","block");
		var goldCollected;
		var hpLoss = 0;
		engine.elements.disableElement("raidButton","Wait to Raid...");
		if (engine.dayStatus == engine.statusCycle[0]) {
			engine.player.dealDamage(15,"sunlight",25);
			engine.elements.eventMsg("Raiding in the daylight has hurt you! -15 HP!");
		} else {
			hpLoss = Math.floor(Math.random()*(5-1+1)+1);
			goldCollected = Math.floor((Math.random()*100));
			engine.player.goldCount += goldCollected;
			engine.elements.alterHTML("gold",engine.player.goldCount);
			engine.elements.eventMsg("Your raid yielded "+goldCollected+" gold coins at the cost of "+hpLoss+"HP from the townspeople!");
			engine.player.dealDamage(hpLoss,"raiding",15);
		}
	}
}