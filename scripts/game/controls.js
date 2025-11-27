var pressedKeys = [];
var movementTarget = document.getElementById("stub");

var disableControls = false;
var freecam = false;

var lastJumpTime = 0;
const jumpDelay = 0.1;

var KeyBinds = [];

var dirx = 0;
var diry = 0;

function _initControls(target) {
    movementTarget = target;
    movementTarget.target = new Entity("mousetarget", [0, 0], [1, 1], ["", { opacity: 0 }])
    movementTarget.target.ignoreGravity = true;
    movementTarget.target.solid = false;

    dirx = movementTarget.pos[0];
    diry = movementTarget.pos[1];

    _baseMovement();
    
}

function _baseMovement() {
    
    RegisterInput("d", "moveRight", () => {

        if (movementTarget.pos[0] < GameSafeSpace.right - movementTarget.coll[1]) {
            dirx = movementTarget.pos[0] + 1;
        }
        movementTarget.MoveTo([dirx, diry], true);

        dirx = movementTarget.pos[0];
    });

    RegisterInput("w", "jump", async () => {
        
        let jmpcheck = lastJumpTime + (jumpDelay * 1000) < timePassed;

        if (!movementTarget.midAir && jmpcheck) {
            lastJumpTime = timePassed;
            diry = movementTarget.pos[1] - 120;
            
            movementTarget.Teleport([dirx, diry]);

        }

    });

    RegisterInput("a", "moveLeft", () => {

        if (movementTarget.pos[0] > GameSafeSpace.left) {
            dirx = movementTarget.pos[0] - 1;
        }

        movementTarget.MoveTo([dirx, diry], true);

        dirx = movementTarget.pos[0];
    });

    RegisterInput(" ", "shoot", () => {
        movementTarget.target.Teleport([mousePos[0], mousePos[1]]);
        movementTarget.weapons.Shoot(movementTarget);
    });

    RegisterInput("r", "reload", () => {
        movementTarget.weapons.Reload(movementTarget);
    });
}

async function _Controls() {

    _CameraScroll();

    if (disableControls || movementTarget.dead)
        return;

    diry = movementTarget.pos[1];

    pressedKeys.forEach(pKey => {

        let stub = getActionFromKeybind(pKey);

        if (IsValidAction(stub.action)) {
            stub.func();
        }
    })
}

function _CameraScroll() {

    if (freecam)
        return;

    const entX = movementTarget.CenterOfMass()[0];
    const entY = movementTarget.CenterOfMass()[1];

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const scrollX = entX - viewportWidth / 2;
    const scrollY = entY - viewportHeight / 2;

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

function RegisterInput(aKey, aAction, aFunc) {

    let checkStub = getActionFromKeybind(aKey);

    if (IsValidAction(checkStub.action)) {
        if (devMode)
            console.warn("An action is already bound to this key, ignoring.")
        return;
    }

    let stub = {
        key: aKey,
        action: aAction,
        func: aFunc
    };

    KeyBinds.push(stub);
}

function ChangeKeyForAction(actionName, newKey) {

    let stub = getActionByName(actionName);
    
    if (!IsValidAction(stub.action)) {
        if (devMode)
            console.warn("Action is not valid.")
        return;
    }

    stub.key = newKey;
}

function RemoveInput(actionName) {

    let stub = getActionByName(actionName);
    
    if (!IsValidAction(stub.action)) {
        if (devMode)
            console.warn("Action is not valid.")
        return;
    }

    KeyBinds.splice(KeyBinds.indexOf(stub), 1);
}

function getActionFromKeybind(bind) {

    let actionStub = {
        key: bind,
        action: "invalid",
        func: () => {console.log("invalid action")}
    };

    KeyBinds.forEach((elem) => {
        if (elem.key == bind) {
            actionStub = elem;
            return;
        }
    })

    return actionStub;
}

function getActionByName(actionName) {

    let actionStub = {
        key: "none",
        action: "invalid",
        func: () => {console.log("invalid action")}
    };

    KeyBinds.forEach((elem) => {
        if (elem.action == actionName) {
            actionStub = elem;
            return;
        }
    })

    return actionStub;
}

function getKeybindFromAction(action) {
    let KeyStub = "unbound";

    KeyBinds.forEach((elem) => {
        if (elem.action == action) {
            KeyStub = elem.key;
            return;
        }
    })
    return KeyStub;
}

function IsValidAction(actionName) {
    let valid = false;
    
    KeyBinds.forEach((elem) => {
        if (elem.action == actionName) {
            valid = true;
            return;
        }
    })
    return valid;
}

async function WaitTillAction(actionName) {

    if (!IsValidAction(actionName)) {
        if (devMode)
            console.warn("Action has not been registered");
        return;
    }

    while (!IsKeyPressed(actionName)) {
        await new Promise(resolve => setTimeout(resolve, tickrate));
    }
}

function IsKeyPressed(actionName) {

    let ikp = false;

    pressedKeys.forEach((elem) => {

        let stub = getActionFromKeybind(elem);
        if (stub.action == actionName) {
            ikp = true;
            return;
        }
    })

    return ikp;
}

document.addEventListener("keypress", (key) => {
    key.preventDefault();
    if (!pressedKeys.includes(key.key))
        pressedKeys.push(key.key);
});

document.addEventListener("keyup", (key) => {
    pressedKeys.splice(pressedKeys.indexOf(key.key), 1);
});