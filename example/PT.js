var DIRECTION_FORTH = 0;
var DIRECTION_BACK = 1;

function PT() {};

PT.init = function(querySelector) {
	PT._selector = querySelector;
	PT._parentNode = document.querySelector(querySelector).parentNode;
	PT._hashArray = [];
	PT._customDirections = [];
};

PT.enable = function(hashes, style) {
	if (hashes == "*") {
		PT._enableOnAllHashes = true;
	} else {
		PT._enabledHashes = hashes;
	}
	PT._style = style;
};

PT.customDirection = function(hash, direction) {
	if (!PT._enabled(hash)) {
		throw "The hash " + hash + " is not enabled yet.";
	}
	PT._customDirections.push({
		hash: hash,
		direction: direction
	});
};

PT.setHome = function(hash) {
	if (!PT._enabled(hash)) {
		throw 'The hash "' + hash + '" is not enabled yet.';
	}

	if (PT._getCustomDirection(hash) === 0) {
		throw 'The hash "' + hash + '" is set in custom direction as "forth". Home hash should always have a "back" animation direction.';
	}
	PT._homeHash = hash;
};

PT.run = function() {
	var currentHash = window.location.hash;
	PT._recordDOM();
	PT._recordHash(currentHash);

	var shouldRun = PT._enabled(currentHash);
	if (shouldRun) {
		if (PT._homeHash == currentHash) {
			PT._hashArray = [currentHash];
			PT._direction = DIRECTION_BACK;
		} else {
			var customDirection = PT._getCustomDirection(currentHash);
			if (customDirection !== undefined) {
				PT._direction = customDirection;
			} else {
				PT._direction = PT._autoDirection();
			}
		}
		PT._makeTransition(
			PT._prevDOM,
			PT._style,
			PT._direction
		);
	}
};

PT._recordDOM = function() {
	// when there is no previous DOM, use a blank div.
	PT._prevDOM = PT._curDOM ? PT._curDOM : document.createElement("div");
	PT._curDOM = document.querySelector(PT._selector).cloneNode(true);
};

PT._recordHash = function(hash) {
	PT._hashArray.push(hash);
};

PT._enabled = function(hash) {
	if (PT._enableOnAllHashes) {
		return true;
	} else {
		if (PT._enabledHashes.some(function(aHash) {
				return aHash == hash;
			})) {
			return true;
		} else {
			return false;
		}
	}
};

PT._autoDirection = function() {
	var hashArray = PT._hashArray;
	var last = hashArray[hashArray.length - 1];
	for (var i = 0; i < hashArray.length - 1; i++) {
		if (hashArray[i] == last) {
			hashArray.splice(i + 1);
			return DIRECTION_BACK;
		}
	}
	return DIRECTION_FORTH;
}

PT._getCustomDirection = function(hash) {
	for (var i = 0; i < PT._customDirections.length; i++) {
		if (hash == PT._customDirections[i].hash) {
			return PT._customDirections[i].direction;
		}
	}
};

PT._makeTransition = function(prevDOM, style, direction) {
	var curDOM = document.querySelector(PT._selector);
	// draw the div using prevDOMContent and cover the updated content	
	PT._parentNode.appendChild(prevDOM);

	prevDOM.style.position = "absolute";
	prevDOM.style.left = "0px";
	prevDOM.style.top = "0px";

	curDOM.style.position = "absolute";
	curDOM.style.left = "0px";
	curDOM.style.top = "0px";

	document.addEventListener("animationend", function() {
		if (prevDOM.parentNode == PT._parentNode) {
			PT._parentNode.removeChild(prevDOM);
			prevDOM.style.animation = undefined;
			curDOM.style.animation = undefined;
		}
	}, false);

	var style = PT._style;
	PT._applyCssAnimationStyles(style, [prevDOM, curDOM]);
	if (direction == DIRECTION_FORTH) {
		prevDOM.style.animationName = style.outFrom;
		curDOM.style.animationName = style.inFrom;
	} else {
		prevDOM.style.animationName = style.inTo;
		curDOM.style.animationName = style.outTo;
	}
};

PT._applyCssAnimationStyles = function(style, doms) {
	var attributes = ["delay", "direction", "duration", "fillMode", "iterationCount", "playState", "timingFunction"];
	for (var i = 0; i < doms.length; i++) {
		var dom = doms[i];
		for (var j = 0; j < attributes.length; j++) {
			var attribute = attributes[j];
			var value = style[attribute];
			if (value) {
				var keyName = "animation" + attribute[0].toUpperCase() + attribute.slice(1);
				dom.style[keyName] = value;
			}
		}
	}
}

