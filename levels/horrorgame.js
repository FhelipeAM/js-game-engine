loadedLevel = "hardcoded";

var hudElem_points = new GameText([-720, -420], ["max-content", "max-content"], "Points: 0", {...HUDStyle, color: "white"}, true)

var wallhack = false;
const playerViewRadius = 700;
var points = 0;

main();

var GamePlayMusic = PlaySound(GetSoundInfo("game_start_song"));

async function main() {

    displayDamage = false;
    hudElem_health.Hide();

    SetPlayableAreaSize([7000, 7000]);
    SetGameBackground("assets/img/testbg.jpg");

    setHUDTextColor("#fff");
    hudContainer.AttachToMe(hudElem_points);

    RegisterSound(
        "game_start_song",
        [
            "assets/snd/music/bt_stealth_01_lp.mp3",
            "assets/snd/music/bt_stealth_02_lp.mp3",
        ],
        true,
        0.3
    );

    RegisterSound("horror_sound", ["assets/snd/misc/Horror1.ogg", "assets/snd/misc/Horror2.ogg", "assets/snd/misc/Horror3.ogg", "assets/snd/misc/Horror4.ogg"], false, 0.6);
    RegisterSound("chase_music", "assets/snd/music/106.ogg", true, 0.3);

    RegisterSound("death_sound", "assets/snd/misc/go_alert2a.wav", false, 0.5);

    RegisterSound("player_box_break", "assets/snd/impact/door_wd_kick02.wav", false, 0.5);

    new Weapon("emptyhands", "single", 0, 0, 0, 0, 2.2, 5, 10, [
        {
            name: "attack",
            path: "./assets/snd/weapon/Gunshot2.ogg",
            loop: false,
            vol: 0.5
        },
        {
            name: "dryfire",
            path: "./assets/snd/weapon/DryFire.ogg",
            loop: false,
            vol: 0.5
        },
        {
            name: "reload",
            path: "./assets/snd/weapon/reload_m16.ogg",
            loop: false,
            vol: 0.2
        }
    ])

    new Weapon("instaKiller", "single", 9999, 200, Infinity, 0, 10, 1, 10, [
        {
            name: "attack",
            path: ["assets/snd/weapon/Slash1.ogg", "assets/snd/weapon/Slash2.ogg"],
            loop: false,
            vol: 0.5
        },
    ])

    SetupPlayer();

    CreateHouses();

    LootBoxSpawner();
}

async function SetupPlayer() {

    player.ignoreGravity = true;
    player.movespeed = 2;
    player.GiveWeapon(GetWeaponByName("emptyhands"));

    player.onDeath = () => {
        GameOver();
    }

    let darkOverlay = new GameContainer([0, 0], [GameSafeSpace.right, GameSafeSpace.bottom], {
        mixBlend: "multiply",
        BGColor: "#000000ff"
    }, false, false);

    player.Teleport(await RandomTillValid(player.coll), true);

    let visRadius = new Entity("PlayerVisRadius", player.pos, [(playerViewRadius * 2 - player.CenterOfMass()[0]), (playerViewRadius * 2 - player.CenterOfMass()[1])], ["", {}])
    visRadius.SetModel(["", {
        BGColor: `radial-gradient(circle, white 10%, transparent 70%)`,
        index: 1,
        border: {
            borderRadius: "50%"
        }
    }])
    visRadius.ignoreGravity = true;
    visRadius.solid = false;
    visRadius.linkTo(player, [(visRadius.CenterOfMass()[0] * -1) + player.CenterOfMass()[0], (visRadius.CenterOfMass()[1] * -1) + player.CenterOfMass()[0]]);
    darkOverlay.AttachToMe(visRadius);

    RemoveInput("jump");

    RegisterInput("w", "MoveUp", async () => {

        if (movementTarget.pos[1] > GameSafeSpace.top) {
            diry = movementTarget.pos[1] - 1;
        }

        movementTarget.MoveTo([dirx, diry], true);

        diry = movementTarget.pos[1];

    });

    RegisterInput("s", "MoveDown", async () => {

        if (movementTarget.pos[1] < GameSafeSpace.bottom - movementTarget.coll[1]) {
            diry = movementTarget.pos[1] + 1;
        }

        movementTarget.MoveTo([dirx, diry], true);

        diry = movementTarget.pos[1]

    });

    RegisterInput("k", "KillPlayer", async () => {
        player.health = 0;
    });
}

