var mousePos = [0, 0];

function s(s) {
    return new Promise(resolve => setTimeout(resolve, s*1000));
}
function ms(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function cl(str) {
    console.log(str);
}

function distance(ent1, ent2) {

    let v1;
    if (!Array.isArray(ent1))
        v1 = (ent1.CenterOfMass()[0]);
    else
        v1 = ent1[0];

    if (!Array.isArray(ent2))
        v1 -= (ent2.CenterOfMass()[0]);
    else
        v1 -= ent2[0];

    if (v1 <= 0) 
        v1 *= -1;
    
    return v1;
}

function posSnap(ent) {
    let stub = [ent.pos[0], ent.pos[1]];
    return stub;
}

async function D_DrawLine(start, end, color, duration) {

    if (!devMode) return;

    var posRef = new Entity("EntDist"+entCount, start, [distance(start, end), 5], color)
    posRef.ignoreGravity = true;
    posRef.solid = false;

    await s(duration);

    posRef.Delete();
}

async function D_DrawText(start, text, acolor, duration) {

    if (!devMode) return;

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

    await s(duration);

    await text.FadeOut(1);

    text.Delete();
}

//GetMousePos
// document.addEventListener("mousedown", async (event) => {
    
//     var ClickRef = new Entity("mousePos"+entCount, mousePos, [100, 100], "red")
//     ClickRef.Weight = 10;
//     ClickRef.ignoreGravity = true;
//     ClickRef.solid = false;
// })

document.addEventListener("mousemove", async (event) => {
    GetMousePos(event)
})


//Has to be done this way because otherwise we can't unpause
RegisterInput("h", "PauseGame", () => {});
document.addEventListener("keyup", async (event) => {
    
    if (getActionFromKeybind(event.key).action == "PauseGame") {

        if (!devMode) return;

        gamePaused = !gamePaused;
    }

})

function GetMousePos(event) {

    let valX = (event.clientX + window.scrollX);
    let valY = (event.clientY + window.scrollY);
    
    mousePos = [valX, valY];
}

async function _StartSys() {
    await ms(tickrate);
}