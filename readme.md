PT: Fullscreen page transition effect for front-end routing
================
PT("page transition") is a tiny library that enable fullscreen page transition effect for frond-end routing(using hash "#" to change web content.)
### How to use:
<hr>
1. Modify your HTML file like this:

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
2. Configure PT with the following code. 
```javascript
//router.js

PT.init("#wrapper");
/* The parameter is the CSS selector string to your content wrapper div. */
PT.enable(["#login","#welcome","#dashboard"], zoomInFade);
/* This function enables transition effect on specified hashes. */
PT.customDirection("#home",1);  
/* PT can "guess" the animation playback direction according to your previous hashes. If you need to specify an animation playback direction for a hash (such as "#home"), use this function above. */
```
In the `PT.enable()`  function, the second parameter is a custom `Style` instance that describes the transition. You can create new style by yourself like this:
```javasript
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
```

3. Run `PT.run()` after the code where your front-end router changes the innerHTML of the wrapper div.

```javascript
//router.js

window.onhashchange = function(){
	wrapper.innerHTML = someHTML
	PT.run();
};
```

### TODO
<hr>
1. Some preset effect.
2. What if the wrapper div will glitch when the css position property is set to "absolute"? 
3. PT.setHome() to set the root for routing. The next route will always trigger a forth animation.