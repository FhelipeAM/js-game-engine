const hudContainer = new GameContainer([0, 0], ["100vw", "100vh"], {
    display: "flex",
    alignX: "center",
    alignY: "center",
}, true, true);

var HUDStyle = { position: "absolute", color: "#000", alignX: "center", alignY: "center", fontSize: 80 }

var hudElem_health = new GameText([-850, 800], [50, 500], "", HUDStyle, true)
var hudElem_ammo = new GameText([600, 800], [50, 500], "", HUDStyle, true)

hudContainer.AttachToMe(hudElem_health);
hudContainer.AttachToMe(hudElem_ammo);

async function UpdateHUD() {

    if (hudElem_health.text != player.health)
        hudElem_health.SetText(player.health);

    if (hudElem_ammo.text == "" && (player.weapons.curAmmoCount == Infinity || player.weapons.curAmmoCount == 0))
        return;

    if (player.weapons.curAmmoCount + "/" + player.weapons.curAmmoCountRes != hudElem_ammo.text || player.weapons.curAmmoCount == Infinity || player.weapons.curAmmoCount == 0) {

        if (player.weapons.curAmmoCount != Infinity && player.weapons.curAmmoCount != 0)
            hudElem_ammo.SetText(player.weapons.curAmmoCount + "/" + player.weapons.curAmmoCountRes)
        else
            hudElem_ammo.SetText("")
    }
}

//manual override
function setHUDTextColor(col) {
    hudElem_health.docRef.style.color = col;
    hudElem_ammo.docRef.style.color = col;
}