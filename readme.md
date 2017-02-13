PT: Fullscreen page transition animation for front-end routing
================
PT("page transition") is a tiny library that enables fullscreen page transition animation for frond-end routing(using hash "#" to change web content.)
### How to use:
<hr>

First, modify your HTML file like this:
```html
<html>
	<body>
		<div id="wrapper">
		<!-- Wrap your web content with a div with identifier. -->
		</div>
		<script type="text/javascript" src="PT.js"></script>
		<!-- Include PT.js prior to your route handling script. -->
		<script type="text/javascript" src="router.js"></script>
	</body>
</html>
```

Then, configure PT with the following code. 
```javascript
//router.js

PT.init("#wrapper");
/* The parameter is the CSS selector string to your content wrapper div. */

PT.enable(["#login","#welcome","#dashboard"], zoomInFade);
/* This function enables transition animation on specified hashes.
Or you can write */
PT.enable("*", zoomInFade);
/* Transition animation on all hashes */

PT.customDirection("#dashboard",1);  
/* (optional)
Basically, PT can "guess" the animation playback direction according to your previous hashes.
If you need to specify an animation playback direction for a hash 
(such as "#home"), use this function above. */

PT.setHome("#welcome");
/* (optional)
This function sets the hash as home.
A home hash will behave in the following pattern:
- Access to this hash will always trigger a backward animation.
- The next hash change will always trigger a forward animation.
*/
```

In the `PT.enable()`  function, the second parameter is a custom `Style` instance that describes the transition.
In the `Style` instance, `in` is for describing the animation for the page that will appear, and `out` for disappear.
Other key names in the `style` instance are based on the CSS Animation API.
You can refer to it at: [animation - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/animation)

An example of custom `Style` instance:
```javascript
// Full configuration...
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

// You can configure only either "in" or "out" animation,
// PT will do the auto-completion for you. (Still working...)

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

```

Finally, put `PT.run()` after the code where your front-end router changes the content of the wrapper div.

```javascript
//router.js

window.onhashchange = function(){
	wrapper.innerHTML = someHTML
	PT.run();
};
```

### TODO
<hr>
1. Some preset animations.
2. What if the wrapper div will glitch when the css position property is set to "absolute"? 
3. Optimization for animation auto-completion.
