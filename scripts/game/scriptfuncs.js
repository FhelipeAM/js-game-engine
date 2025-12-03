var mousePos = [0, 0];

function s(s) {

    if (s <= 0) {
        if (devMode)
            console.warn("Waiting for an invalid amount of time.");
        return;
    }

    return new Promise(async resolve => {
        while (gamePaused) await _waitUntilUnpaused();
        setTimeout(async () => {
            while (gamePaused) await _waitUntilUnpaused();
            resolve();
        }, s * 1000);
    });
}

function ms(ms) {
    if (ms <= 0) {
        if (devMode)
            console.warn("Waiting for an invalid amount of time.");
        return;
    }

    return new Promise(async resolve => {
        while (gamePaused) await _waitUntilUnpaused();

        setTimeout(async () => {
            while (gamePaused) await _waitUntilUnpaused();
            resolve();
        }, ms);
    });
}

function _waitUntilUnpaused() {
    return new Promise(resolve => {

        const check = async () => {
            if (!gamePaused) return resolve();
            requestAnimationFrame(check);
        };
        check();
    });
}

function cl(str) {
    console.log(str);
}

function distance(ent1, ent2) {

    let pos1, pos2, distX, distY;

    if (!Array.isArray(ent1))
        pos1 = ent1.CenterOfMassPos();
    else
        pos1 = ent1;

    if (!Array.isArray(ent2))
        pos2 = ent2.CenterOfMassPos();
    else
        pos2 = ent2;

    distX = pos1[0] - pos2[0];
    distY = pos1[1] - pos2[1];

    return Math.sqrt(distX * distX + distY * distY);
}

function posSnap(ent) {
    let stub = [ent.pos[0], ent.pos[1]];
    return stub;
}

function LoadFile(accept, action) {

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = accept;

    fileInput.addEventListener('change', (event) => { action(event) });

    fileInput.click();
}

function PickColor(curCol = "#ff0000", onConfirm, onCancel, onChange) {

    const DataContainer = new GameContainer(
        mousePos,
        [200, "max-content"],
        {
            display: "flex",
            flexDir: "column",
            alignX: "center",
            alignY: "top",
            BGColor: "#ffffff",
            padding: 20,
            index: 51,
            gap: 10,
            border: {
                borderImg: "black",
                borderSize: 1,
                borderStyle: "solid",
                borderRadius: 25
            }
        },
        false,
        true
    );
    const CloseMenuBtn = new GameButton(
        [0, 0],
        [15, "max-content"],
        "X",
        () => {
            DataContainer.Delete();
            onCancel();
        },
        {
            display: "flex",
            position: "relative",
            alignX: "center",
            alignY: "center",
            color: "red",
            fontSize: 15,
            padding: 5,
            border: {
                borderImg: "red",
                borderSize: 1,
                borderStyle: "solid",
                borderRadius: "50%"
            }
        },
        true
    );
    DataContainer.AttachToMe(CloseMenuBtn);

    const ApplyBtn = new GameButton(
        [0, 0],
        ["50%", "max-content"],
        "Apply",
        () => {
            DataContainer.Delete();
            onConfirm()
        },
        {
            display: "flex",
            position: "relative",
            alignX: "center",
            alignY: "center",
            color: "green",
            fontSize: 20,
            padding: 5,
            border: {
                borderImg: "green",
                borderSize: 1,
                borderStyle: "solid",
                borderRadius: 25
            }
        },
        false
    );

    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.value = curCol;
    colorPicker.addEventListener('change', (event) => { onChange(event) });

    DataContainer.AttachToMe(colorPicker);
    DataContainer.AttachToMe(ApplyBtn);
}

async function D_DrawLine(start, end, color, duration) {

    if (!devMode) return;

    var posRef = new Entity("EntDist" + entCount, start, [distance(start, end), 5], color)
    posRef.ignoreGravity = true;
    posRef.solid = false;

    await s(duration);

    posRef.Delete();
}

async function DrawText(start, text, acolor, duration) {

    var text = new GameText(
        start,
        [100, 100],
        text,
        {
            alignX: "center",
            alignY: "center",
            color: acolor,
            fontSize: 64,
            index: 40
        },
        false);

    text.MoveTo([text.pos[0], text.pos[1] - 100], false);

    await text.FadeOut(duration);

    text.Delete();
}

async function ArrayEmptied(array) {
    while (array.length > 0) {
        await new Promise(resolve => setTimeout(resolve, tickrate));
    }
}

function ArrayFromClosest(ent, ents) {
    return ents.slice().sort((a, b) => distance(ent, a) - distance(ent, b));
}

function PickRandomFromArray(paths) {
    if (!Array.isArray(paths)) {
        return paths;
    } else {
        return paths[Math.floor(Math.random() * paths.length)]
    }
}

//GetMousePos
// document.addEventListener("mousedown", async (event) => {

//     var ClickRef = new Entity("mousePos"+entCount, mousePos, [100, 100], "red")
//     ClickRef.Weight = 10;
//     ClickRef.ignoreGravity = true;
//     ClickRef.solid = false;
// })

function GetMousePos(event) {

    let valX = (event.clientX + window.scrollX);
    let valY = (event.clientY + window.scrollY);

    mousePos = [valX, valY];
}

function PickRandomPos(coll) {
    return [Math.floor(Math.random() * GameSafeSpace.right - coll[0]), Math.floor(Math.random() * GameSafeSpace.bottom - coll[1])];
}

async function _StartSys() {
    await ms(tickrate);

    document.addEventListener("mousemove", async (event) => {
        GetMousePos(event)
    })

    //Has to be done this way because otherwise we can't unpause
    RegisterInput("g", "PauseGame", () => { });
    document.addEventListener("keyup", async (event) => {

        if (getActionFromKeybind(event.key).action == "PauseGame") {

            gamePaused = !gamePaused;

            if (gamePaused)
                hudElem_GP.docRef.style.opacity = 1;
            else
                hudElem_GP.docRef.style.opacity = 0;
        }

    })

    _startMovement();
}
