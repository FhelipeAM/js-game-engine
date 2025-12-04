const GameArea = document.getElementById("safespace");
var GameSafeSpace = GameArea.getBoundingClientRect();

const HUDSpace = document.getElementById("HUD");

const tickrate = 1;
const gravity = 3;

var devMode = false;

var loadedLevel = "";

var gamePaused = false;
var timePassed = 0;

let __editor_mode = false;

_RegisterWeapons();
_RegisterSounds();

const player = new Sentient("player", [0, 0], [100, 100], "./assets/img/testplayer.jpg", "allies", false);

var LDT = 0;
let TPS = 60;

async function __sysMain() {

    SetPlayableAreaSize([GameArea.style.width, GameArea.style.height]);

    _initControls(player);

    await _NoLevelLoaded();

    _StartSys();

    let TDS = 0;

    const tickSystem = setInterval(() => {

        if (gamePaused)
            return;

        _Controls();

        UpdateHUD();

        entities.forEach((ent) => {
            _interpolateMain(ent);
            _gravityMain(ent);
            _collMain(ent);
        });

        sentients.forEach((sent) => {
            sent._think();
        });


        if (devMode) {

            TDS++;
            const now = Date.now();
            if (now - LDT >= 1000) {
                TPS = TDS;
                TDS = 0;
                LDT = now;
            }
        }

        timePassed++;
    }, tickrate);

}

async function _gravityMain(ent) {
    if (ent.ignoreGravity || ent.iIgnoreGravity || ent.linkedTo != null) return;

    if (ent.pos[1] + ent.coll[1] < GameSafeSpace.bottom && ent.shouldFall) {

        ent.docRef.style.marginTop = ent.pos[1] + "px";
        ent.pos[1] += (gravity * ent.weight);

        ent.falling = true;
        ent.midAir = true;
    } else {
        if (ent.pos[1] + ent.coll[1] > GameSafeSpace.bottom) {
            ent.pos[1] = GameSafeSpace.bottom - ent.coll[1];
            ent.docRef.style.marginTop = ent.pos[1] + "px";
        }

        ent.falling = false;
        ent.midAir = false;
    }
}

async function _collMain(ent) {

    if ((ent.entType() == "sentient" && ent.dead) || ent.docRef.parentNode !== GameArea || ent.linkedTo != null || ent.entType() == "uielem")
        return;

    let shouldFall = true;

    ArrayFromClosest(ent, entities).forEach(ent2 => {

        if (ent === ent2 || (ent2.entType() == "sentient" && ent2.dead) || ent2.docRef.parentNode !== GameArea || ent2.linkedTo != null || ent2.entType() == "uielem")
            return;

        let entLeft = ent.pos[0];
        let entRight = ent.pos[0] + ent.coll[0];
        let entTop = ent.pos[1];
        let entBottom = ent.pos[1] + ent.coll[1];

        let ent2Left = ent2.pos[0];
        let ent2Right = ent2.pos[0] + ent2.coll[0];
        let ent2Top = ent2.pos[1];
        let ent2Bottom = ent2.pos[1] + ent2.coll[1];

        if (entLeft < ent2Right && entRight > ent2Left && entTop < ent2Bottom && entBottom > ent2Top) {

            ent.collTarget = ent2;

            if (!ent.solid || !ent2.solid) {
                return;
            } else {
                let overlapX = Math.min(entRight, ent2Right) - Math.max(entLeft, ent2Left);
                let overlapY = Math.min(entBottom, ent2Bottom) - Math.max(entTop, ent2Top);

                if (overlapX <= 0 || overlapY <= 0) return;

                if (overlapX < overlapY) {
                    const separation = (overlapX / 2);

                    if (!ent.IsToTheRight(ent2)) {

                        if (ent.weight < ent2.weight) {
                            ent.pos[0] -= separation;
                        }
                        else if (ent.weight > ent2.weight) {
                            ent2.pos[0] += separation;
                        }
                        else {
                            ent.pos[0] -= separation;
                            ent2.pos[0] += separation;
                        }

                    } else {

                        if (ent.weight < ent2.weight) {
                            ent.pos[0] += separation;
                        }
                        else if (ent.weight > ent2.weight) {
                            ent2.pos[0] -= separation;
                        }
                        else {
                            ent.pos[0] += separation;
                            ent2.pos[0] -= separation;
                        }
                    }

                }
                else {

                    const separation = overlapY;

                    if (ent.IsAbove(ent2)) {

                        if (ent.weight < ent2.weight) {
                            ent.pos[1] -= separation;
                        }
                        else if (ent.weight > ent2.weight) {
                            ent2.pos[1] += separation;
                        }
                        else {
                            ent.pos[1] -= separation / 2;
                            ent2.pos[1] += separation / 2;
                        }

                        shouldFall = false;
                    }
                    else if (ent2.IsAbove(ent)) {

                        if (ent2.weight < ent.weight) {
                            ent2.pos[1] -= separation;
                        }
                        else if (ent2.weight > ent.weight) {
                            ent.pos[1] += separation;
                        }
                        else {
                            ent.pos[1] += separation / 2;
                            ent2.pos[1] -= separation / 2;
                        }

                        shouldFall = false;
                    }
                }

                //to avoid desync
                ent.Teleport([ent.pos[0], ent.pos[1]], false);
                ent2.Teleport([ent2.pos[0], ent2.pos[1]], false);

                ent.onCollide();
            }
        } else if (ent.collTarget == undefined || !ent.IsAbove(ent.collTarget)) {
            shouldFall = true;
        }
    })

    ent.shouldFall = shouldFall;
}

