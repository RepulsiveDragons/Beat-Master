export {getUnitVector,getMouse,getRandom,loadJsonFetch};

//gets the unit vector to the center of the canvas screen
function getUnitVector(xPos,yPos){
	let x = 900/2 - xPos;
	let y = 650/2 - yPos;
	let length = Math.sqrt(x*x + y*y);
	if(length == 0){ // very unlikely
		x=1; // point right
		y=0;
		length = 1;
	} else{
		x /= length;
		y /= length;
	}

	return {x:x, y:y};
}
//get a random number between the range
function getRandom(min, max) {
	return Math.random() * (max - min) + min;
}

// returns mouse position in local coordinate system of element
function getMouse(e){
	var mouse = {}; // make an object
	mouse.x = e.pageX - e.target.offsetLeft;
	mouse.y = e.pageY - e.target.offsetTop;
	return mouse;
}

const loadJsonFetch = (url,callback) => {
	fetch(url)
		.then(response => {
			// If the response is successful, return the JSON
			if (response.ok) {
				return response.json();
			}

			// else throw an error that will be caught below
			return response.text().then(text =>{
				throw text;
			});
		}) // send the response.json() promise to the next .then()
		.then(json => { // the second promise is resolved, and `json` is a JSON object
			callback(json);
		}).catch(error => {
			// error
			console.log(error);
	});
};
