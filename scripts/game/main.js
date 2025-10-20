const GameArea = document.getElementById("safespace");

const tickrate = 1;
const GameSafeSpace = GameArea.getBoundingClientRect();
const gravity = 6;
var timePassed = 0;

const player = new Sentient("player", [0, 0], [100, 100], "./assets/img/testplayer.png", "allies", false);

function __sysMain() {
    GameArea.style.height = GameSafeSpace.bottom + "px";
    GameArea.style.width = GameSafeSpace.right + "px";

    _initControls(player);

    const tickSystem = setInterval(() => {
        _Controls();

        entities.forEach((ent) => {
            _interpolateMain(ent);
            _gravityMain(ent);
            _collMain(ent);
        });

        sentients.forEach((sent) => {
            sent._think();
        });

        timePassed++;
        // console.log(player.midAir);
    }, tickrate);
    // console.log(GameSafeSpace.bottom);
}

function _gravityMain(ent) {
    if (ent.ignoreGravity || ent.iIgnoreGravity) return;
    // console.log(ent.entHeight);
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

function _collMain(ent) {
    let cs = false;

    for (let i = 0; i < entities.length; i++) {
        ent2 = entities[i];

        if (ent === ent2)
            continue;
    
        let entLeft = ent.pos[0];
        let entRight = ent.pos[0] + ent.coll[0];
        let entTop = ent.pos[1];
        let entBottom = ent.pos[1] + ent.coll[1];
        
        let ent2Left = ent2.pos[0];
        let ent2Right = ent2.pos[0] + ent2.coll[0];
        let ent2Top = ent2.pos[1];
        let ent2Bottom = ent2.pos[1] + ent2.coll[1];
        
        // Check if rectangles overlap
        if (entLeft < ent2Right && entRight > ent2Left &&
            entTop < ent2Bottom && entBottom > ent2Top) {
            cs = true;
            ent.collTarget = ent2;
            return;
        }
    }

    if (!cs)
        ent.collTarget = undefined;
}

function _interpolateMain(ent) {
    if (!ent.interpolating) return;

    if (ent.end[0] > ent.pos[0] && ent.interpos[0] != ent.end[0]) {
        ent.interpos[0] = ent.interpos[0] + 1 * ent.movespeed;
    } else if (ent.interpos[0] != ent.end[0]) {
        ent.interpos[0] = ent.interpos[0] - 1 * ent.movespeed;
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

__sysMain();