function Style(data) {
	// generate 2 pairs of random key for the naming of animation
	this._inFrom = "a" + Math.random().toString(16).slice(-4);
	this._inTo = "a" + Math.random().toString(16).slice(-4);
	this._outFrom = "a" + Math.random().toString(16).slice(-4);
	this._outTo = "a" + Math.random().toString(16).slice(-4);
	this._data = data;
	this._init();
	return {
		inFrom: this._inFrom,
		inTo: this._inTo,
		outFrom: this._outFrom,
		outTo: this._outTo,
		duration: this._data.duration,
		timingFunction: this._data.timingFunction,
		delay: this._data.delay,
		iterationCount: this._data.iterationCount,
		direction: this._data.direction,
		fillMode: this._data.fillMode,
		playState: this._data.playState,
	};
};

Style.prototype._init = function() {
	if (this._hasEitherAnimation()) {
		this._autoComplete();
	}
	var style = document.createElement("style");
	style.type = "text/css";
	style.innerHTML = this._getKeyframesString();
	document.getElementsByTagName('head')[0].appendChild(style);
};

Style.prototype._hasEitherAnimation = function() {
	var inBoolean = this._data.in !== undefined;
	var outBoolean = this._data.out !== undefined;
	return inBoolean != outBoolean;
};

Style.prototype._autoComplete = function() {
	var keyToAutoComplete = "";
	if (this._data.in) {
		keyToAutoComplete = "out"
	} else {
		keyToAutoComplete = "in";
	}

	var givenData = this._data.in || this._data.out;

	this._data[keyToAutoComplete] = {
		from: {},
		to: {}
	};

	for (var attribute in givenData.from) {
		var valueFrom = givenData.from[attribute];
		var valueTo = givenData.to[attribute];
		var impliedValue = this._implyValue(valueFrom, valueTo);

		this._data[keyToAutoComplete].from[attribute] = valueTo;
		this._data[keyToAutoComplete].to[attribute] = impliedValue[0];
	}
	//TODO handle some special cases for the value in outTo
	// do some trick to opacity
	var to = this._data[keyToAutoComplete].to;
	if(to.opacity){
		to.opacity = givenData.from.opacity;
	}

	// console.log(this._data);
};

Style.prototype._implyValue = function(a, b) {
	var instance = this;

	var result = [a, b].map(function(e) {
		if (typeof e == "number") {
			e = e.toString();
		}
		var digitPattern = /(\d|\.)+/g;
		return instance._mapReplace(digitPattern, e, function(e) {
			return instance._getCounterValue(e);
		});
	});

	if (result.every(function(e) {
			return parseFloat(e) || parseInt(e);
		})) {
		result = result.map(function(e) {
			return parseFloat(e) || parseInt(e);
		});
	}
	return result;
};

Style.prototype._mapReplace = function(regex, string, handler) {
	var matched = string.match(regex);
	matched.map(function(e) {
		e = parseFloat(e) || parseInt(e);
		string = string.replace(e, handler(e));
	});
	return string;
};

Style.prototype._getCounterValue = function(value) {
	var result;
	if (value > 0 && value <= 1) {
		result = 1 / value;
	} else if (value == 0) {
		result = 0;
	} else {
		result = 0 - value;
	}
	return result;
};

Style.prototype._getKeyframesString = function() {
	var inFromString = "@keyframes " + this._inFrom + "{";
	inFromString += "\nfrom{" + this._concatCssString(this._data.in.from) + "}";
	inFromString += "\nto{" + this._concatCssString(this._data.in.to) + "}";
	inFromString += "\n}";

	var inToString = "@keyframes " + this._inTo + "{";
	inToString += "\nfrom{" + this._concatCssString(this._data.in.to) + "}";
	inToString += "\nto{" + this._concatCssString(this._data.in.from) + "}";
	inToString += "\n}";

	var outFromString = "@keyframes " + this._outFrom + "{";
	outFromString += "\nfrom{" + this._concatCssString(this._data.out.from) + "}";
	outFromString += "\nto{" + this._concatCssString(this._data.out.to) + "}";
	outFromString += "\n}";

	var outToString = "@keyframes " + this._outTo + "{";
	outToString += "\nfrom{" + this._concatCssString(this._data.out.to) + "}";
	outToString += "\nto{" + this._concatCssString(this._data.out.from) + "}";
	outToString += "\n}";

	var string = inFromString + "\n" + inToString + "\n" + outFromString + "\n" + outToString;
	return string;
};

Style.prototype._concatCssString = function(cssObject) {
	var string = "";
	for (var key in cssObject) {
		string += key + ":" + cssObject[key] + ";"
	}
	return string;
};

// implyAnimation("opacity",0.5,1);
// return ("opacity",1,0.5);
// implyAnimation("transform","scale(0.5)","scale(1.0)");
// return ("transform","scale(1.0)","scale(2.0)");
// implyAnimation("color","rgb(100,200,300)","rgb(300,200,100)");
// return ("color","rgb(300,200,100)","rgb(100,200,300)");
// implyAnimation("opacity",0.5,1);
// return ("opacity",1,0.5);
// implyAnimation("opacity",0.5,1);
// return ("opacity",1,0.5);

/* transform 
	translateX, Y, Z : xxxpx 0px -xxxpx
	scale 0.0 1.0 n.0
	rotateX, Y, Z -xdeg 0deg xdeg
opacity
*/