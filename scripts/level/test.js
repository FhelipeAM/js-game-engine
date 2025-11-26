disableControls = false;
freecam = false;

var cando = true;
var cando2 = true;
var cando3 = true;

var newBool = true;

var working = false;

// var StopTheCount = new GameButton([1200, 300],[300, 500],"Stop the count",TestButton,true,{color: "green",alignX: "center",alignY: "center",fontSize: 128,border: {borderImg: "green",borderSize: 4,borderStyle: "solid"}})

var evilText = new GameText(
    [0, 0],
    [100, 100],
    "Bringing it on",
    {
        color: "#660044",
        alignX: "center",
        alignY: "center",
        fontSize: 64,
        opacity: 0,
    }
)

var FreecamText = new GameText(
    [0, 0],
    [600, 100],
    "Freecam ON",
    {
        color: "#000000",
        alignX: "center",
        alignY: "center",
        fontSize: 64,
        opacity: 0,
    },
    true
)

evilText.linkTo(player, [0, -100]);

RegisterInput("f", "EvilThing", async () => {

    if (!cando)
        return;

    cando = false;

    if (!working) {

        working = true;
        
        entloop();
        entloop2();
        
        await evilText.FadeIn(1);

    } else {
        working = false;
        await evilText.FadeOut(1);
    }

    cando = true;
});

var evilText2 = new GameText(
    [300, 200],
    [100, 100],
    "nothing",
    {
        color: "#000000",
        alignX: "center",
        alignY: "center",
        fontSize: 32,
    },
    true
)

RegisterInput("c", "Freecam", async () => {

    if (!cando2)
        return;

    cando2 = false;
    
    freecam = !freecam;

    if (freecam)
        FreecamText.Show()
    else
        FreecamText.Hide()

    await ms(100);

    cando2 = true;
});

RegisterInput("x", "weaponSwitch", async () => {

    if (!cando3)
        return;

    cando3 = false;

    if (newBool)
        player.GiveWeapon(GetWeaponByName("TESTRIFLE"));
    else 
        player.GiveWeapon(GetWeaponByName("GODRIFLE"));

    await ms(100);

    newBool = !newBool;

    evilText2.SetText(newBool);

    cando3 = true;
});

main();

async function TestButton() {

    working = false;

    player.godMode = true;
    player.solid = false;
    player.notarget = true;

}

async function main() {

    RegisterSound("song_test", "assets/snd/music/sad_song1_faststart.mp3", false, 1.0);

    player.Teleport([200, 500]);
    // player.godMode = true;
    // player.solid = true;
    // player.notarget = false;
    // player.infiniteAmmo = true;
    player.health = 500;
    // player.GiveWeapon(GetWeaponByName("TESTRIFLE"));
    // player.GiveWeapon(GetWeaponByName("GODRIFLE"));

    RegisterInput("m", "PlayMusicbind", () => {TestButton()});

    // await player.OnGround();
    await WaitTillAction("PlayMusicbind");

    PlaySound(GetSoundInfo("song_test"));
    console.log("reckoned actioned");

}

async function entloop() {

    while (working) {

        var testcol5 = new Sentient("testref_1" + entCount, [2000, 300], [100, 100], "./assets/img/testent.jpg", "allies", true)
        testcol5.GiveWeapon(GetWeaponByName("TESTRIFLE"));

        await testcol5.Death();
    }
}

async function entloop2() {

    while (working) {

        var testcol4 = new Sentient("testref_2" + entCount, [0, 300], [100, 100], "./assets/img/testent2.png", "axis", true);
        // testcol4.GiveWeapon(GetWeaponByName("TESTRIFLE2"));

        await testcol4.Death();

        // testcol4.Delete();
    }
}