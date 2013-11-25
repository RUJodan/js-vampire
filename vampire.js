function _engine() {
	this.count = 0
}
_engine.prototype = {
	updateCount : function(id) {
		this.count++;
		document.getElementById(id).innerHTML = this.count;
		this.trigger();
	},
	trigger : function() {
		if (!(this.count%5)) {
			console.log(this.count);
		}
	}
}
var engine = new _engine();
setInterval(function() { 
	engine.updateCount("counter");
}, 1000);
