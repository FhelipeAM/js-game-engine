main();

var wave = 1;

async function main() {
    SetPlayableAreaSize(10000, 10000);
    SetGameBackground("assets/img/testent2.png");

    RegisterSound("game_start_song", ["assets/snd/music/bt_mp_menumusic.mp3", "assets/snd/music/bt_pybk_intro.mp3", "assets/snd/music/bt_london_westminster_action_lp.mp3", ], false, 0.4);
    RegisterSound("death_song", "assets/snd/music/sad_song1_faststart.mp3", false, 0.7);

    RegisterSound("new_wave", "assets/snd/ui/ui_arcade_zero_death1.wav", false, 0.8);
    RegisterSound("jugg_spawn", "assets/snd/ui/pmc_time_running_out_losing.wav", false, 0.8);

    RegisterSound("player_box_break", "assets/snd/impact/door_wd_kick02.wav", false, 0.5);
    RegisterSound("box_break", "assets/snd/impact/door_WD_kick.wav", false, 0.6);

    RegisterSound("box_spawned", "assets/snd/ui/ui_arcade_extra_life1.wav", false, 0.7);

    new Weapon("playerRifle", "single", 15, 10000, 100, 0, 2.2, 5, 10, [{
        name: "attack",
        path: "./assets/snd/weapon/Gunshot2.ogg",
        loop: false,
        vol: 0.6
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
    
    new Weapon("basicAIRifle", "single", 12, 3000, 20, Infinity, 2.6, 6, 5, [{
        name: "attack",
        path: "./assets/snd/weapon/Gunshot.ogg",
        loop: false,
        vol: 0.6
    },
    {
        name: "reload",
        path: "./assets/snd/weapon/reload_g36.ogg",
        loop: false,
        vol: 0.2
    }
    ])

    new Weapon("sniperRifle", "single", 25, Infinity, 1, Infinity, 2.6, 2, 30, [{
        name: "attack",
        path: "./assets/snd/weapon/weap_cheytac_slst_2d3.wav",
        loop: false,
        vol: 0.75
    },
    {
        name: "reload",
        path: "./assets/snd/weapon/wpfoly_cheytech_reload_bolt_v1.wav",
        loop: false,
        vol: 0.6
    }
    ])
    
    new Weapon("advAIRifle", "single", 36, 6000, 30, Infinity, 4.2, 6, 3, [{
        name: "attack",
        path: "./assets/snd/weapon/wpnfire_tavor_v2_01.wav",
        loop: false,
        vol: 0.6
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
}

async function waveSpawner() {
    let enemies = []; 

    let startMusic = PlaySound(GetSoundInfo("game_start_song"));

    while (true) {
        if (wave < 10)
            await s(wave);
        else
            await s(10);

        player.weapons.damage += wave;
        
        SndFadeOut(startMusic, 3);
        PlaySound(GetSoundInfo("new_wave"));
        
        for(let i = 0; i < wave; i++) {
            let hostile = CreateEnemy();
            enemies.push(hostile);
            hostile.onDeath = () => { enemies.splice(enemies.indexOf(this), 1) }
        }
        
        await ArrayEmptied(enemies);

        wave++;
    }
}

async function LootBoxSpawner() {

    while (true) {

        CreateLootBox();

        await s(30);
    }
}

// var classPick = 4;

function CreateEnemy() {
    let limit = 4;
     
    let stubEnt = new Sentient("Sentient"+entCount, PickRandomPos(), [100, 130], "./assets/img/testent.jpg", "axis", true);
    stubEnt.ignoreGravity = true;

    let classPick = Math.floor(Math.random() * 10);

    switch (classPick) {
        default:
        case 1:
            
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
            stubEnt.GiveWeapon(GetWeaponByName("basicAIRifle"));
            break;
        case 4:
            stubEnt.movespeed = 0;
            stubEnt.SetModel("assets/img/testent5.png");
            stubEnt.GiveWeapon(GetWeaponByName("sniperRifle"));
            break;
    }

    // classPick++;

    // if (classPick > limit)
    //     classPick = 0;

    return stubEnt;
}

async function CreateLootBox() {
    var stubEnt = new Entity("lootbox"+entCount, PickRandomPos(), [100, 100], "./assets/img/testplayer.jpg");
    stubEnt.ignoreGravity = true;

    PlaySound(GetSoundInfo("box_spawned"));

    await stubEnt.Collide();

    if (stubEnt.collTarget == player) {
        player.weapons.curAmmoCount = player.weapons.ammoCount;
        player.weapons.curAmmoCountRes = player.weapons.ammoCountRes;
        if (player.health < 99 && player.health + (player.health / 2) < 99)
            player.health += player.health / 2;

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
            display: "block",

            alignX: "center",
            alignY: "center",

            textAlign: "center",

            padding: 20,
            gap: 0,
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

    const errorMessage = new GameText(
        [0, 0],
        [500, 100],
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
    GameOverContainer.AttachToMe(errorMessage);
    GameOverContainer.AttachToMe(QuitGameBtn);

    await s(2);

    await Centralizer.FadeIn(3);

    GameOverContainer.FadeIn(1);
}