async function _interpolateMain(ent) {

    if (ent.linkedTo != null) {
        ent.Teleport([ent.linkedTo.pos[0] + ent.linkedToOffset[0], ent.linkedTo.pos[1] + ent.linkedToOffset[1]]);
        return;
    }

    if (!ent.interpolating) return;

    if (!ent.docRef.classList.contains("ltr"))
        ent.docRef.classList.add("ltr");

    if (ent.end[0] > ent.pos[0] && ent.interpos[0] != ent.end[0]) {
        ent.interpos[0] = ent.interpos[0] + 1 * ent.movespeed;
        ent.docRef.classList.replace("rtl", "ltr");
    } else if (ent.interpos[0] != ent.end[0]) {
        ent.interpos[0] = ent.interpos[0] - 1 * ent.movespeed;
        ent.docRef.classList.replace("ltr", "rtl");
    }

    ent.docRef.style.marginLeft = ent.interpos[0] + "px";

    if (ent.iIgnoreGravity || ent.ignoreGravity) {
        if (ent.end[1] > ent.pos[1] && ent.interpos[1] != ent.end[1]) {
            ent.interpos[1] = ent.interpos[1] + (1 * ent.movespeed);
        } else if (ent.interpos[1] != ent.end[1]) {
            ent.interpos[1] = ent.interpos[1] - (1 * ent.movespeed);
        }

        ent.docRef.style.marginTop = ent.interpos[1] + "px";
    }

    const reachedX = Math.abs(ent.interpos[0] - ent.end[0]) <= ent.movespeed;
    const reachedY = Math.abs(ent.interpos[1] - ent.end[1]) <= ent.movespeed;

    if (reachedX && reachedY) {
        ent.interpolating = false;
        ent.iIgnoreGravity = false;
    }
}

async function _NoLevelLoaded() {

    gamePaused = true;

    const ErrorContainer = new GameContainer(
        [0, 0],
        ["100%", "100%"],
        {
            display: "flex",
            flexDir: "column",
            alignX: "center",
            alignY: "center",
            BGColor: "#000000ee",
            index: 45,
            gap: 20,
        },
        true,
        true
    );

    const ButtonsContainer = new GameContainer(
        [0, 0],
        ["auto", "auto"],
        {
            display: "flex",
            position: 'relative',
            alignX: "between",
            alignY: "center",
            gap: 20
        },
        true,
        false
    );

    const errorMessage = new GameText(
        [0, 0],
        [600, 100],
        "No level loaded!",
        {
            position: "relative",
            alignX: "center",
            alignY: "center",
            color: "red",
            fontSize: 50
        },
        true
    );

    const LoadLevelBtn = new GameButton(
        [0, 0],
        ["100%", "100%"],
        "Load level",
        () => {
            _levelLoader()
        },
        {
            display: "flex",
            position: "relative",
            alignX: "center",
            alignY: "center",
            color: "white",
            padding: 10,
            border: {
                borderImg: "white",
                borderSize: 2,
                borderStyle: "solid",
                borderRadius: 25
            },
            fontSize: 30
        },
        true
    );

    const CreateLevelBtn = new GameButton(
        [0, 0],
        ["100%", "100%"],
        "Open level editor",
        () => { _LevelEditorMain() },
        {
            display: "flex",
            position: "relative",
            alignX: "center",
            alignY: "center",
            color: "white",
            textAlign: "center",
            border: {
                borderImg: "white",
                borderSize: 2,
                borderStyle: "solid",
                borderRadius: 25
            },
            padding: 10,
            fontSize: 30
        },
        true
    );

    ErrorContainer.AttachToMe(errorMessage);
    ErrorContainer.AttachToMe(ButtonsContainer);

    ButtonsContainer.AttachToMe(LoadLevelBtn);
    ButtonsContainer.AttachToMe(CreateLevelBtn);

    while (loadedLevel == "") {
        await new Promise(resolve => setTimeout(resolve, tickrate));
    }

    if (loadedLevel != "editor") {
        gamePaused = false;
    }

    ErrorContainer.Delete();
    ButtonsContainer.Delete();
    errorMessage.Delete();
    LoadLevelBtn.Delete();
    CreateLevelBtn.Delete();
}

