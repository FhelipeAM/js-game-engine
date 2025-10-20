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

function posSnap(ent) {
    let stub = [ent.pos[0], ent.pos[1]];
    return stub;
}

async function _StartSys() {
    await ms(tickrate);
    main();
}