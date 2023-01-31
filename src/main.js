import {getMouse,getRandom,loadJsonFetch} from './utilities.js';
import { createImageSprites } from './helpers.js';
import { data,analyserNode,audioCtx,setupWebaudio,playCurrentSound,pauseCurrentSound,setVolume} from './audio.js';
import * as storage from "./local-storage.js";
import * as howler from "./howler.js"
export default init;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const screenWidth = 900;
const screenHeight = 650;

const GameState = Object.freeze({
    START:   		Symbol("START"),
    MAIN:  			Symbol("MAIN"),
    GAMEOVER: 	Symbol("GAMEOVER")
});

let gameState = GameState.START;
let imageSprites = [];
let sprites = [];
let keys = {};
let dt = 0, lastTime = 0, totalElapsedTime = 0, spawnCounter = 0;
let spawnChance = 100;
let rotation, barRotation = 0;
let health = 10;
let score = 0;
let volumeLabel, volumeSlider, lightMode, darkMode;
let backgroundColor;
let presets = [];
let avColor;
let pause = false;
let avBarWidth = 10,maxBarHeight = 100, padding = 2;

//initialize variables and handlers
function init(argImageData){
    for (const key in argImageData) {
        imageSprites.push(argImageData[key]);
    }		    
    
    howler.init();

	canvas.onmousedown = doMousedown;
    window.addEventListener("keydown", keysDown);
    window.addEventListener("keyup", keysUp);

    setupWebaudio('sound/song1.mp3')
    setVolume(0.3);

    volumeSlider = document.querySelector("#volumeSlider");
    volumeLabel = document.querySelector("#volumeLabel");
    lightMode = document.querySelector("#lightMode");
    darkMode = document.querySelector("#darkMode");
  
    volumeSlider.oninput = e =>{
      setVolume(e.target.value);
      volumeLabel.innerHTML = Math.round((e.target.value/2 * 100));
    };
    volumeSlider.dispatchEvent(new Event("input"));

    lightMode.onchange = e =>{
        backgroundColor = e.target.value;
        darkMode.checked = false;
    }

    darkMode.onchange = e =>{
        backgroundColor = e.target.value;
        lightMode.checked = false;
    }

    ctx.lineWidth = 5;
    backgroundColor = "black";

    loadJsonFetch("app-data/colorPresets.json",dataLoaded);

	loop();

}

//game/drawing loop
function loop(time=0){
	// schedule a call to loop() in 1/60th of a second
	requestAnimationFrame(loop);

	// draw background
    ctx.save();
    ctx.fillStyle = backgroundColor;
    ctx.globalAlpha = 0.5;
	ctx.fillRect(0,0,screenWidth,screenHeight)
    ctx.restore();

    if(gameState == GameState.MAIN){

        if(pause){
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            fillText(ctx,"Paused", screenWidth/2, screenHeight/2, "36pt 'Press Start 2P', cursive", "blue");
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            fillText(ctx,"Press P to resume", screenWidth/2, screenHeight/2+50, "12pt 'Press Start 2P', cursive", "blue");
            pauseCurrentSound();
            return;
        }

        dt = (time - lastTime)/1000;
        lastTime = time;
        totalElapsedTime = (time/1000).toFixed(2); 
        spawnCounter += 1 * 1/60;

        analyserNode.getByteFrequencyData(data);
  	    if (audioCtx.state == "suspended") {
     	    audioCtx.resume();
  	    }
        playCurrentSound();
        drawBottomBars();
        drawAVBars();

        //change the spawn chances of the sprite
        //depending on how much time the game has went on
        if(totalElapsedTime > 30) spawnChance = 20;
        else if(totalElapsedTime > 100) spawnChance = 4;
        else spawnChance = 80;
        
        if(Math.round(spawnCounter) > 1){
            if(Math.round(getRandom(0,spawnChance)) < 1 || spawnCounter > 3){
                spawnSprite();
                spawnCounter = 0;
            } 
        }

        drawShield();
        rotateShield();
        // draw game sprites
        // loop through sprites
        for (let s of sprites){

            if(totalElapsedTime > 100) s.move(1/60,getRandom(0.3,2.0));
            else s.move(1/60,1);

            if(s.x <= -100 || s.x >= screenWidth + 100){
                s.speed = 0;
            }
            if(s.y <= -100 || s.y >= screenHeight + 100){
                s.speed = 0;
            }

            if(s.checkCollision(ctx)) {
                score+=50;
                howler.pointUp.play();
            }
            sprites = sprites.filter(sprite => sprite.speed != 0);

            let percent = data[15]/255;
            if(percent < 0.65) percent = 0.65;

            s.draw(ctx,percent);
        }
    
        //have to loop sprites again to check collision
        drawCore();
        for (let s of sprites){
            if(s.checkCollision(ctx)) health--;
            sprites = sprites.filter(sprite => sprite.speed != 0);
        }

        drawHealthBar();
        if(health <= 0) {
            storage.checkIfHighScore(score);
            gameState = GameState.GAMEOVER;
            pauseCurrentSound();
        }
    
    }
    drawHUD(ctx);
} 

