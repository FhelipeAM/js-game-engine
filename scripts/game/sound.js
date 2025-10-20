function PlaySound(sound, vol, loop) {
    var audio = new Audio(sound);
    audio.volume = vol;
    audio.loop = loop;
    audio.play();

    return audio;
}