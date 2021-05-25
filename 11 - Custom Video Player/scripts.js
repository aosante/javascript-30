//Get our elements
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

const fullscreen = player.querySelector('#fullscreen');
const body = document.body;



//Build the functions
function togglePlay() { //si está en pausa, le da play, si está en play, le pone pausa
    const method = video.paused ? 'play' : 'pause';
    video[method]();
}

function updateButton() { //cambia el icono de play a pausa o viceversa
    const icon = this.paused ?  '►' : '❚ ❚';
    toggle.textContent = icon;
}


function skip() { //adelanta o rebobina el video
    video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() { //sube y baja velocidad y volumen
    video[this.name] = this.value;
}

function handleProgress() { //cambia el progress bar dependiendo del tiempo actual del video
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
}

function toggleFullScreen() {
    video.webkitRequestFullScreen();
}



//Hook up the event listeners

//play o pausa cuando se estripa spaceBar
body.addEventListener('keyup' ,(e) => {
    if(e.keyCode == 32) {
        togglePlay();
    }
});


video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);

let mousedown = false;

progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);


toggle.addEventListener('click', togglePlay);

skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate)); 
//handleRangeUpdate se puede llamar tambien cuando el 

fullscreen.addEventListener('click', toggleFullScreen);
//fullscreen al hacer click en F
body.addEventListener('keyup', (e) => {
    if(e.keyCode == 70) {
        toggleFullScreen();
    }
});

