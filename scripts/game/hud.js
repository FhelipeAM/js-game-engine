const hudContainer = new GameContainer([0, 0], ["100vw", "100vh"], {
    display: "flex",
    alignX: "center",
    alignY: "center"
}, true, true);

var hudElem_health = new GameText([-850, 800], [50, 500], "", { position: "absolute", color: "red", alignX: "center", alignY: "center", fontSize: 80 }, true)
var hudElem_ammo = new GameText([600, 800],  [50, 500], "", { position: "absolute", color: "red", alignX: "center", alignY: "center", fontSize: 80 }, true)

hudContainer.AttachToMe(hudElem_health);
hudContainer.AttachToMe(hudElem_ammo);

async function UpdateHUD() {

    if (hudElem_health.text != player.health)
        hudElem_health.SetText(player.health);

    if (hudElem_ammo.text == "" && player.weapons.curAmmoCount == Infinity)
        return;

    if (player.weapons.curAmmoCount + "/" + player.weapons.curAmmoCountRes != hudElem_ammo.text || player.weapons.curAmmoCount == Infinity) {

        if (player.weapons.curAmmoCount != Infinity)
            hudElem_ammo.SetText(player.weapons.curAmmoCount + "/" + player.weapons.curAmmoCountRes)
        else
            hudElem_ammo.SetText("")
    }
}

async function TestFunc() {
    alert("Evil hello world")
} 