var hudElem_waveCounter = new GameText([-720, -420], ["max-content", "max-content"], "Wave: 0", HUDStyle, true)

main();

var wave = 1;
var sWaves = 0;

async function main() {

    displayDamage = true;

    SetPlayableAreaSize(10000, 10000);
    SetGameBackground("assets/img/testent2.png");

    setHUDTextColor("#fff");
    hudElem_waveCounter.docRef.style.color = "#fff";

    RegisterSound(
        "game_start_song",
        [
            "assets/snd/music/bt_mp_menumusic.mp3",
            "assets/snd/music/bt_pybk_intro.mp3",
            "assets/snd/music/bt_london_westminster_action_lp.mp3",
        ],
        false,
        0.3
    );

    RegisterSound("death_song", "assets/snd/music/sad_song1_faststart.mp3", false, 0.7);

    RegisterSound("new_wave", "assets/snd/ui/ui_arcade_zero_death1.wav", false, 0.8);
    RegisterSound("jugg_spawn", "assets/snd/ui/pmc_time_running_out_losing.wav", false, 0.8);

    RegisterSound("player_box_break", "assets/snd/impact/door_wd_kick02.wav", false, 0.5);
    RegisterSound("box_break", "assets/snd/impact/door_WD_kick.wav", false, 0.6);

    RegisterSound("box_spawned", "assets/snd/ui/ui_arcade_extra_life1.wav", false, 0.7);

    new Weapon("playerRifle", "single", 15, 9000, 100, 0, 2.2, 5, 10, [
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

    new Weapon("basicAIRifle", "single", 12, 1000, 20, Infinity, 2.6, 6, 5, [
        {
            name: "attack",
            path: "./assets/snd/weapon/Gunshot.ogg",
            loop: false,
            vol: 0.4
        },
        {
            name: "reload",
            path: "./assets/snd/weapon/reload_g36.ogg",
            loop: false,
            vol: 0.2
        }
    ])

    new Weapon("sniperRifle", "single", 25, 8000, 1, Infinity, 2.6, 2, 30, [
        {
            name: "attack",
            path: "./assets/snd/weapon/weap_cheytac_slst_2d3.wav",
            loop: false,
            vol: 0.5
        },
        {
            name: "reload",
            path: "./assets/snd/weapon/wpfoly_cheytech_reload_bolt_v1.wav",
            loop: false,
            vol: 0.6
        }
    ])

    new Weapon("advAIRifle", "single", 36, 3000, 30, Infinity, 4.2, 8, 3, [
        {
            name: "attack",
            path: "./assets/snd/weapon/wpnfire_tavor_v2_01.wav",
            loop: false,
            vol: 0.2
        },
        {
            name: "reload",
            path: "./assets/snd/weapon/reload_m16.ogg",
            loop: false,
            vol: 0.2
        }
    ])

    new Weapon("juggLMG", "single", 42, 4000, 60, Infinity, 5.6, 10, 6, [
        {
            name: "attack",
            path: "./assets/snd/weapon/weap_mg36_slst_1b.wav",
            loop: false,
            vol: 0.1
        },
        {
            name: "reload",
            path: "./assets/snd/weapon/reload_m16.ogg",
            loop: false,
            vol: 0.2
        }
    ])

    SetupPlayer();

    waveSpawner();
    LootBoxSpawner();
}

function SetupPlayer() {

    player.Teleport(PickRandomPos());
    player.ignoreGravity = true;
    player.GiveWeapon(GetWeaponByName("playerRifle"));

    player.onDeath = () => {
        GameOver();
    }

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

    player.movespeed = 5;

    hudContainer.AttachToMe(hudElem_waveCounter);

}

async function waveSpawner() {
    let enemies = [];

    let startMusic = PlaySound(GetSoundInfo("game_start_song"));

    while (player.health > 0) {
        if (wave < 10)
            await s(wave + 1);
        else
            await s(10);

        await SndFadeOut(startMusic, 3);

        player.weapons.damage += wave;
        CreateLootBox(false);

        hudElem_waveCounter.SetText("Wave: " + wave);

        if (wave % 5 != 0) {

            if (wave < 10) {
                setHUDTextColor("#fff");
                hudElem_waveCounter.docRef.style.color = "#fff";
            } else {
                setHUDTextColor("#ff6600");
                hudElem_waveCounter.docRef.style.color = "#ff6600";
            }

            PlaySound(GetSoundInfo("new_wave"));

            for (let i = 0; i < wave; i++) {
                let hostile = CreateEnemy();
                enemies.push(hostile);
                hostile.onDeath = () => { enemies.splice(enemies.indexOf(this), 1) }
            }

        } else {

            setHUDTextColor("#ff0000");
            hudElem_waveCounter.docRef.style.color = "#ff0000";

            PlaySound(GetSoundInfo("jugg_spawn"));

            let juggernaut = new Sentient("Sentient" + entCount, PickRandomPos(), [100, 130], "./assets/img/testent.jpg", "axis", true);
            juggernaut.ignoreGravity = true;

            juggernaut.health = 1000 * wave;
            juggernaut.SetModel("assets/img/testent4.png");
            juggernaut.GiveWeapon(GetWeaponByName("juggLMG"));

            juggernaut.weapons.damage += wave;

            if (juggernaut.weapons.fireTime > 1)
                juggernaut.weapons.fireTime -= (wave / 10);
            else
                juggernaut.weapons.fireTime = 1;

            if (juggernaut.weapons.bulletSpeed < 14)
                juggernaut.weapons.bulletSpeed += (wave / 10);
            else
                juggernaut.weapons.bulletSpeed = 14;

            if (juggernaut.weapons.reloadTime < 1.5)
                juggernaut.weapons.reloadTime -= (wave / 10);
            else
                juggernaut.weapons.reloadTime += 1.5;

            enemies.push(juggernaut);
            juggernaut.onDeath = () => { enemies.splice(enemies.indexOf(this), 1) }

        }

        await ArrayEmptied(enemies);

        wave++;
        sWaves++;
    }
}

async function LootBoxSpawner() {

    while (player.health > 0) {

        CreateLootBox(true);

        let waittime = (player.weapons.curAmmoCount + player.health) / 10;

        if (waittime <= 45)
            await s(10 + waittime);
        else
            await s(10 + 45);
    }
}

// var classPick = 4;

function CreateEnemy() {
    let limit = 4;

    let stubEnt = new Sentient("Sentient" + entCount, PickRandomPos(), [100, 130], "./assets/img/testent.jpg", "axis", true);
    stubEnt.ignoreGravity = true;

    let classPick = Math.floor(Math.random() * 10);

    switch (classPick) {
        default:
        case 1:
            if (wave > 10)
                stubEnt.GiveWeapon(GetWeaponByName("basicAIRifle"));
            break;
        case 2:
            stubEnt.health = stubEnt.health * (2 * (wave / 10));
            stubEnt.movespeed = stubEnt.movespeed / (2 / (wave * 3));
            stubEnt.SetModel("assets/img/testent3.png");
            break;
        case 3:
            stubEnt.health = stubEnt.health / (2 / (wave * 3));
            if (stubEnt.movespeed * (2 * (wave / 1.5) < 10))
                stubEnt.movespeed = stubEnt.movespeed * (2 * (wave / 1.5));
            else
                stubEnt.movespeed = 10;

            stubEnt.SetModel("assets/img/testent6.png");
            stubEnt.GiveWeapon(GetWeaponByName("advAIRifle"));
            break;
        case 4:
            stubEnt.movespeed = 0;
            stubEnt.SetModel("assets/img/testent5.png");
            stubEnt.GiveWeapon(GetWeaponByName("sniperRifle"));
            break;
    }

    stubEnt.weapons.damage += wave;

    return stubEnt;
}

async function CreateLootBox(playsound) {
    var stubEnt = new Entity("lootbox" + entCount, PickRandomPos(), [100, 100], "./assets/img/testplayer.jpg");
    stubEnt.ignoreGravity = true;

    if (playsound)
        PlaySound(GetSoundInfo("box_spawned"));

    await stubEnt.Collide();

    if (stubEnt.collTarget == player) {
        player.weapons.curAmmoCount = player.weapons.ammoCount;
        player.weapons.curAmmoCountRes = player.weapons.ammoCountRes;

        player.health += Math.floor(Math.random() * 100);

        PlaySound(GetSoundInfo("player_box_break"));
    } else {
        PlaySound(GetSoundInfo("box_break"));
    }


    stubEnt.Delete();
}

function PickRandomPos() {
    return [Math.floor(Math.random() * GameSafeSpace.right), Math.floor(Math.random() * GameSafeSpace.bottom)];
}

async function GameOver() {

    PlaySound(GetSoundInfo("death_song"));

    const Centralizer = new GameContainer(
        [0, 0],
        ["100%", "100%"],
        {
            display: "flex",
            alignX: "center",
            alignY: "center",
            BGColor: "#000000ee",
            opacity: 0
        },
        true,
        true
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

    let protips = [
        "Preserve your ammo... Only shoot at what you can kill.",
        "Every 5 waves there is a juggernaut.",
        "Ammo/health refills respawn according to how much ammo and health you have.",
        "Certain attributes for certain characters (like damage) will increase per wave.",
        "Use evasive maneuvers to avoid incoming fire.",
        "Ammo/health refills can be destroyed by hostiles and your own bullets.",
        "Pay attention to the appearance of hostiles, their skills vary accordingly.",
        "A new wave takes only up to 10 seconds to start, keep hostiles alive to plan for upcoming waves.",
        "This survived waves counter is correct, you didn't beat this last one.",
    ];

    const survivedWaves = new GameText(
        [0, 0],
        ["100%", "100%"],
        "Waves survived: " + sWaves,
        {
            position: "relative",
            alignX: "center",
            alignY: "center",
            color: "black",
            fontSize: 20
        },
        true
    );

    const ProTip = new GameText(
        [0, 0],
        ["100%", "100%"],
        PickRandomFromArray(protips),
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

    Centralizer.AttachToMe(GameOverContainer);
    GameOverContainer.AttachToMe(DeathMessage);
    GameOverContainer.AttachToMe(ProTip);
    GameOverContainer.AttachToMe(survivedWaves);
    GameOverContainer.AttachToMe(QuitGameBtn);

    await s(2);

    await Centralizer.FadeIn(3);

    GameOverContainer.FadeIn(1);
}