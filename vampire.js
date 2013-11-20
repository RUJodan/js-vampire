console.log(window.outerHeight);
var count = 0;
var bloodCount = 0;
var multiplier = 1;
var dayStatus;
var cycleFlag = false;
var herpButton;
var counter = document.getElementById("counter");
var blood = document.getElementById("blood");
var statusCycle = [
	"day",
	"dusk",
	"night",
	"dawn"
];
var huntStatus = {
	"day":0,
	"dusk":3,
	"night":4,
	"dawn":2
};
var dayFlavor = [
	"The sun is bright outside..",
	"The sun is setting..",
	"The moon shines brightly..",
	"The sun is rising.."
];

setInterval(function() { 
	count++;
	counter.innerHTML = count;
	triggers(count);
}, 1000);

function addEventMsg(txt) {
	var msg = document.getElementById("msg");
	txt = "-"+txt+"<br />"+msg.innerHTML;
	msg.innerHTML = txt;
}

function bloodButton() { 
	herpButton = elm("button",{innerHTML:"Hunt for Blood", id:"bloodButton"},{}); 
	document.body.appendChild(herpButton);
	herpButton.addEventListener("click",hunt.bind());
}

function enableButton() {
	herpButton.disabled = false;
	var btxt = document.getElementById("bloodButton");
	btxt.innerHTML = "Hunt for Blood";
}

function hunt() {
	var btxt = document.getElementById("bloodButton");
	var bloodCollected;
	btxt.innerHTML = "Wait to hunt..";
	herpButton.disabled = true;
	bloodCollected = 1*multiplier;
	bloodCount += bloodCollected;
	blood.innerHTML = bloodCount;
	addEventMsg("Your hunt yielded "+bloodCollected+" pint(s) of blood!");
}

function elm(name,props,style){
	var el = document.createElement(name);
	for(var prop in props) if(props.hasOwnProperty(prop)) el[prop] = props[prop];
	for(var prop in style) if(style.hasOwnProperty(prop)) el.style[prop] = style[prop];
	return el;
}

function startDayCycle() {
	var day = document.getElementById("divCycle").style.display = "block";
	dayStatus = "dusk";
	var cycle = document.getElementById("cycle");
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

function triggers(count) {
	if(count == 5) bloodButton();
	if((count % 5) == 0 && count > 5) {
		enableButton();
	}
	if (bloodCount >= 1 && !cycleFlag) {
		startDayCycle();
		cycleFlag = true;
	}
}