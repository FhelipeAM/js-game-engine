let playing = false;

loadedLevel = [{"type":"level","keys":{"size":[1100,1000],"img":""}},{"type":"weapon","keys":{"name":"emptyHands","type":"single","damage":"0","sndSet":[{"name":"attack","path":"./assets/snd/weapon/Gunshot2.ogg","loop":false,"vol":0.5}],"bulletSpeed":"1","range":"0","ammoCount":"0","ammoCountRes":"0","fireTime":"0","reloadTime":"100"}},{"type":"sentient","keys":{"movespeed":1,"ignoreGravity":false,"coll":[100,100],"solid":true,"weight":"1","mdl":"./assets/img/testplayer.jpg","docRefID":"player","pos":[225,597],"linkedTo":null,"linkedToOffset":[0,0],"aiEnabled":false,"infiniteAmmo":false,"oblivious":false,"notarget":false,"godMode":false,"health":"3","bulletSpeed":1,"weaponsName":"DEFAULTMELEE","team":"allies"}},{"type":"entity","keys":{"movespeed":1,"ignoreGravity":false,"coll":[20,300],"solid":true,"weight":"40","mdl":"","docRefID":"Entity769","pos":[840,500],"linkedTo":null,"linkedToOffset":[0,0]}},{"type":"sentient","keys":{"movespeed":1,"ignoreGravity":false,"coll":[100,100],"solid":true,"weight":1,"mdl":"","docRefID":"Sentient876","pos":[736,685],"linkedTo":null,"linkedToOffset":[0,0],"aiEnabled":true,"infiniteAmmo":false,"oblivious":false,"notarget":false,"godMode":true,"health":"9999","bulletSpeed":1,"weaponsName":"DEFAULTMELEE","team":"axis"}},{"type":"entity","keys":{"movespeed":1,"ignoreGravity":false,"coll":[20,200],"solid":true,"weight":"40","mdl":"","docRefID":"Entity1012","pos":[715,599],"linkedTo":null,"linkedToOffset":[0,0]}},{"type":"entity","keys":{"movespeed":1,"ignoreGravity":false,"coll":[20,100],"solid":true,"weight":"40","mdl":"","docRefID":"Entity1076","pos":[614,698],"linkedTo":null,"linkedToOffset":[0,0]}},{"type":"entity","keys":{"movespeed":1,"ignoreGravity":true,"coll":[100,100],"solid":true,"weight":1,"mdl":"","docRefID":"Entity130","pos":[888,473],"linkedTo":null,"linkedToOffset":[0,0]}},{"type":"entity","keys":{"movespeed":1,"ignoreGravity":false,"coll":[100,10],"solid":true,"weight":1,"mdl":"","docRefID":"Entity346","pos":[695,567],"linkedTo":null,"linkedToOffset":[0,0]}}];
SetGameBackground("assets/img/testbg.jpg");

main();

function main() {

    RegisterSound("music", "assets/snd/music/sad_song1_faststart.mp3", true, 0.3);

    RegisterInput("f", "playMusic", async () => {

        if (playing)
            return;

        playing = true;
        PlaySound(GetSoundInfo("music"))
        SetGameBackground("assets/img/testent2.png");
    });

}