async function LootBoxSpawner() {

    let threat = await CreateEnemy();

    HideEnemy(threat);

    while (player.health > 0) {

        let box = await CreateLootBox();
        HideLB(box);

        await PlayerCollision(box);

        PlaySound(GetSoundInfo("player_box_break"));
        points++;
        box.Delete();

        threat.movespeed = 1 + (points / 10);

        hudElem_points.SetText("Points: " + points);
    }
}

async function PlayerCollision(ent) {

    await ms(tickrate);

    await ent.Collide();

    if (ent.collTarget != player)
        await PlayerCollision(ent);
    else
        return;
}

async function CreateEnemy() {

    let stubEnt = new Sentient("Sentient" + entCount, [0, 0], [100, 100], "./assets/img/testent.jpg", "axis", true);
    stubEnt.GiveWeapon(GetWeaponByName("instaKiller"));
    stubEnt.SetModel("assets/img/testent3.png");
    stubEnt.ignoreGravity = true;
    stubEnt.Teleport(await RandomTillValid(stubEnt.coll), true);

    return stubEnt;
}

async function CreateLootBox() {
    var stubEnt = new Entity("lootbox" + entCount, [0, 0], [100, 100], "./assets/img/testplayer.jpg");
    stubEnt.ignoreGravity = true;
    stubEnt.solid = false;

    stubEnt.Teleport(await RandomTillValid(stubEnt.coll), true);

    return stubEnt;
}

function CreateHouses() {

    for (let i = 0; i < Math.max((Math.random() * 14), 5); i++) {
        let entColl = [Math.max((Math.random() * 3000), 1000), Math.max((Math.random() * 3000), 1000)];

        let stubEnt = new Entity("HOUSE" + entCount, PickRandomPos(entColl), entColl, ["", { BGColor: "#000", index: 2 }]);
        stubEnt.ignoreGravity = true;
        stubEnt.weight = 10000;
        stubEnt.solid = true;
    }
}

async function RandomTillValid(collSize) {

    let pos = [0, 0];
    let valid = false;
    var stubEnt = new Entity("colltest" + entCount, pos, collSize, "transparent");
    stubEnt.ignoreGravity = true;
    stubEnt.weight = 10000;
    stubEnt.solid = false;

    while (!valid) {

        pos = PickRandomPos(collSize);
        stubEnt.Teleport(pos, true);

        await ms(tickrate + 5)

        if (stubEnt.collTarget == undefined) {
            stubEnt.Delete();
            valid = true;
        }

        stubEnt.collTarget = undefined
    }

    return pos;
}

async function HideEnemy(enemy) {

    if (wallhack) {
        let entPos = new Entity("refPos" + entCount, enemy.pos, enemy.coll, ["", {
            border: {
                borderImg: "red",
                borderSize: 2,
                borderStyle: "solid"
            },
        }])
        entPos.ignoreGravity = true;
        entPos.solid = false;
        entPos.linkTo(enemy)
    }

    let chaseMusic = undefined;
    let chaseStartTime = 0;
    let chaseFalloffTime = 3000;

    let beingChased = false;

    enemy.Hide();

    while (player.health > 0) {

        if (distance(player, enemy) < playerViewRadius) {
            if (!beingChased) {

                StopSound(GamePlayMusic);
                PlaySound(GetSoundInfo("horror_sound"))

                chaseMusic = PlaySound(GetSoundInfo("chase_music"))
                chaseMusic.playbackRate = 1 + (points / 30);

                beingChased = true;
            }

            let lightLevel = 1 - (distance(player, enemy) / playerViewRadius)

            chaseStartTime = timePassed;

            enemy.Show();

            enemy.docRef.style.opacity = lightLevel;

        } else {

            if (beingChased && timePassed > chaseStartTime + chaseFalloffTime) {

                enemy.Teleport(await RandomTillValid(enemy.coll), false);

                beingChased = false;

                if (chaseMusic != undefined) {
                    SndFadeOut(chaseMusic, 3);
                }

                GamePlayMusic = PlaySound(GetSoundInfo("game_start_song"));

            }

            enemy.Hide();
        }

        await ms(tickrate);
    }

}

