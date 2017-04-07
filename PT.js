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
  return (this._data.in !== undefined) != (this._data.out !== undefined);
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

  for(var attribute in givenData.from){
    var from = givenData.from[attribute];
    var to = givenData.to[attribute];
    var result = this._getCounterpart(attribute,keyToAutoComplete,[from,to]);
    console.log(result);
    console.log(attribute);
    this._data[keyToAutoComplete].from[attribute] = result[0];
    this._data[keyToAutoComplete].to[attribute] = result[1];
  }
};

Style.prototype._getCounterpart = function(attr,direction,pair){
  var css = {
    attribute: attr,
    value: pair[0]
  };

  // Exclusive way to deal with opacity
  if(attr == "opacity"){
    return [pair[1],pair[0]];
  }

  var parsed = this._getCssValueHandler(css,direction);
  var parts = [];
  var numberData = [];
  var regex = /(\-|\d|\.)+(?!d\()/g;
  var i = 0;
  var dif = 0;
  var inB = false;
  var baseIndex = 0;
  pair.map(function(e){
    while(result = regex.exec(e)){
      var number = result[0];
      var index = result.index;
      var length = number.length;
      number = parseFloat(number);
      numberData.push({
        number: number,
        index: index,
        length: length
      });
      if(e == pair[1]){
        if(!inB){
          dif = i
          inB = true;
        }
        var x = numberData[i - dif].number;
        var y = numberData[i].number;
        var newValue = parsed.handler(x,y);
        var sliced = e.slice(baseIndex, index + length);
        var after = sliced.replace(result[0],newValue);
        parts.push(after);
        baseIndex = index + length;
      }
      i++;
    };
  });
  parts.push(pair[1].slice(baseIndex));
  return direction == "out" ? [pair[1], parts.join("")] : [parts.join(""), pair[0]];  
};

Style.prototype._getCssValueHandler = function(css,direction){
  var attribute = css.attribute;
  var value = css.value;
  var f = {};
  
  var attributePattern = /(\w|\d)+\(/g;
  var subAttribute = ""
  var unit = "";
  if(typeof value == "number"){
    value = value.toString();
  }else{
    subAttribute = value.match(attributePattern)[0].slice(0,-1);
    unit = value.match(/\(.+\)/g)[0].replace(/(\d|\.)+/g,"").slice(1,-1);
    value = value.replace(attributePattern,"").slice(0,-1);
  }
  switch(attribute){
    case "transform":{
      switch(subAttribute){
        case "scale":
        case "scaleX":
        case "scaleY":
        case "scaleZ":
        case "scale3d": {
          f = function(x,y){
            if(direction == "out"){
              return y / x;
            }else{
              return x / y;
            }
          };
          break;
        }
        case "translate":
        case "translateX":
        case "translateY":
        case "translateZ":
        case "translate3d": {
          f = function(x,y){
            var result;
            if(direction == "in"){
              result = 2 * x - y;
            }else{
              result = 2 * y - x;
            }
            if(unit == "%" && result > 100){
              result = 100
            }
            return result;
          };
          break;
        }
        case "rotate":
        case "rotateX":
        case "rotateY":
        case "rotateZ":
        case "rotate3d" : {
          f = function(x,y){
            var result;
            if(direction == "in"){
              result = 2 * x - y;
            }else{
              result = 2 * y - x;
            }
            if(unit == "%" && result > 100){
              result = 100
            }
            return result;
          };
          break;
        }
        case "skew":
        case "skewX":
        case "skewY" : {
          f = function(x,y){
            var result;
            if(direction == "in"){
              //the autocompleted animation for skew is a little weird...
              result = 2 * x - y;
            }else{
              result = 2 * y - x;
            }
            if(unit == "%" && result > 100){
              result = 100
            }
            return result;
          };
          break;
        }
        //todo: matrix,matrix3d,
      }
      break;
    }
    case "filter":{
      f = function(x,y){
        if(direction == "out"){
          return x;
        }else{
          return y;
        }
      };
      break;
    }
  }
  return {
    value: value,
    handler: f
  }
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