function _levelLoader() {

    LoadFile('.js,.javascript,text/javascript', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (e) {
            const scriptContent = e.target.result;

            try {

                _LoadLevel(_GetLevelData(scriptContent));
                eval(scriptContent);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        reader.onerror = function (error) {
            console.error('Error:', error);
        };

        reader.readAsText(file);
    });
}

function _GetLevelData(rawScript) {

    const levelMatch = rawScript.match(/loadedLevel\s*=\s*(\[.*?\]|\{.*?\}|"hardcoded");/s);

    if (!levelMatch) {
        return;
    }

    return JSON.parse(levelMatch[1]);
}

function _LoadLevel(levelData) {

    if (!levelData || levelData === "" || levelData == "hardcoded") {
        if (levelData != "hardcoded")
            alert("Invalid level file!");
        if (levelData != "hardcoded" && devMode)
            alert("Make sure the file has loadedLevel variable set to 'hardcoded' if there's no level or add in the 'loadedLevel = [entity defitions];' to your script.");
        
        if (__editor_mode && levelData == "hardcoded")
            alert("This level was not made with the editor!");

        return;
    }

    loadedLevel = levelData;

    weaponTemplate.forEach((wep) => {

        //hardcoded weapon
        if (wep.name == "DEFAULTMELEE")
            return;

        weaponTemplate.delete(wep.name);
    })

    entities.forEach((ent) => {

        if (ent.entType() == "uielem" || ent.docRef.id == "player" || ent.docRef.id == "mousetarget" )
            return;

        ent.Delete();
    })

    levelData.forEach((ent) => {

        let entStub = undefined;

        switch (ent.type) {
            case "sentient":
                if (ent.keys.docRefID != "player")
                    entStub = new Sentient(ent.keys.docRefID, ent.keys.pos, ent.keys.coll, ent.keys.img, ent.keys.team, ent.keys.aiEnabled)
                else
                    entStub = GetEnt(ent.keys.docRefID)
                break;
            case "entity":
                entStub = new Entity(ent.keys.docRefID, ent.keys.pos, ent.keys.coll, ent.keys.img);
                break;
            case "origin":
                entStub = new Origin(ent.keys.docRefID, ent.keys.pos);
                break;
            case "trigger":
                entStub = new Trigger(ent.keys.pos, ent.keys.coll, ent.keys.type, () => { cl("Replace via script") }, ent.keys.ignoreEntTypes);
                break;
            case "weapon":
                entStub = new Weapon(ent.keys.name, ent.keys.type, ent.keys.damage, ent.keys.range, ent.keys.ammoCount, ent.keys.ammoCountRes, ent.keys.fireTime, ent.keys.reloadTime, ent.keys.bulletSpeed, ent.keys.sndSet);
                break;
            case "level":
                SetPlayableAreaSize(ent.keys.size);
                GameArea.style.backgroundImage = ent.keys.img;
                entCount = ent.keys.LEntID;
                return;
        }

        for (const key in ent.keys) {

            if (_LSLisStateVal(key) || typeof ent.keys[key] == "function")
                continue;

            if (key == "docRefID") {
                entStub.docRef.id = ent.keys[key];
                continue;
            } else if (key == "weaponsName") {
                entStub.GiveWeapon(GetWeaponByName(ent.keys[key]))
                continue;
            }
            else if (key == "pos") {
                entStub.Teleport(ent.keys[key], true);
            }
            else if (key == "coll") {
                entStub.SetSize(ent.keys[key]);
            }
            else if (key == "mdl" && (entStub.entType() != "trigger" && entStub.entType() != "origin")) {
                entStub.SetModel(ent.keys[key]);
                continue;
            }

            entStub[key] = ent.keys[key];
        }
    })

    __editor_onAction = false;
}

function SetPlayableAreaSize(xy) {

    GameArea.style.width = xy[0] + "px";
    GameArea.style.height = xy[1] + "px";

    GameSafeSpace = GameArea.getBoundingClientRect();
}

function SetGameBackground(imgPath) {
    GameArea.style.backgroundImage = `url(${imgPath})`
}

__sysMain();
