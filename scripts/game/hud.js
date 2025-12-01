const hudContainer = new GameContainer([0, 0], ["100vw", "100vh"], {
    display: "flex",
    alignX: "center",
    alignY: "center",
}, true, true);

const HUDStyle = { position: "absolute", color: "#000", alignX: "center", alignY: "center", fontSize: 80 };

var hudElem_health = new GameText([-850, 800], [50, 500], "", HUDStyle, true)
var hudElem_ammo = new GameText([600, 800], [50, 500], "", HUDStyle, true)
var hudElem_TPS = new GameText([1100, 0], [300, 490], "", { ...HUDStyle, fontSize: 20 }, true)

hudContainer.AttachToMe(hudElem_health);
hudContainer.AttachToMe(hudElem_ammo);
hudContainer.AttachToMe(hudElem_TPS);

async function UpdateHUD() {

    if (devMode)
        hudElem_TPS.SetText("TPS: " + TPS);

    if (hudElem_health.text != player.health)
        hudElem_health.SetText(player.health);

    if (hudElem_ammo.text == "" && (player.weapons.curAmmoCount == Infinity || player.weapons.ammoCount == 0))
        return;

    if (player.weapons.curAmmoCount + "/" + player.weapons.curAmmoCountRes != hudElem_ammo.text || player.weapons.curAmmoCount == Infinity || player.weapons.ammoCount == 0) {

        if (player.weapons.curAmmoCount != Infinity && player.weapons.ammoCount != 0)
            hudElem_ammo.SetText(player.weapons.curAmmoCount + "/" + player.weapons.curAmmoCountRes)
        else
            hudElem_ammo.SetText("")
    }
}

//manual override
function setHUDTextColor(col) {
    hudElem_health.docRef.style.color = col;
    hudElem_ammo.docRef.style.color = col;
    hudElem_TPS.docRef.style.color = col;
}