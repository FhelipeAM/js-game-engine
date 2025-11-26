const GameArea = document.getElementById("safespace");
const HUDSpace = document.getElementById("HUD");

const tickrate = 1;
const GameSafeSpace = GameArea.getBoundingClientRect();
const gravity = 6;

const devMode = true;

var loadedLevel = "";

var gamePaused = false;
var timePassed = 0;

_RegisterWeapons();
_RegisterSounds();

const player = new Sentient("player", [0, 0], [100, 100], "./assets/img/testplayer.jpg", "allies", false);

async function __sysMain() {
    GameArea.style.height = GameSafeSpace.bottom + "px";
    GameArea.style.width = GameSafeSpace.right + "px";

    _initControls(player);

    await _NoLevelLoaded();

    _StartSys();

    const tickSystem = setInterval(() => {

        if (gamePaused)
            return;

        _Controls();

        UpdateHUD();

        entities.forEach((ent) => {
            _collMain(ent);
            _interpolateMain(ent);
            _gravityMain(ent);
        });

        sentients.forEach((sent) => {
            sent._think();
        });

        timePassed++;
    }, tickrate);

    return () => {
        clearInterval(tickSystem);
    };
}

async function _gravityMain(ent) {
    if (ent.ignoreGravity || ent.iIgnoreGravity) return;

    if (ent.pos[1] + ent.coll[1] < GameSafeSpace.bottom) {
        ent.docRef.style.marginTop = ent.pos[1] + "px";
        ent.pos[1]++;
        ent.falling = true;
        ent.midAir = true;
    } else {
        ent.falling = false;
        ent.midAir = false;
    }
}

async function _collMain(ent) {
    let cs = false;

    if ((ent.entType() == "sentient" && ent.dead) || ent.docRef.parentNode !== GameArea)
        return;

    for (let i = 0; i < entities.length; i++) {
        var ent2 = entities[i];

        if (ent === ent2 || (ent2.entType() == "sentient" && ent2.dead) || ent2.docRef.parentNode !== GameArea) continue;

        let entLeft = ent.pos[0];
        let entRight = ent.pos[0] + ent.coll[0];
        let entTop = ent.pos[1];
        let entBottom = ent.pos[1] + ent.coll[1];

        let ent2Left = ent2.pos[0];
        let ent2Right = ent2.pos[0] + ent2.coll[0];
        let ent2Top = ent2.pos[1];
        let ent2Bottom = ent2.pos[1] + ent2.coll[1];

        if (entLeft < ent2Right && entRight > ent2Left &&
            entTop < ent2Bottom && entBottom > ent2Top) {

            if (!ent.solid) {
                cs = true;
                ent.collTarget = ent2;
                return;
            } else if (ent.solid && ent2.solid) {
                let overlapX = Math.min(entRight, ent2Right) - Math.max(entLeft, ent2Left);
                let overlapY = Math.min(entBottom, ent2Bottom) - Math.max(entTop, ent2Top);

                if (overlapX < overlapY) {
                    if (ent.pos[0] <= ent2.pos[0]) {
                        ent.pos[0] = ent2.pos[0] - ent.coll[0];
                    }
                }
                else {
                    if (ent.pos[1] <= ent2.pos[1]) {
                        ent.pos[1] = ent2.pos[1] - ent2.coll[1];
                    }
                }

                //to avoid desync
                ent.Teleport([ent.pos[0], ent.pos[1]]);

                return;
            }
        }
    }

    if (!cs) {
        ent.collTarget = undefined;
    }
}

async function _interpolateMain(ent) {

    if (ent.linkedTo != null) {
        ent.Teleport([ent.linkedTo.pos[0] + ent.linkedToOffset[0], ent.linkedTo.pos[1] + ent.linkedToOffset[1]]);
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
        if (ent.movespeed > 1) {
            if (ent.end[1] > ent.pos[1] && ent.interpos[1] != ent.end[1]) {
                ent.interpos[1] = ent.interpos[1] + 1 * ent.movespeed;
            } else if (ent.interpos[1] != ent.end[1]) {
                ent.interpos[1] = ent.interpos[1] - 1 * ent.movespeed;
            }
        } else {
            if (ent.end[1] > ent.pos[1] && ent.interpos[1] != ent.end[1]) {
                ent.interpos[1] = ent.interpos[1] + 1;
            } else if (ent.interpos[1] != ent.end[1]) {
                ent.interpos[1] = ent.interpos[1] - 1;
            }
        }

        ent.docRef.style.marginTop = ent.interpos[1] + "px";
    }


    const reachedX =
        ent.movespeed > 0
            ? Math.abs(ent.interpos[0] - ent.end[0]) <= ent.movespeed
            : ent.interpos[0] === ent.end[0];

    const reachedY =
        ent.movespeed > 0
            ? Math.abs(ent.interpos[1] - ent.end[1]) <= ent.movespeed
            : ent.interpos[1] === ent.end[1];

    if (reachedX && reachedY) {
        ent.interpolating = false;
        ent.iIgnoreGravity = false;
    }
}

async function _NoLevelLoaded() {

    const ErrorContainer = new GameContainer(
        [0, 0],
        [600, 300],
        {
            display: "block",
            alignX: "between",
            alignY: "center",
            textAlign: "center",
            padding: 20,
            BGColor: "#000000ee",
            border: {
                borderImg: "black",
                borderSize: 3,
                borderStyle: "solid",
                borderRadius: 25
            }
        },
        true
    );

    const ButtonsContainer = new GameContainer(
        [0, 0],
        [600, 150],
        {
            display: "flex",
            alignX: "between",
            alignY: "center",
            gap: 20
        },
        true
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
        [500, 100],
        "Load level",
        () => {
            _levelLoader()
        },
        {
            position: "relative",
            alignX: "center",
            alignY: "center",
            color: "white",
            border: {
                borderImg: "white",
                borderSize: 2,
                borderStyle: "solid",
                borderRadius: 25
            },
            fontSize: 50
        },
        true
    );

    const CreateLevelBtn = new GameButton(
        [0, 0],
        [500, 100],
        "Open level editor",
        () => { },
        {
            position: "relative",
            alignX: "center",
            alignY: "center",
            color: "white",
            border: {
                borderImg: "white",
                borderSize: 2,
                borderStyle: "solid",
                borderRadius: 25
            },
            padding: 10,
            fontSize: 50
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

    ErrorContainer.Delete();
    ButtonsContainer.Delete();
    errorMessage.Delete();
    LoadLevelBtn.Delete();
    CreateLevelBtn.Delete();
}

function _levelLoader() {

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.js,.javascript,text/javascript';

    fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (e) {
            const scriptContent = e.target.result;

            try {
                eval(scriptContent);
                loadedLevel = e.target.result;
            } catch (error) {
                console.error('Error:', error);
            }
        };

        reader.onerror = function (error) {
            console.error('Error:', error);
        };

        reader.readAsText(file);
    });

    fileInput.click();

}

__sysMain();
