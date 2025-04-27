// coded by DonQuaya

// Right here I am grabbing all the elements that I need for the MP3 player UI(user interface)
let now_playing = document.querySelector('.now-playing');
let track_art = document.querySelector('.track-art');
let track_name = document.querySelector('.track-name');
let track_artist = document.querySelector('.track-artist');

let playpause_btn = document.querySelector('.playpause-track');
let next_btn = document.querySelector('.next-track');
let prev_btn = document.querySelector('.prev-track');

let seek_slider = document.querySelector('.seek_slider');
let volume_slider = document.querySelector('.volume_slider');
let curr_time = document.querySelector('.current-time');
let total_duration = document.querySelector('.total-duration');
let wave = document.getElementById('wave');
let randomIcon = document.querySelector('.fa-random');
let curr_track = document.createElement('audio');

// Here I am defining the variables to keep track of song state
let track_index = 0;
let isPlaying = false;
let isRandom = false;
let updateTimer;

//Here I am creating a playlist by listing songs with their cover art, name, artist, and file path. ** assigning the cover art, arist and the song.
const music_list = [
    {
        img : './IMG_1449.jpeg',
        name : 'Baecation',
        artist : 'Juggified Steppa',
        music : './baecation.mp3'
    },
    {
        img : './IMG_1449.jpeg',
        name : 'Emotional Damage',
        artist : 'Juggified Steppa',
        music : './emotional.mp3'
    },
];

//Right here I am instructing the mp3 player to load the first track when the page loads. **creating a function that plays the first song
loadTrack(track_index);

//Right here I am creating a function to load a track based on its index in the playlist **track 1, track  2 etc. 
function loadTrack(track_index){
    clearInterval(updateTimer);
    reset();

    // Right here I am instructing the function to load the new track's music, artwork, name, and artist ** when the user goes to the next song the album picture and name changes etc. 
    curr_track.src = music_list[track_index].music;
    curr_track.load();

    track_art.style.backgroundImage = "url(" + music_list[track_index].img + ")";
    track_name.textContent = music_list[track_index].name;
    track_artist.textContent = music_list[track_index].artist;
    now_playing.textContent = "Playing music " + (track_index + 1) + " of " + music_list.length;

 // Here I am instructing the function to update the seek slider and track times every second ** so every second that goes by the dot moves closer to the end indicating the position of the song
    updateTimer = setInterval(setUpdate, 1000);

    // Here I am instructing the function to move to the next track automatically when the current one ends **the player will automatically go to the next songs once the current songs comes to an end.
    curr_track.addEventListener('ended', nextTrack);


    // This is completely optional. This is when I instructed the function to change background everytime the player or page refreshes. It will generate a random background gradient (you can comment this out if you prefer)
    random_bg_color();
}


// Similar to the above explation this function randomly changes the background color with a gradient
function random_bg_color(){
    let hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e'];
    let a;

    function populate(a){
        for(let i=0; i<6; i++){
            let x = Math.round(Math.random() * 14);
            let y = hex[x];
            a += y;
        }
        return a;
    }
    let Color1 = populate('#');
    let Color2 = populate('#');
    var angle = 'to right';

    let gradient = 'linear-gradient(' + angle + ',' + Color1 + ', ' + Color2 + ")";
    document.body.style.background = gradient;
}

// Right here I created a function to reset the player UI (user interface) when loading a new song
function reset(){
    curr_time.textContent = "00:00";
    total_duration.textContent = "00:00";
    seek_slider.value = 0;
}

// This function is for having a toggle random mode on/off
function randomTrack(){
    isRandom ? pauseRandom() : playRandom();
}
// This function turns random mode ON
function playRandom(){
    isRandom = true;
    randomIcon.classList.add('randomActive');
}

// This function turn random mode OFF
function pauseRandom(){
    isRandom = false;
    randomIcon.classList.remove('randomActive');
}

// This function repeats the current track
function repeatTrack(){
    let current_index = track_index;
    loadTrack(current_index);
    playTrack();
}

// This function toggles between the play and pause states
function playpauseTrack(){
    isPlaying ? pauseTrack() : playTrack();
}

// This function plays the current track
function playTrack(){
    curr_track.play();
    isPlaying = true;
    track_art.classList.add('rotate'); 
    wave.classList.add('loader');
    playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';  // This changes the button to pause icon

}

// This function pauses the current track
function pauseTrack(){
    curr_track.pause();
    isPlaying = false;
    track_art.classList.remove('rotate'); // This stops the rotating the album art
    wave.classList.remove('loader'); // This stops showing the wave animation
    playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>'; // This changes the button to play icon
}

// This function moves the player to the next track
function nextTrack(){
    if(track_index < music_list.length - 1 && isRandom === false){
        track_index += 1; // This plays the next track normally
    }else if(track_index < music_list.length - 1 && isRandom === true){
        let random_index = Number.parseInt(Math.random() * music_list.length); // This picks a random track
        track_index = random_index;
    }else{
        track_index = 0; // This tells the player once it reaches the end of the playlist, to start over
    }
    loadTrack(track_index);
    playTrack();
}

// This function moves to the previous track in the playlist
function prevTrack(){
    if(track_index > 0){
        track_index -= 1; // This instructs the player to go back to the previous track
    }else{
        track_index = music_list.length -1; // This instructs the player to go the last song on the playlist if the user clicks previous while on the first song
    }
    loadTrack(track_index);
    playTrack();
}

// This function moves to a specific part of the song based on slider position
function seekTo(){
    let seekto = curr_track.duration * (seek_slider.value / 100);
    curr_track.currentTime = seekto;
}

// This function sets the volume based on slider position
function setVolume(){
    curr_track.volume = volume_slider.value / 100;
}

// This function updates the seek slider, current time, and total duration while the track is playing
function setUpdate(){
    let seekPosition = 0;
    if(!isNaN(curr_track.duration)){
        seekPosition = curr_track.currentTime * (100 / curr_track.duration);
        seek_slider.value = seekPosition;

        let currentMinutes = Math.floor(curr_track.currentTime / 60);
        let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
        let durationMinutes = Math.floor(curr_track.duration / 60);
        let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

        // This is instructing the player to formatting time ** 01:05 instead of 1:5
        if(currentSeconds < 10) {currentSeconds = "0" + currentSeconds; }
        if(durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
        if(currentMinutes < 10) {currentMinutes = "0" + currentMinutes; }
        if(durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

        // This is instructing the player to update UI (user interface) elements
        curr_time.textContent = currentMinutes + ":" + currentSeconds;
        total_duration.textContent = durationMinutes + ":" + durationSeconds;
    }
}

// coded by DonQuaya