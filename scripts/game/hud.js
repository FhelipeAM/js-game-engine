var hudElem_health = new GameText([-850, 350], [100, 100], "", { color: "red", alignX: "center", alignY: "center", fontSize: 128 }, true)
var hudElem_ammo = new GameText([500, 350], [100, 100], "", { color: "red", alignX: "center", alignY: "center", fontSize: 128 }, true)

/*
var hudElem_btnTest = new GameButton(
    [600, 0],
    [300, 50],
    "Teste",
    TestFunc,
    {
        color: "red", alignX: "center", alignY: "center", fontSize: 128, border: {
            borderImg: "green",
            borderSize: 4,
            borderStyle: "solid"
        }
    },
    true
)
    */

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