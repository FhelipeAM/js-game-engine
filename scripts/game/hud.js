const HUDSpace = document.getElementById("HUD");

var hudElem_health = new GameText([100, 800], "100", {color: "red", alignX: "center", alignY: "center", fontSize: 128})
var hudElem_ammo = new GameText([300, 0], "10/399", {color: "red", alignX: "center", alignY: "center", fontSize: 128})

hudElem_health.MakeHUDElem();
hudElem_ammo.MakeHUDElem();

async function UpdateHUD() {
    hudElem_health.SetText(player.health);

    if (player.weapons.curAmmoCount != Infinity)
        hudElem_ammo.SetText(player.weapons.curAmmoCount + "/" + player.weapons.curAmmoCountRes)
    else 
        hudElem_ammo.SetText("")
}