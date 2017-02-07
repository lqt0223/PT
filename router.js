var wrapper = document.getElementById("wrapper");
PT.init("#wrapper");

var zoomInFade = new Style({
	in: {
		from:{
			opacity: 0.0,
			transform: "scale(0.8)"
		},
		to:{
			opacity: 1.0,
			transform: "scale(1.0)"
		}
	},
	out: {
		from:{
			opacity: 1.0,
			transform: "scale(1.0)"
		},
		to:{
			opacity: 0.0,
			transform: "scale(1.2)"
		}		
	},
	duration: "0.5s"
});

PT.enable(["#first","#third","#home"],zoomInFade);
PT.customDirection("#home",1);

function handler(){
	var hash = window.location.hash;
	if(hash == "#first"){
		wrapper.innerHTML = '<div style="background-color: red;width: 200px; height: 200px"><p style="color: white">This is the first page</p></div>';
		wrapper.innerHTML += '<a href="#first">first</a><a href="#second">second</a><a href="#third">third</a><a href="#home">home</a>'
		PT.run();
	}else if(hash == "#second"){
		wrapper.innerHTML = '<div style="background-color: green;width: 200px; height: 200px"><p style="color: white">This is the second page</p></div>';
		wrapper.innerHTML += '<a href="#first">first</a><a href="#second">second</a><a href="#third">third</a><a href="#home">home</a>'
		PT.run();
	}else if(hash == "#third"){
		wrapper.innerHTML = '<div style="background-color: blue;width: 200px; height: 200px"><p style="color: white">This is the third page</p></div>';
		wrapper.innerHTML += '<a href="#first">first</a><a href="#second">second</a><a href="#third">third</a><a href="#home">home</a>'
		PT.run();
	}else{
		wrapper.innerHTML = '<a href="#first">first</a><a href="#second">second</a><a href="#third">third</a>';
		PT.run();
	}
}

window.addEventListener("hashchange",handler,false);
window.addEventListener("load",handler,false);