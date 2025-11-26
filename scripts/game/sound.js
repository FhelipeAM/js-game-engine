var sounds = [];

function _RegisterSounds() {
    RegisterSound("hit", ["./assets/snd/impact/hit_flesh_heavy1.ogg", "./assets/snd/impact/hit_flesh_heavy2.ogg", "./assets/snd/impact/hit_flesh_heavy3.ogg",], false, 0.7);
}

function RegisterSound(aname, apath, alooping, avol) {

    sounds.push({name: aname, path: apath, loop: alooping, vol: avol})
}

function GetSoundInfo(name) {
    let fsound = {
        name: "stub",
        sound: "./assets/snd/error.mp3",
        loop: false,
        vol: 0.2
    };

    sounds.forEach((snd) => {
        if (snd.name == name) {
            fsound = snd;
            return;
        }
    })

    return fsound;
}

function PlaySound(soundInfo) {

    if (soundInfo.path == null || soundInfo.path == "") {
        console.warn("Incorrect use of PlaySound(), check parameters and make sure the sound was properly registered.");
        return;
    }

    var audio = new Audio(PickRandomFromArray(soundInfo.path));
    audio.volume = soundInfo.vol;
    audio.loop = soundInfo.loop;
    audio.play();

    return audio;
}

function PickRandomFromArray(paths) {
    if (!Array.isArray(paths)) {
        return paths;
    } else {
        return paths[Math.floor(Math.random() * paths.length)]
    }
}