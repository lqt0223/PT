// test
var css = {
	attribute: "opacity",
	value: 0.0
};
var result = parseCSS(css);

function parseCSS(css){
	var attribute = css.attribute;
	var value = css.value;
	var handler = {};
	
	var attributePattern = /(\w|\d)+\(/g;
	var subAttribute = ""
	// console.log(subAttribute);
	if(typeof value == "number"){
		value = value.toString();
	}else{
		subAttribute = value.match(attributePattern)[0].slice(0,-1);
		value = value.replace(attributePattern,"").slice(0,-1);
	}

	switch(attribute){
		case "opacity":{
			handler = function(x,y){
				return x;
			};
			break;
		}
		case "transform":{
			switch(subAttribute){
				case "scale" : {
					break;
				}
				case "translate" : {
					break;
				}
				case "rotate" : {
					break;
				}
				case "skew" : {
					break;
				}
			}
			break;
		}
		case "filter":{
			switch(subAttribute){
				case "blur":{
					break;
				}
				case "brightness":{
					break;
				}
				case "contrast":{
					break;
				}
				case "drop-shadow":{
					break;
				}
				case "grayscale":{
					break;
				}
				case "hue-rotate":{
					break;
				}
				case "invert":{
					break;
				}
				case "opacity":{
					break;
				}
				case "saturate":{
					break;
				}
				case "sepia":{
					break;
				}
			}
			break;
		}
	}
}

/*// implyAnimation("opacity",0.5,1);
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

////////////////////////////////////////////

var a = "matrix3d(1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0)";
var b = "matrix3d(5.0, 6.0, 1.0, 4.0, 3.0, 8.0, 9.0, 7.0, 16.0, 10.0, 13.0, 12.0, 15.0, 2.0, 11.0, 14.0)";
var result = getCounter([a,b],function(x,y){
	return 2 * y - x;
});	
console.log(result);

/*getCounter

This function takes 2 strings as the first and second parameter.
The function will extract numbers in the string, and will do the calculation according to the third handler function.
The return value will be [b, the new string will all the numbers replaced by new numbers according to the calculation];

*/

function getCounter(pair,handler){
	var parts = [];
	var numberData = [];
	var regex = /(\d|\.)+/g;
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
			if(e == b){
				if(!inB){
					dif = i
					inB = true;
				}
				var x = numberData[i - dif].number;
				var y = numberData[i].number;
				var newValue = handler(x,y);
				var sliced = e.slice(baseIndex, index + length);
				var after = sliced.replace(result[0],newValue);
				parts.push(after);
				baseIndex = index + length;
			}
			i++;
		};
	});
	parts.push(b.slice(baseIndex));
	return [b, parts.join("")];
}
