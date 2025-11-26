disableControls = false;

var working = true;

var StopTheCount = new GameButton(
    [1200, 300],
    [300, 500],
    "Stop the count", 
    TestButton,
    true,
    {
        color: "green", 
        alignX: "center", 
        alignY: "center", 
        fontSize: 128, 
        border: {
            borderImg: "green",
            borderSize: 4,
            borderStyle: "solid"
        }
    }
)

async function TestButton() {

    StopTheCount.Delete();

    cl("clickerd");
    
    RegisterSound("song_test", "assets/snd/music/sad_song1_faststart.mp3", false, 1.0);

    working = false;

    player.godMode = true;
    player.solid = false;
    player.notarget = true;

    PlaySound(GetSoundInfo("song_test"));
} 

async function main() {
    
    player.Teleport([200, 500]);
    // player.godMode = true;
    // player.solid = true;
    // player.notarget = false;
    // player.infiniteAmmo = true;
    player.health = 500
    
    await player.OnGround();

    entloop();
    entloop2();

    player.GiveWeapon(GetWeaponByName("GODRIFLE"));
}

async function entloop() {

    while (working) {
            
        var testcol5 = new Sentient("testref_1"+entCount, [2000, 300], [100, 100], "./assets/img/testent.jpg", "team3", true)
        // testcol5.GiveWeapon(GetWeaponByName("TESTRIFLE"));

        await testcol5.Death();

        // testcol5.Delete();
    }
}

async function entloop2() {

    while (working) {
                
        var testcol4 = new Sentient("testref_2"+entCount, [0, 300], [100, 100], "./assets/img/testent2.png", "axis", true);
        // testcol4.GiveWeapon(GetWeaponByName("TESTRIFLE2"));
        
        await testcol4.Death();

        // testcol4.Delete();
    }
}