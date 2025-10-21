async function main() {

    var testcol4 = new Sentient("testref23", [player.pos[0] * 2, player.pos[1]], [100, 100], "./assets/img/testent2.png", "axis", true);
    testcol4.movespeed = .8;
    // testcol4.GiveWeapon(GetWeaponByName("TESTRIFLE"));

    player.Teleport([2000, 0]);

    RegisterSound("sad_song1", "./assets/snd/music/sad_song1_faststart.mp3", false, 0.2);

    await player.OnGround();

    var testcol5 = new Sentient("testref25", [player.pos[0], player.pos[1]], [100, 100], "./assets/img/testent.jpg", "team3", true)
    
    await player.Death();
    
    PlaySound(GetSoundInfo("sad_song1"));
}
