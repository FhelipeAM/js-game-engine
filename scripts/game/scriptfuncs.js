_StartSys()

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
    let v1 = (ent1.CenterOfMass()[0]) - (ent2.CenterOfMass()[0]);

    if (v1 <= 0) 
        v1 *= -1;
    
    return v1;
}

function posSnap(ent) {
    let stub = [ent.pos[0], ent.pos[1]];
    return stub;
}

//GetMousePos
document.addEventListener("mousedown", async (event) => {

    if (!devMode) return;

    let valX = (event.clientX + window.scrollX);
    let valy = (event.clientY + window.scrollY);

    cl("Mouse X: " + valX + ", Mouse Y: " + valy);
    
    var ClickRef = new Entity("mousePos"+entCount, [valX, valy], [100, 100], "red")
    ClickRef.Weight = 10;
    ClickRef.ignoreGravity = true;
    ClickRef.solid = false;
})

document.addEventListener("keypress", async (event) => {

    if (!devMode) return;

    if (event.key == "f") {
        gamePaused = !gamePaused;
    }
})

async function _StartSys() {
    await ms(tickrate);
    main();
}