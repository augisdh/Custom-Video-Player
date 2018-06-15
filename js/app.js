"use strict";

const player = document.querySelector(".player");
const video = document.querySelector(".player .viewer");
const barProgress = document.querySelector(".player-controls .progress");
const barProgressFilled = document.querySelector(".player-controls .progress .progress-filled");
const playBtn = document.querySelector(".player-controls .toggle");
const ranges = document.querySelectorAll(".player-controls .player-slider");
const skipBtns = document.querySelectorAll(".player-controls [data-skip]");
const fullScreenBtn = document.querySelector(".player-controls .full-screen");

let runningInterval;
let playing = false;
let mouseDown = false;
let fullScreenMode = false;

function videoPlaying(){
    video.play();
    playBtn.innerHTML = "&#10074;&#10074;";
    runningInterval = setInterval(() => {
        if(video.currentTime === video.duration){
            video.currentTime = 0;
            playing = false;
            videoStop();
        }
    }, 1);
}

function videoStop(){
    clearInterval(runningInterval);
    video.pause();
    playBtn.innerHTML = "&#9658";
}

function skipVideo(){
    video.currentTime += parseFloat(this.dataset.skip);
}

function rangeUpdate(){
    video[this.name] = this.value;
}

function progressUpdate(){
    const percent = (video.currentTime / video.duration) * 100;
    barProgressFilled.style.flexBasis = `${percent}%`;
}

function scrub(event){
    const scrubTime = (event.offsetX / barProgress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
}

function fullScreen(event){
    fullScreenMode = !fullScreenMode;
    (fullScreenMode === true) ? player.webkitRequestFullScreen() : document.webkitExitFullscreen();
}

video.addEventListener("click", () => {
    playing = !playing;
    (playing === true) ? videoPlaying() : videoStop();
})

video.addEventListener("timeupdate", progressUpdate);
barProgress.addEventListener("click", scrub);
barProgress.addEventListener("mousemove", (event) => mouseDown && scrub(event));
barProgress.addEventListener("mousedown", () => mouseDown = true);
barProgress.addEventListener("mouseup", () => mouseDown = false);

playBtn.addEventListener("click", () => {
    playing = !playing;
    (playing === true) ? videoPlaying() : videoStop();
});

ranges.forEach(range => range.addEventListener("change", rangeUpdate));
ranges.forEach(range => range.addEventListener("mousemove", rangeUpdate));
skipBtns.forEach(button => button.addEventListener("click", skipVideo));
fullScreenBtn.addEventListener("click", fullScreen, false);