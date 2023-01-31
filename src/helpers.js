import {getUnitVector} from './utilities.js';
import ImageSprite from './ImageSprite.js'
export {loadImages,createImageSprites};

function loadImages(imageSources,callback) {
    let numImages = Object.keys(imageSources).length
    let numLoadedImages = 0;
    
    // load images
    console.log("... start loading images ...");
    for(let imageName in imageSources) {
        console.log("... trying to load '" + imageName + "'");
        let img = new Image();
        img.src = imageSources[imageName];
        imageSources[imageName] = img;
        img.onload = function() {
            console.log("SUCCESS: Image named '" + imageName + "' at " + this.src + " loaded!");
            if(++numLoadedImages >= numImages){
                console.log("... done loading images ...");
                callback(imageSources);
            }
        }
        img.onerror = function(){
            console.log("ERROR: image named '" + imageName + "' at " + this.src + " did not load!");
        }
    }
}

//create an image sprite 
function createImageSprites(x=-50,y=-50,width=50,height=50,image,type,rect={left:0,top:0,width:300,height:300}){

	    let s = new ImageSprite(x,
								y,
								getUnitVector(x,y),
								120,
								width,
								height,
								image,
								type);

	return s;
}