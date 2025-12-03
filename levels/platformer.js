let playing = false;


//entities were duplicated for some reason.
loadedLevel = [{"type":"level","keys":{"size":[3000,800],"img":"url(\"assets/img/testbg.jpg\")"}},{"type":"weapon","keys":{"name":"emptyHands","type":"single","damage":"0","sndSet":[{"name":"attack","path":"./assets/snd/weapon/Gunshot2.ogg","loop":false,"vol":0.5}],"bulletSpeed":"1","range":"0","ammoCount":"0","ammoCountRes":"0","fireTime":"0","reloadTime":"100"}},{"type":"sentient","keys":{"movespeed":1,"ignoreGravity":false,"coll":[100,100],"solid":true,"weight":"1","mdl":"assets/img/testent8.png","docRefID":"player","pos":[225,597],"linkedTo":null,"linkedToOffset":[0,0],"aiEnabled":false,"infiniteAmmo":false,"oblivious":false,"notarget":false,"godMode":false,"health":"3","bulletSpeed":1,"weaponsName":"emptyHands","team":"allies"}},{"type":"entity","keys":{"movespeed":1,"ignoreGravity":false,"coll":[20,300],"solid":true,"weight":"40","mdl":"#ff0000","docRefID":"Entity769","pos":[840,500],"linkedTo":null,"linkedToOffset":[0,0]}},{"type":"sentient","keys":{"movespeed":1,"ignoreGravity":false,"coll":[100,100],"solid":true,"weight":1,"mdl":"assets/img/testent3.png","docRefID":"Sentient876","pos":[933,303],"linkedTo":null,"linkedToOffset":[0,0],"aiEnabled":true,"infiniteAmmo":false,"oblivious":false,"notarget":false,"godMode":true,"health":"9999","bulletSpeed":1,"weaponsName":"DEFAULTMELEE","team":"axis"}},{"type":"entity","keys":{"movespeed":1,"ignoreGravity":false,"coll":[20,200],"solid":true,"weight":"40","mdl":"#e1ff00","docRefID":"Entity1012","pos":[715,599],"linkedTo":null,"linkedToOffset":[0,0]}},{"type":"entity","keys":{"movespeed":1,"ignoreGravity":false,"coll":[20,100],"solid":true,"weight":"40","mdl":"#ff7070","docRefID":"Entity1076","pos":[614,698],"linkedTo":null,"linkedToOffset":[0,0]}},{"type":"entity","keys":{"movespeed":1,"ignoreGravity":false,"coll":[100,100],"solid":true,"weight":"0.1","mdl":"#bbffad","docRefID":"Entity130","pos":[888,473],"linkedTo":null,"linkedToOffset":[0,0]}},{"type":"entity","keys":{"movespeed":1,"ignoreGravity":true,"coll":[300,300],"solid":false,"weight":1,"mdl":"assets/img/testent5.png","docRefID":"Entity346","pos":[352,134],"linkedTo":null,"linkedToOffset":[0,0]}},{"type":"trigger","keys":{"movespeed":1,"ignoreGravity":true,"coll":[100,100],"solid":false,"weight":1,"mdl":["",{}],"docRefID":"AntiStuckTrigger","pos":[737,698],"linkedTo":null,"linkedToOffset":[0,0],"type":["once"],"ignoreEntTypes":["bullet","uielem"]}}];

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

    let trigger = GetEnt("AntiStuckTrigger");
    trigger.ignoreEntTypes.push("entity");
    trigger.OverrideAction((collider) => {
        collider.health = 0;
    })
}