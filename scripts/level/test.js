
var testcol4;

async function main() {

    testcol4 = new Sentient("testref23", [player.pos[0] * 2, player.pos[1]], [100, 100], "./assets/img/testent2.png", "axis", true);
    testcol4.movespeed = .8;
    testcol4.bulletSpeed = 100
    testcol4.GiveWeapon(GetWeaponByName("TESTRIFLE"));

    player.Teleport([700, 0]);

    // CollTest3();
    CollTest4();

    RegisterSound("sad_song1", "./assets/snd/music/sad_song1_faststart.mp3", false, 0.2);

    PlaySound(GetSoundInfo("sad_song1"));
    player.godMode = false;
    player.notarget = false;

    await player.OnGround();
    // await testref.Collide();


    var testcol5 = new Sentient("testref25", [player.pos[0], player.pos[1]], [100, 100], "./assets/img/testent.jpg", "team3", true)

}

async function CollTest3() {
    while (true) {
        var testcol32 = new Entity("ent" + entCount, [100, 0], [100, 100], "./assets/img/testent2.jpeg")
        await s(3);
        testcol32.Delete();
    }
}

async function CollTest() {

    await player.OnGround();

    var testcol = new Sentient("testref2", [0, 0], [100, 100], "./assets/img/testent.jpg", "axis", true)
    testcol.movespeed = 0.8;
}

async function CollTest4() {
    var testref32 = new Entity("testref32", testcol4.CenterOfMass(), [distance(player, testcol), 20], "blue")
    testref32.solid = false;
    testref32.ignoreGravity = true;

    while (true) {
        testref.Teleport(testcol4.CenterOfMass());
        testref.SetSize([distance(player, testcol4), 20]);

        if (testcol4.InRangeToTarget()) {
            testref32.SetModel("green");
        } else {
            testref32.SetModel("red");
        }

        await s(0.01);
    }
}

async function CollTest2() {

    while (testcol.health > 0) {
        var testcol3 = new Bullet("bullet" + entCount, [505, 300], testcol.CenterOfMass(), 15, "allies", ["./assets/snd/weapon/Gunshot.ogg", 0.3])
        // testcol3.movespeed = 1;
        await s(0.08);
    }
}