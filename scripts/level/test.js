disableControls = false;

async function main() {
    
    player.Teleport([200, 500]);
    player.godMode = true;
    player.solid = false;
    player.notarget = true;
    // player.health = 10000
    
    await player.OnGround();

    funnyloop();

    entloop();
    entloop2();
}

async function funnyloop() {

    var test = new GameText(player.pos, "Test", {color: "red", alignX: "center", alignY: "center", fontSize: 128})

    while (true) {
        await test.FadeIn(1);

        await test.FadeOut(1);
    }
}

async function entloop() {

    while (true) {
            
        var testcol5 = new Sentient("testref_1"+entCount, [2000, 300], [100, 100], "./assets/img/testent.jpg", "team3", true)
        testcol5.GiveWeapon(GetWeaponByName("TESTRIFLE"));

        await testcol5.Death();
    }
}

async function entloop2() {

    while (true) {
                
        var testcol4 = new Sentient("testref_2"+entCount, [0, 300], [100, 100], "./assets/img/testent2.png", "axis", true);
        testcol4.GiveWeapon(GetWeaponByName("TESTRIFLE2"));
        
        await testcol4.Death();
    }
}