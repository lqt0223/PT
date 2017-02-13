//initialization

// The example that user only configured either "in" or "out" animation.
// PT can auto-complete the animation not configured. 
// (Still working. Full configuration of "in" and "out" animation is preferred.)

PT.init("#wrapper");

var scaleZoomFade = new Style({
    in: {
        from: {
            opacity: 0.0,
            transform: "scale(0.8)",
            filter: "blur(10px)"
        },
        to: {
            opacity: 1.0,
            transform: "scale(1.0)",
            filter: "blur(0px)"
        }
    },
    duration: "0.5s",
});
// PT.enable(["#1","#2","#3","#4","#5","#6","#7","#8"],slideInRight);
PT.enable("*", scaleZoomFade);
PT.customDirection("#2", 1);
PT.setHome("#3");

var wrapper = document.getElementById("wrapper");

function handler() {
    wrapper.innerHTML = "";
    spawnPage(wrapper);
}

function spawnPage(dom) {
    var i = 0;
    while (i < 10) {
        dom.innerHTML += spawnLink(i);
        i++;
    }
    var r1 = Math.floor(Math.random() * 255);
    var r2 = Math.floor(Math.random() * 255);
    var r3 = Math.floor(Math.random() * 255);
    var canvas = document.createElement("canvas");
    canvas.width = "500";
    canvas.height = "500";
    canvas.style.backgroundColor = "rgb(" + r1 + "," + r2 + "," + r3 + ")";
    canvas.style.position = "absolute";
    canvas.style.zIndex = -1;
    dom.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(r1, r2, r3 / 2, 0, Math.PI * 2);
    ctx.fill();
    PT.run(); // playback the page transition animation at here.
}

function spawnLink(i) {
    return '<a href="#' + i + '">' + i + '</a><br>';
}

window.addEventListener("hashchange", handler, false);
window.addEventListener("load", handler, false);