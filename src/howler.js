let pointUp;

//initialize howler sounds
const init = () =>{
    pointUp = new Howl({
        src: ['./sound/sfx_twoTone.mp3'],
        volume: 0.5
    });
}

export{init,pointUp};

