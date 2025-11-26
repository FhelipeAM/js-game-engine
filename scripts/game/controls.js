var pressedKeys = [];
var movementTarget = document.getElementById("stub");

var disableControls = false;
var freecam = false;

var lastJumpTime = 0;
const jumpDelay = 0.1;

var KeyBinds = [];

function _initControls(target) {
    movementTarget = target;
    movementTarget.target = new Entity("mousetarget", [0, 0], [1, 1], ["", { opacity: 0 }])
    movementTarget.target.ignoreGravity = true;
    movementTarget.target.solid = false;

    _baseMovement();
    
}

function _baseMovement() {
    
    RegisterInput("d", "moveRight", () => {

        let dirx = movementTarget.pos[0]
        let diry = movementTarget.pos[1]

        if (movementTarget.pos[0] < GameSafeSpace.right - movementTarget.coll[1]) {
            dirx = movementTarget.pos[0] + 1;
        }
        movementTarget.MoveTo([dirx, diry], true);
    });

    RegisterInput("w", "jump", async () => {
        let dirx = movementTarget.pos[0]
        let diry = movementTarget.pos[1]
        
        let jmpcheck = lastJumpTime + (jumpDelay * 1000) < timePassed;

        if (!movementTarget.midAir && jmpcheck) {
            lastJumpTime = timePassed;
            diry = movementTarget.pos[1] - 100;
            
            movementTarget.Teleport([dirx, diry]);
        }
    });

    RegisterInput("a", "moveLeft", () => {

        let dirx = movementTarget.pos[0]
        let diry = movementTarget.pos[1]

        if (movementTarget.pos[0] > GameSafeSpace.left) {
            dirx = movementTarget.pos[0] - 1;
        }

        movementTarget.MoveTo([dirx, diry], true);
    });

    RegisterInput(" ", "shoot", () => {
        movementTarget.target.Teleport([mousePos[0], mousePos[1]]);
        movementTarget.weapons.Shoot(movementTarget);
    });

    RegisterInput("r", "reload", () => {
        movementTarget.weapons.Reload(movementTarget);
    });
}

function RegisterInput(aKey, aAction, aFunc) {

    let checkStub = getActionFromKeybind(aKey);

    if (IsValidAction(checkStub.action)) {
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
        console.warn("Action is not valid.")
        return;
    }

    stub.key = newKey;
}

function RemoveInput(actionName) {

    let stub = getActionByName(actionName);
    
    if (!IsValidAction(stub.action)) {
        console.warn("Action is not valid.")
        return;
    }

    KeyBinds.splice(KeyBinds.indexOf(stub), 1);
}

async function _Controls() {

    _CameraScroll();

    if (disableControls || movementTarget.dead)
        return;

    pressedKeys.forEach(pKey => {

        let stub = getActionFromKeybind(pKey);

        if (IsValidAction(stub.action)) {
            stub.func();
        }
    })
}

document.addEventListener("keypress", (key) => {
    if (!pressedKeys.includes(key.key))
        pressedKeys.push(key.key);
});

document.addEventListener("keyup", (key) => {
    pressedKeys.splice(pressedKeys.indexOf(key.key), 1);
});

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