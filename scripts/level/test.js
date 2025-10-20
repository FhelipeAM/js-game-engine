var testref = new Entity("testref", [515, 300], [10, 500], "./assets/img/testent2.jpeg")
var testcol = new Sentient("testref2", [0, 0], [100, 100], "./assets/img/testent.jpg", "axis", true)
testref.Hide();

async function main() {

    player.Teleport([700, 0]);

    player.docRef.innerText = "balls"
    player.godMode = false;
    player.notarget = false;
    
    // CollTest();
    testcol.movespeed = 0.35;

    await testref.Collide();

    if (testref.collTarget == player)
        CollTest2();
    else 
        PlaySound("./assets/snd/music/sad_song1_faststart.mp3", 0.3, true)
}

async function CollTest() {

    await player.OnGround();
    
    var testcol = new Sentient("testref2", [0, 0], [100, 100], "./assets/img/testent.jpg", "axis", true)
    testcol.movespeed = 0.8;
}

async function CollTest2() {

    while (testcol.health > 0) {
        var testcol3 = new Bullet("bullet"+entities.length, [505, 300], posSnap(testcol), 15, "allies", ["./assets/snd/weapon/Gunshot.ogg", 0.3])
        // testcol3.movespeed = 1;
        await s(0.08);
    }
}