//draw the hud based on the game state
function drawHUD(ctx){
    ctx.save(); 
		
    switch(gameState){
        case GameState.START:
        ctx.save();

        // Draw background
        ctx.translate(screenWidth/2,screenHeight/2);
        ctx.scale(6,6);
        ctx.globalAlpha = 0.5;
        ctx.restore();
        
    
        // Draw Text
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        fillText(ctx,"Beat Master", screenWidth/2, screenHeight/2-100, "36pt 'Press Start 2P', cursive", "blue");
        strokeText(ctx,"Beat Master", screenWidth/2, screenHeight/2-100, "36pt 'Press Start 2P', cursive", "white",2);
        fillText(ctx,"Use A and D to block the objects", screenWidth/2, screenHeight/2+200, "12pt 'Press Start 2P', cursive", "red");
        fillText(ctx,"Click anywhere to start the game", screenWidth/2, screenHeight/2+230, "12pt 'Press Start 2P', cursive", "red");
        
        break;
        
    case GameState.MAIN:
        // fillText(string, x, y, css, color)
        fillText(ctx, "Health:", 10, 20, "14pt courier", "purple");
        fillText(ctx,`Score: ${score}`, 10, 45, "14pt courier", "purple");
        break;
        
    case GameState.GAMEOVER:
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        fillText(ctx,"Game Over!", screenWidth/2, screenHeight/2 - 65, "38pt courier", "red");
        fillText(ctx,`Score: ${score}`, screenWidth/2, screenHeight/2 - 30, "38pt courier", "red");
        fillText(ctx,`Highest Score: ${storage.getHighScore()}`, screenWidth/2, screenHeight/2 +10, "38pt courier", "red");
        fillText(ctx,"Click anywhere to restart", screenWidth/2, screenHeight/2+230, "12pt 'Press Start 2P', cursive", "red");
        break;
        
        default:
        throw new Error(MyErrors.drawHUDswitch);
    
    }
    
    ctx.restore();
}

//resets global variables
function resetToDefault(){
    sprites = [];
    dt = 0, lastTime = 0, totalElapsedTime = 0, spawnCounter = 0;
    spawnChance = 100;
    rotation = 0;
    barRotation = 0;
    health = 10;
    score = 0;
    setupWebaudio('sound/song1.mp3');
    setVolume(volumeSlider.value);
}
//load json
const dataLoaded = json => {
    presets = json.presets || ["No 'presets' found"];
    initPreset();
};

//set up the select element with the json data
const initPreset = () => {
    const selectPresets = document.querySelector("#select-presets");
    selectPresets.innerHTML = "";
    presets.forEach((preset,index) => {
        const option = document.createElement("option");
        option.text = preset["title"];
        option.value = preset["rgba"];
        selectPresets.appendChild(option);
    });

    selectPresets.onchange = e => ChangePreset(e.target.value);

    ChangePreset(selectPresets.value); 
};
//changes the color of the av to the selected preset
const ChangePreset = preset =>{
    avColor = preset;
}

//draws the shield
function drawShield(){
    ctx.save();
    ctx.translate(screenWidth/2,screenHeight/2);
    ctx.rotate(rotation);
    ctx.fillStyle = "red";

    ctx.beginPath();
    ctx.moveTo(-50,-100);
    ctx.lineTo(50,-100);
    ctx.lineTo(50,-75);
    ctx.lineTo(-50,-75);
    ctx.lineTo(-50,-100);
    ctx.fill()
    ctx.closePath();

    ctx.restore();
}

