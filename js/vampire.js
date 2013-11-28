var engine = (function(){ return new _engine(); }());

setInterval(function() { 
	engine.updateCount("counter");
}, 1000);