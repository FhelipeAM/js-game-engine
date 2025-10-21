var pressedKeys = [];
var movementTarget = document.getElementById("stub");
var disableControls = false;
var lastJumpTime = 0;
const jumpDelay = 0.1;

var KeyBinds = [
    {
        key: 'a',
        action: 'moveLeft'
    },
    {
        key: 'd',
        action: 'moveRight'
    },
    {
        key: 'w',
        action: 'jump'
    },
    {
        key: ' ',
        action: 'shoot'
    },
]

function _initControls(target) {
    movementTarget = target;
}

function _Controls() {

    _CameraScroll();

    if (disableControls || movementTarget.dead)
        return;

    let dirx = movementTarget.pos[0]
    let diry = movementTarget.pos[1]
    
    pressedKeys.forEach(key => {

        // console.log(getActionFromKeybind(key))
        if (movementTarget.pos[0] < GameSafeSpace.right - movementTarget.coll[1]) {
            if (getActionFromKeybind(key) == "moveRight") {
                dirx = movementTarget.pos[0] + 1;
            }
        }
        if (movementTarget.pos[0] > GameSafeSpace.left) {
            if (getActionFromKeybind(key) == "moveLeft") {
                dirx = movementTarget.pos[0] - 1;
            }
        }

        let jmpcheck = lastJumpTime + (jumpDelay * 1000) < timePassed;

        if (getActionFromKeybind(key) == "jump" && !movementTarget.midAir && jmpcheck) {
            lastJumpTime = timePassed;
            diry = movementTarget.pos[1] - 100;
            //gotta love the desync
            movementTarget.Teleport([dirx, diry]);
        }
        
        if (getActionFromKeybind(key) == "shoot") {
            movementTarget.weapons.Shoot(movementTarget);
        }

        movementTarget.MoveTo([dirx, diry], true);
    })
}

document.addEventListener("keypress", (key) => {
    // console.log(key.key)
    if (!pressedKeys.includes(key.key))
        pressedKeys.push(key.key);
});

document.addEventListener("keyup", (key) => {
    pressedKeys.splice(pressedKeys.indexOf(key.key), 1);
});

function getActionFromKeybind(bind) {
    // console.log(bind)
    let actionStub = "noAction";

    KeyBinds.forEach((elem) => {
        if (elem.key == bind)
            actionStub = elem.action;
    })
    return actionStub;
}

function getKeybindFromAction(action) {
    let KeyStub = "noKey";

    KeyBinds.forEach((elem) => {
        if (elem.action == action)
            KeyStub = elem.key;
    })
    return KeyStub;
}

function _CameraScroll() {

    const playerX = player.CenterOfMass()[0];
    const playerY = player.CenterOfMass()[1];

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const scrollX = playerX - viewportWidth / 2;
    const scrollY = playerY - viewportHeight / 2;

    const maxScrollX = document.body.scrollWidth - viewportWidth;
    const maxScrollY = document.body.scrollHeight - viewportHeight;

    const clampedX = Math.max(0, Math.min(scrollX, maxScrollX));
    const clampedY = Math.max(0, Math.min(scrollY, maxScrollY));

    window.scrollTo({
        left: clampedX,
        top: clampedY,
        // behavior: 'smooth'
    });
}