//draw the core
function drawCore(){
    let maxRadius = 50;
    let lineIterator = 0;
    ctx.save();

    //use av data to have the core react to the beat
    for(let b of data){
        let percent = b/255;
        if(lineIterator < data.length * 0.25) percent = 0.55;
    
        let grad = ctx.createRadialGradient(screenWidth/2 + 10, screenHeight/2 - 10, 5, screenWidth/2, screenHeight/2, 50);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(1, 'rgba(0, 0, 255, 0.2)');
    
        ctx.beginPath();
        ctx.fillStyle = grad;
        ctx.arc(screenWidth/2, screenHeight/2, maxRadius * percent, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        lineIterator++;
        
    }

    ctx.restore();

    //this is for the actual hitbox
    ctx.beginPath();
    ctx.arc(screenWidth/2, screenHeight/2, 50, 0, 2 * Math.PI);
    ctx.closePath();
}

//draw the health bar
function drawHealthBar(){
    ctx.save();
    ctx.fillStyle = "grey";
    ctx.fillRect(100, 5, 200, 25);

    let grad = ctx.createLinearGradient(100, 0, 250, 0);
    grad.addColorStop(0, 'red');
    grad.addColorStop(2/6, 'orange');
    grad.addColorStop(3/6, 'yellow');
    grad.addColorStop(1, 'green')
 

    ctx.fillStyle = grad;
    ctx.fillRect(100, 5, 200 * (health/10), 25);
    ctx.restore();
}

//draw the av bars on the bottom of the screen
function drawBottomBars(){
    ctx.save()
    ctx.translate(screenWidth/2-4,screenHeight);
    for(let b of data){
        let percent = b/255;
        ctx.translate(avBarWidth,0);
        ctx.save();
        ctx.scale(1,-1);
        ctx.fillStyle = `rgba(${200},${200-b},${b}, 0.5)`;
        ctx.fillRect(0,0,avBarWidth,maxBarHeight * 0.4 * percent);
        ctx.restore();
        ctx.translate(padding,0);
    }
    ctx.restore();

    ctx.save()
    ctx.translate(screenWidth/2+4,screenHeight);
    for(let b of data){
        let percent = b/255;
        ctx.translate(-avBarWidth,0);
        ctx.save();
        ctx.scale(1,-1);
        ctx.fillStyle = `rgba(${200},${200-b},${b}, 0.5)`;
        ctx.fillRect(0,0,avBarWidth,maxBarHeight * 0.4 * percent);
        ctx.restore();
        ctx.translate(-padding,0);
    }
    ctx.restore();
}

//draw the rotating av bars on the center
function drawAVBars(){
    barRotation += 0.01;
    let lineIterator = 0;
    
    ctx.save();
    ctx.translate(screenWidth/2,screenHeight/2);
    ctx.rotate(barRotation);

    for(let b of data){
        let barHeight = b * 0.6;
        ctx.save();
        ctx.rotate(lineIterator * 3.07);
        ctx.strokeStyle = avColor;
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(0, barHeight);
        ctx.stroke();
        ctx.restore();

        if(lineIterator > data.length * 0.68){
            drawBassEffect(0,0,b,barHeight);
        }

        lineIterator++;
    }
    ctx.restore();


}

//draw a bass effect 
function drawBassEffect(x,y,b,barHeight){
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = `rgba(${b},${200-b},${200-b}, 0.8)`;
    ctx.arc(x,y,barHeight * 1.4, 0, Math.PI *2)
    ctx.stroke();
    ctx.restore();
}

//spawns the sprite on one of the four edges of the screen
function spawnSprite(){
    let margin = 50;
	let rect = {left: margin, top: margin, width: screenWidth - margin*2, height: screenHeight-margin*3}
    let num = Math.round(getRandom(0,3));

    if(getRandom(0,10) > 5){
        let topOrBottom;

        if(getRandom(0,10) > 5) topOrBottom = -50;
        else topOrBottom = screenHeight + 50;

        sprites.push(createImageSprites(getRandom(0,screenWidth),topOrBottom,50,60,imageSprites[num],"cage",rect));
    }
    else{
        let leftOrRight;

        if(getRandom(0,10) > 5) leftOrRight = -50;
        else leftOrRight = screenWidth + 50;

        sprites.push(createImageSprites(leftOrRight,getRandom(0,screenHeight),50,60,imageSprites[num],"cage",rect));
    }
}

//set a key to true when its pressed
function keysDown(e)
{
    keys[e.key] = true;
    if(e.key === 'p') pause = !pause;
}

//set a key to false when its let go
function keysUp(e)
{
    keys[e.key] = false;
}

//rotate the shield 
function rotateShield(){
    if(keys['a']) rotation -= 0.05;
    if(keys['d']) rotation += 0.05;
}

//mouse interaction with canvas
function doMousedown(e){
	let mouse=getMouse(e);
	switch(gameState){
		case GameState.START:
            resetToDefault();
			gameState = GameState.MAIN;
			break;
        case GameState.MAIN:
            break;
			
		case GameState.GAMEOVER:
			gameState = GameState.START;
			break;
			
		default:
			throw new Error(MyErrors.mousedownSwitch);
	} // end switch
}

//fill text on canvas
function fillText(ctx,string,x,y,css,color){
	ctx.save();
	ctx.font = css;
	ctx.fillStyle = color;
	ctx.fillText(string, x,y);
	ctx.restore();
}

//stroke text on canvas
function strokeText(ctx,string,x,y,css,color,lineWidth){
	ctx.save();
	ctx.font = css;
	ctx.strokeStyle = color;
	ctx.lineWidth = lineWidth;
	ctx.strokeText(string,x,y);
	ctx.restore();
}