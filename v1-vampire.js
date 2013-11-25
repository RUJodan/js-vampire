//variables to keep track of player values, counters and other game values
//values change often
var count = 0;
var bloodCount = 0;
var multiplier = 1;
var dayStatus;
var goldCount = 0;
var hp = 20;
var hpMax = 20;

//flags for initial functions that shouldn't repeat
//(button appending for example)
//death is reoccurring
var cycleFlag = false;
var raidFlag = false;
var dead = false;
var firstHPLoss = false;

//uninitialized button variables
//dynamically created and assigned
var goHunting; 
var goRaiding;

//html element variables
var counter = document.getElementById("counter");
var blood = document.getElementById("blood");
var gold = document.getElementById("gold");

//objects and arrays for day statuses and cycles
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

//initial interval
//this shit controls the game!
setInterval(function() { 
        count++;
        counter.innerHTML = count;
        triggers(count);
}, 1000);

//lose 20 pints of blood when you die
//add proper event log messages
//set dead flag for other functions to know you're dead
function triggerDeath(cause) {
        var bloodloss = 20;
        addEventMsg("You have died from: "+cause);
        addEventMsg("Your death has cost you "+bloodloss+" of your precious blood!");
        if (bloodCount < 20) bloodCount = 0;
        else bloodCount -= bloodloss;
        blood.innerHTML = bloodCount;
        dead = true;
}

//if player is dead, revive to 1HP during the night cycle only
//else heal player by designated amount, maxing out at players capped maxHP
function healDamage(heal) {
        if (dead) {
                hp = 1;
                addEventMsg("The powerful of the nights moon revives you enough to resume hunting.");
                dead = false;
        } else {
                if ((hp+heal) > hpMax) hp = hpMax;
                else hp += heal;
                document.getElementById("hp").innerHTML = hp;
        }
}

//first time losing HP - remove hidden class from the div!
//subtract damage dealt
//call death function appropriately, passing in what killed you
//update div to proper HP value
function dealDamage(dmg,type) {
        if (!firstHPLoss) {
                firstHPLoss = true;
                document.getElementById("hpDiv").className = "";
        }
        if ((hp-dmg) <= 0) {
                hp = 0;
                triggerDeath(type);
        } else {
                hp -= dmg;
        }
        document.getElementById("hp").innerHTML = hp;
}

//this function is a life saver
//properly appends the event log from top to bottom.
function addEventMsg(txt) {
        var msg = document.getElementById("msg");
          msg.style.border = "1px solid black";
        txt = "-"+txt+"<br />"+msg.innerHTML;
        msg.innerHTML = txt;
}

//dynamic appending of the raid button when called
function raidButton() {
        goRaiding = elm("button",{innerHTML:"Raid for Gold",id:"raidButton"},{});
        document.body.appendChild(goRaiding);
        goRaiding.addEventListener("click",raid.bind());
}

//dynamic appending of the hunt button when called
function bloodButton() { 
        goHunting = elm("button",{innerHTML:"Hunt for Blood", id:"bloodButton"},{}); 
        document.body.appendChild(goHunting);
        goHunting.addEventListener("click",hunt.bind());
}

//enables buttons when triggered
//if dead, will only enable when called during night cycle
//set html properly
function enableButton(bid,bEvent,newTxt) {
        var element = document.getElementById(bid);
        if (dead && dayStatus != "night") addEventMsg("You are too weak to "+bEvent+" until pure darkness allows it!");
        else {
                element.disabled = false;
                element.innerHTML = newTxt;
        }
}

//go hunting son!
//disable button
//add message and deal damage if hunting in the daylight
//collect yo blood and heal 1HP from drankin it
function hunt() {
        var btxt = document.getElementById("bloodButton");
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
}

//holy shit we're going raiding.
//same shit as the hunt, just with gold
//why?
//cause raiding.
function raid() {
        var goldDiv = document.getElementById("goldDiv").style.display = "block";
        var rtxt = document.getElementById("raidButton");
        var goldCollected;
        var hpLoss = 0;
        goRaiding.innerHTML = "Wait to raid..";
        goRaiding.disabled = true;
        if (dayStatus == statusCycle[0]) {
                dealDamage(15,"sunlight");
                addEventMsg("Raiding in the daylight has hurt you! -15 HP!");
        } else {
                hpLoss = Math.floor(Math.random()*(5-1+1)+1); //random math 1-5 HP loss cause people fight back
                goldCollected = Math.floor((Math.random()*100)); //random coinage 1-100 like a boss
                goldCount += goldCollected;
                gold.innerHTML = goldCount;
                addEventMsg("Your raid yielded "+goldCollected+" gold coins at the cost of "+hpLoss+"HP from the townspeople!");
                healDamage(1);
        }
}

//bad ass element creation function thanks to @BenjaminGruenbaum on SO JS chat
//you rock bro
function elm(name,props,style){
        var el = document.createElement(name);
        for(var prop in props) if(props.hasOwnProperty(prop)) el[prop] = props[prop];
        for(var prop in style) if(style.hasOwnProperty(prop)) el.style[prop] = style[prop];
        return el;
}


//start cycling through the days
//initial values only!
//set dat *er
function initDayCycle() {
        var day = document.getElementById("divCycle").style.display = "block";
        dayStatus = "dusk";
        var cycle = document.getElementById("cycle");
        cycle.innerHTML = dayStatus;
        multiplier = 3;
}

//change day cycle into the next value
function changeDayCycle() {
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
}

//THE SECOND MOST IMPORTANT FUNCTION
//these triggers control EVERYTHING
//triggered by the interval (trigger the triggers ha!)
function triggers(count) {
        if(count == 5) bloodButton();
        if(!(count % 5) && count > 5) {
                enableButton("bloodButton","hunt","Hunt for Blood");
        }
        if(!(count % 10) && bloodCount > 35) {
                enableButton("raidButton","raid","Raid for Gold");
        }
        if (bloodCount >= 10 && !cycleFlag) {
                initDayCycle();
                cycleFlag = true;
        }
        if (bloodCount >= 35 && !raidFlag) {
                raidButton();
                raidFlag = true;
        }
        if (!(count%10) && cycleFlag) {
                changeDayCycle();
        }
}