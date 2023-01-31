import init from './main.js';
import {loadImages} from './helpers.js';

const imageSources = {
    note1: 'images/meteor_1.png',
    note2: 'images/meteor_2.png',
    note3: 'images/meteor_3.png',
    note4: 'images/meteor_4.png',
};

// loadImages(imageSourcesObject,callback);
loadImages(imageSources,startGame);


function startGame(imageData){
	init(imageData);
}