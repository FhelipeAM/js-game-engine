loadedLevel = [{"type":"level","keys":{"size":[9999.984375,799.984375],"img":"","LEntID":3553}},{"type":"weapon","keys":{"name":"emptyHands","type":"single","damage":0,"sndSet":[{"name":"attack","path":"./assets/snd/weapon/Gunshot2.ogg","loop":false,"vol":0.5}],"bulletSpeed":1,"range":100,"ammoCount":0,"ammoCountRes":0,"fireTime":2.2,"reloadTime":4}},{"type":"weapon","keys":{"name":"InstaKiller","type":"single","damage":999,"sndSet":[{"name":"attack","path":"./assets/snd/weapon/Gunshot2.ogg","loop":false,"vol":0.5}],"bulletSpeed":5,"range":150,"ammoCount":1,"ammoCountRes":0,"fireTime":10,"reloadTime":4}},{"type":"sentient","keys":{"movespeed":1,"ignoreGravity":false,"coll":[100,100],"solid":true,"weight":1,"mdl":"assets/img/testent8.png","docRefID":"player","pos":[182,686],"linkedTo":null,"linkedToOffset":[0,0],"aiEnabled":false,"infiniteAmmo":false,"oblivious":false,"notarget":false,"godMode":false,"health":10,"bulletSpeed":1,"weaponsName":"emptyHands","team":"allies"}},{"type":"entity","keys":{"movespeed":1,"ignoreGravity":true,"coll":[100,100],"solid":true,"weight":100,"mdl":"","docRefID":"Entity32","pos":[560,700],"linkedTo":null,"linkedToOffset":[0,0]}},{"type":"entity","keys":{"movespeed":1,"ignoreGravity":true,"coll":[300,100],"solid":true,"weight":100,"mdl":"","docRefID":"Entity68","pos":[660,600],"linkedTo":null,"linkedToOffset":[0,0]}},{"type":"entity","keys":{"movespeed":1,"ignoreGravity":true,"coll":[100,30],"solid":true,"weight":100,"mdl":"","docRefID":"Entity277","pos":[1291.6363525390625,700],"linkedTo":null,"linkedToOffset":[0,0]}},{"type":"entity","keys":{"movespeed":1,"ignoreGravity":true,"coll":[100,30],"solid":true,"weight":100,"mdl":"","docRefID":"Entity364","pos":[1107.6363525390625,594],"linkedTo":null,"linkedToOffset":[0,0]}},{"type":"entity","keys":{"movespeed":1,"ignoreGravity":true,"coll":[100,30],"solid":true,"weight":100,"mdl":"","docRefID":"Entity532","pos":[1265,461],"linkedTo":null,"linkedToOffset":[0,0]}},{"type":"entity","keys":{"movespeed":1,"ignoreGravity":false,"coll":[10,420],"solid":true,"weight":40,"mdl":"","docRefID":"Entity693","pos":[1390.4545288085938,375],"linkedTo":null,"linkedToOffset":[0,0]}},{"type":"trigger","keys":{"movespeed":1,"ignoreGravity":true,"coll":[200,10],"solid":false,"weight":1,"mdl":["",{}],"docRefID":"Trigg_hostiles","pos":[1404,399],"linkedTo":null,"linkedToOffset":[0,0],"type":["once"],"ignoreEntTypes":["bullet","uielem"]}},{"type":"trigger","keys":{"movespeed":1,"ignoreGravity":true,"coll":[100,100],"solid":false,"weight":1,"mdl":["",{}],"docRefID":"trololo_trigger","pos":[662,700],"linkedTo":null,"linkedToOffset":[0,0],"type":["once"],"ignoreEntTypes":["bullet","uielem"]}},{"type":"entity","keys":{"movespeed":1,"ignoreGravity":true,"coll":[10,100],"solid":true,"weight":100,"mdl":"","docRefID":"trololo_door","pos":[959,600],"linkedTo":null,"linkedToOffset":[0,0]}},{"type":"entity","keys":{"movespeed":1,"ignoreGravity":true,"coll":[200,10],"solid":true,"weight":100,"mdl":"","docRefID":"platform_godown","pos":[1401.1818237304688,422],"linkedTo":null,"linkedToOffset":[0,0]}},{"type":"origin","keys":{"movespeed":1,"ignoreGravity":true,"coll":[50,50],"solid":false,"weight":1,"mdl":["",{}],"docRefID":"trololo_spawner","pos":[843,705],"linkedTo":null,"linkedToOffset":[0,0]}},{"type":"entity","keys":{"movespeed":1,"ignoreGravity":true,"coll":[250,10],"solid":true,"weight":100,"mdl":"","docRefID":"Entity2004","pos":[1663.3636474609375,677],"linkedTo":null,"linkedToOffset":[0,0]}},{"type":"origin","keys":{"movespeed":1,"ignoreGravity":true,"coll":[50,50],"solid":false,"weight":1,"mdl":["",{}],"docRefID":"phase2_hostile","pos":[2068.0908813476562,687],"linkedTo":null,"linkedToOffset":[0,0]}},{"type":"origin","keys":{"movespeed":1,"ignoreGravity":true,"coll":[50,50],"solid":false,"weight":1,"mdl":["",{}],"docRefID":"elevator_dest","pos":[1404.0908813476562,797],"linkedTo":null,"linkedToOffset":[0,0]}}];

main();

function main() {
    setup_trololo();
    
    let phase2Starter = GetEnt("Trigg_hostiles");
    phase2Starter.OverrideAction(() => Phase2());
}

function Phase2() {

    let platform = GetEnt("platform_godown");
    let platformDest = GetEnt("elevator_dest");
    platform.MoveTo(platformDest.pos, false);

    let spawnerRef = GetEnt("phase2_hostile");

    let ai = SpawnHostile(spawnerRef.pos);

}

function setup_trololo() {
    let trololo = GetEnt("trololo_trigger");
    trololo.OverrideAction(async () => {
        let door = GetEnt("trololo_door");
        door.MoveTo([door.pos[0], door.pos[1] + door.coll[1]], false);

        let spawnerRef = GetEnt("trololo_spawner");

        await s(3);

        let ai = SpawnHostile(spawnerRef.pos);
    })
}

function SpawnHostile(sp) {
    let stubSEnt = new Sentient("Hostile"+entCount, sp, [100, 100], "assets/img/testent6.png", "axis", true);
    return stubSEnt;
}