//sometimes we just can't recycle
async function HideLB(box) {

    if (wallhack) {
        let entPos = new Entity("refPos" + entCount, box.pos, box.coll, ["", {
            border: {
                borderImg: "blue",
                borderSize: 2,
                borderStyle: "solid"
            },
        }])
        entPos.ignoreGravity = true;
        entPos.solid = false;
        entPos.linkTo(box)

        box.onDelete = () => {
            entPos.Delete();
        }
    }

    box.Hide();

    while (player.health > 0 && box.docRef != undefined) {

        if (distance(player, box) < playerViewRadius) {

            box.Show();

            let lightLevel = 1 - (distance(player, box) / playerViewRadius)

            box.docRef.style.opacity = lightLevel;
        } else {

            box.Hide();
        }

        await ms(tickrate);
    }
}

async function GameOver() {

    StopSound(GamePlayMusic);
    PlaySound(GetSoundInfo("death_sound"));

    const Centralizer = new GameContainer(
        [0, 0],
        ["100%", "100%"],
        {
            display: "flex",
            alignX: "center",
            alignY: "center"
        },
        true,
        true
    );

    const HorrorContainer = new GameContainer(
        [0, 0],
        [1000, 1000],
        {
            position: "absolute",
            display: "flex",
            alignX: "center",
            alignY: "center"
        },
        true,
        false
    );

    const GameOverContainer = new GameContainer(
        [0, 0],
        ["auto", "auto"],
        {
            display: "flex",
            flexDir: "column",

            alignX: "center",
            alignY: "center",

            textAlign: "center",

            padding: 20,
            gap: 10,
            BGColor: "#eeeeeeee",
            border: {
                borderImg: "black",
                borderSize: 3,
                borderStyle: "solid",
                borderRadius: 25
            },
            opacity: 0
        },
        true,
        false
    );

    HorrorContainer.SetModel("assets/img/testent5.png")

    const DeathMessage = new GameText(
        [0, 0],
        [500, 55],
        "You died!",
        {
            position: "relative",
            alignX: "center",
            alignY: "center",
            color: "red",
            fontSize: 50
        },
        true
    );

    const TotalPoints = new GameText(
        [0, 0],
        ["100%", "100%"],
        "Total points: " + points,
        {
            position: "relative",
            alignX: "center",
            alignY: "center",
            color: "black",
            fontSize: 20
        },
        true
    );

    const QuitGameBtn = new GameButton(
        [0, 0],
        [500, 100],
        "Quit game",
        () => {
            window.location.reload();
        },
        {
            position: "relative",
            alignX: "center",
            alignY: "center",
            color: "black",
            border: {
                borderImg: "black",
                borderSize: 2,
                borderStyle: "solid",
                borderRadius: 25
            },
            fontSize: 50
        },
        true
    );

    Centralizer.AttachToMe(HorrorContainer);
    HorrorContainer.AttachToMe(GameOverContainer);
    GameOverContainer.AttachToMe(DeathMessage);
    GameOverContainer.AttachToMe(TotalPoints);
    GameOverContainer.AttachToMe(QuitGameBtn);

    await s(2);

    GameOverContainer.FadeIn(3);
}