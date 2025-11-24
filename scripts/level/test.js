disableControls = false;

async function main() {
    
    player.Teleport([200, 500]);
    // player.godMode = true;
    // player.solid = true;
    // player.notarget = false;
    // player.infiniteAmmo = true;
    player.health = 500
    
    await player.OnGround();

    funnyloop();

    entloop();
    entloop2();

    player.GiveWeapon(GetWeaponByName("TESTRIFLE2"));
}

async function funnyloop() {

    var test = new GameText(player.pos, "Test", {color: "red", alignX: "center", alignY: "center", fontSize: 128})

    while (true) {
        await ms(1);

        test.SetText(sentients.length);
    }
}

async function entloop() {

    while (true) {
            
        var testcol5 = new Sentient("testref_1"+entCount, [2000, 300], [100, 100], "./assets/img/testent.jpg", "team3", true)
        // testcol5.GiveWeapon(GetWeaponByName("TESTRIFLE"));

        await testcol5.Death();

        // testcol5.Delete();
    }
}

async function entloop2() {

    while (true) {
                
        var testcol4 = new Sentient("testref_2"+entCount, [0, 300], [100, 100], "./assets/img/testent2.png", "axis", true);
        // testcol4.GiveWeapon(GetWeaponByName("TESTRIFLE2"));
        
        await testcol4.Death();

        // testcol4.Delete();
    }
}