const HUDSpace = document.getElementById("HUD");

var hudElem_health = new GameText([100, 800], "100", {color: "red", alignX: "center", alignY: "center", fontSize: 128}, true, [100, 100])
var hudElem_ammo = new GameText([300, 0], "10/399", {color: "red", alignX: "center", alignY: "center", fontSize: 128}, true, [100, 100])

var hudElem_btnTest = new GameButton(
    [600, 0],
    [300, 50],
    "Teste", 
    TestFunc,
    true,
    {color: "red", alignX: "center", alignY: "center", fontSize: 128, border: {
        borderImg: "green",
        borderSize: 4,
        borderStyle: "solid"
    }})

async function UpdateHUD() {
    hudElem_health.SetText(player.health);

    if (player.weapons.curAmmoCount != Infinity)
        hudElem_ammo.SetText(player.weapons.curAmmoCount + "/" + player.weapons.curAmmoCountRes)
    else 
        hudElem_ammo.SetText("")
}

async function TestFunc() {
    alert("Evil hello world")
} 