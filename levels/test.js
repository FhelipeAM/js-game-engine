disableControls = false;
freecam = false;

var cando = true;
var cando2 = true;
var cando3 = true;

var newBool = true;

var working = false;

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

main();

async function main() {

    displayDamage = true;

    RegisterSound("song_test", "assets/snd/music/sad_song1_faststart.mp3", false, 1.0);

    player.Teleport([200, 500]);

    RegisterInput("m", "PlayMusicbind", () => { TestButton() });

    await WaitTillAction("PlayMusicbind");

    PlaySound(GetSoundInfo("song_test"));

}

async function entloop() {

    while (working) {

        var testcol5 = new Sentient("testref_1" + entCount, [2000, 300], [100, 100], "./assets/img/testent.jpg", "team3", true)

        await testcol5.Death();
    }
}

async function entloop2() {

    while (working) {

        var testcol4 = new Sentient("testref_2" + entCount, [0, 300], [100, 100], "./assets/img/testent2.png", "axis", true);

        await testcol4.Death();
    }
}