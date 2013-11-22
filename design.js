var _player = {
	bloodcount:0,
	goldCount:0,
	hp:20,
	hpMax:20,
	dead:false,
	triggerDeath:function(cause) {
		var bloodloss = 20;
		addEventMsg("You have died from: "+cause);
		addEventMsg("Your death has cost you "+bloodloss+" of your precious blood!");
		if (bloodCount < 20) bloodCount = 0;
		else bloodCount -= bloodloss;
		blood.innerHTML = bloodCount;
		dead = true;
	},
	healDamage: function(heal) {
		if ((hp+heal) > hpMax) hp = hpMax;
		else hp += heal;
		//document.getElementById("hp").innerHTML = hp;
	},
	dealDamage:	function(dmg,type) {
		if (!firstHPLoss) {
			firstHPLoss = true;
			//document.getElementById("hpDiv").className = "";
		}
		if ((hp-dmg) <= 0) {
			hp = 0;
			triggerDeath(type);
		} else {
			hp -= dmg;
		}
		//document.getElementById("hp").innerHTML = hp;
	}
};

var _elements {
	counter:document.getElementById("counter"),
	blood:document.getElementById("blood"),
	gold :document.getElementById("gold"),
	spanHP:document.getElementById("hp"),
	divHP:document.getElementById("hp"),
	bloodElement:document.getElementById("bloodButton"),
	raidElement:document.getElementById("raidButton"),
	msg:document.getElementById("msg"),
	goldDiv:document.getElementById("goldDiv"),
	day:document.getElementById("divCycle"),
	cycle:document.getElementById("cycle"),
	raidButton:function() {
		goRaiding = elm("button",{innerHTML:"Raid for Gold",id:"raidButton"},{});
		document.body.appendChild(goRaiding);
		goRaiding.addEventListener("click",raid.bind());
	},
	bloodButton:function() { 
		goHunting = elm("button",{innerHTML:"Hunt for Blood", id:"bloodButton"},{}); 
		document.body.appendChild(goHunting);
		goHunting.addEventListener("click",hunt.bind());
	},
	enableButton:function(bid,bEvent,newTxt) {
		//accept id and enable triggered button
		var element = document.getElementById(bid);
		if (dead && dayStatus != "night") addEventMsg("You are too weak to "+bEvent+" until pure darkness allows it!");
		else {
			element.disabled = false;
			element.innerHTML = newTxt;
		}
	},
	elm:function(name,props,style){
		var el = document.createElement(name);
		for(var prop in props) if(props.hasOwnProperty(prop)) el[prop] = props[prop];
		for(var prop in style) if(style.hasOwnProperty(prop)) el.style[prop] = style[prop];
		return el;
	}
};

var _engine {
	count:0,
	multiplier:1,
	dayStatus:'',
	cycleFlag:false,
	raidFlag:false,
	firstHPLoss:false,
	goHunting:'',
	goRaiding:'',
	statusCycle: [
		"day",
		"dusk",
		"night",
		"dawn"
	],
	huntStatus: {
		"day":0,
		"dusk":3,
		"night":4,
		"dawn":2
	},
	dayFlavor: [
		"The sun is bright outside..",
		"The sun is setting..",
		"The moon shines brightly..",
		"The sun is rising.."
	],
	updateHPDiv: function() {

	},
	addEventMsg:function(txt) {
		//var msg = document.getElementById("msg");
	  	msg.style.border = "1px solid black";
		txt = "-"+txt+"<br />"+msg.innerHTML;
		msg.innerHTML = txt;
	},
	startDayCycle:function() {
		//var day = document.getElementById("divCycle").style.display = "block";
		dayStatus = "dusk";
		//var cycle = document.getElementById("cycle");
		cycle.innerHTML = dayStatus;
		multiplier = 3;
		setInterval(function() {
			var index = statusCycle.indexOf(dayStatus);
			var cycleNext = statusCycle[(index+1)];
			if (cycleNext) {
				dayStatus = cycleNext;
				multiplier = huntStatus[cycleNext];
			}
			else {
				dayStatus = statusCycle[0];
				multiplier = huntStatus[dayStatus];
			}
			cycle.innerHTML = dayStatus;
			var newIndex = statusCycle.indexOf(dayStatus);
			addEventMsg(dayFlavor[newIndex]);
		},10000);
	}
};

var _actions {
	hunt:function() {
		//var btxt = document.getElementById("bloodButton");
		var bloodCollected;
		btxt.innerHTML = "Wait to hunt..";
		goHunting.disabled = true;
		if (dayStatus == statusCycle[0]) {
			dealDamage(10,"sunlight");
			addEventMsg("Hunting in the daylight has hurt you! -10 HP!");
		} else {
			bloodCollected = 1*multiplier;
			bloodCount += bloodCollected;
			blood.innerHTML = bloodCount;
			addEventMsg("Your hunt yielded "+bloodCollected+" pint(s) of blood!");
			healDamage(1);
		}
	},
	raid:function() {
		//var goldDiv = document.getElementById("goldDiv").style.display = "block";
		//var rtxt = document.getElementById("raidButton");
		var goldCollected;
		var hpLoss = 0;
		goRaiding.innerHTML = "Wait to raid..";
		goRaiding.disabled = true;
		if (dayStatus == statusCycle[0]) {
			dealDamage(15,"sunlight");
			addEventMsg("Raiding in the daylight has hurt you! -15 HP!");
		} else {
			hpLoss = Math.floor(Math.random()*(5-1+1)+1);
			goldCollected = Math.floor((Math.random()*100));
			goldCount += goldCollected;
			gold.innerHTML = goldCount;
			addEventMsg("Your raid yielded "+goldCollected+" gold coins at the cost of "+hpLoss+"HP from the townspeople!");
			healDamage(1);
		}
	}
};

setInterval(function() { 
	count++;
	counter.innerHTML = count;
	triggers(count);
}, 1000);

function triggers(count) {
	if(count == 5) bloodButton();
	if(!(count % 2) && count > 5) {
		enableButton("bloodButton","hunt","Hunt for Blood");
	}
	if(!(count % 10) && bloodCount > 35) {
		enableButton("raidButton","raid","Raid for Gold");
	}
	if (bloodCount >= 10 && !cycleFlag) {
		startDayCycle();
		cycleFlag = true;
	}
	if (bloodCount >= 35 && !raidFlag) {
		raidButton();
		raidFlag = true;
	}
}