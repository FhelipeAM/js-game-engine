var pressedKeys = [];
var movementTarget = document.getElementById("stub");
var disableControls = false;

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

        if (getActionFromKeybind(key) == "jump" && !movementTarget.midAir) {
            diry = movementTarget.pos[1] - 50;
            movementTarget.midAir = true;
        }
        
        if (getActionFromKeybind(key) == "shoot") {
            movementTarget.Shoot();
        }
        // if (dirx != movementTarget.pos[0])
        movementTarget.MoveTo([dirx, diry], movementTarget.midAir);
        // movementTarget.MoveTo([dirx], movementTarget.midAir);
        // if (diry != movementTarget.pos[1])
        // movementTarget.MoveTo([undefined, diry], movementTarget.midAir);
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
    document.body.scrollLeft += player.pos[1];
}