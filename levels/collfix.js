const cubeWeight = 2;
const pWeight = 1;

main();

function main() {

    SetPlayableAreaSize(10000, 2000);

    RemoveInput("jump");

    RegisterInput("w", "MoveUp", async () => {

        if (movementTarget.pos[1] > GameSafeSpace.top) {
            diry = movementTarget.pos[1] - 1;
        }

        movementTarget.MoveTo([dirx, diry], true);

        diry = movementTarget.pos[1];

    });

    RegisterInput("s", "MoveDown", async () => {

        if (movementTarget.pos[1] < GameSafeSpace.bottom - movementTarget.coll[1]) {
            diry = movementTarget.pos[1] + 1;
        }

        movementTarget.MoveTo([dirx, diry], true);

        diry = movementTarget.pos[1]

    });

    jumpForce = 600;
    player.ignoreGravity = true;

    var stubEnt = new Entity("HOUSE" + entCount, PickRandomPos(), RandomSize(), ["", { BGColor: "red", index: 3 }]);
    stubEnt.ignoreGravity = true;
    stubEnt.weight = cubeWeight
    var stubEnt2 = new Entity("HOUSE" + entCount, PickRandomPos(), RandomSize(), ["", { BGColor: "red", index: 3 }]);
    stubEnt2.ignoreGravity = true;
    stubEnt2.weight = cubeWeight
    var stubEnt3 = new Entity("HOUSE" + entCount, PickRandomPos(), RandomSize(), ["", { BGColor: "red", index: 3 }]);
    stubEnt3.ignoreGravity = true;
    stubEnt3.weight = cubeWeight

    var stubEnt = new Entity("HOUSE" + entCount, PickRandomPos(), RandomSize(), ["", { BGColor: "red", index: 3 }]);
    stubEnt.ignoreGravity = true;
    stubEnt.weight = cubeWeight
    var stubEnt2 = new Entity("HOUSE" + entCount, PickRandomPos(), RandomSize(), ["", { BGColor: "red", index: 3 }]);
    stubEnt2.ignoreGravity = true;
    stubEnt2.weight = cubeWeight
    var stubEnt3 = new Entity("HOUSE" + entCount, PickRandomPos(), RandomSize(), ["", { BGColor: "red", index: 3 }]);
    stubEnt3.ignoreGravity = true;
    stubEnt3.weight = cubeWeight

    var trigger = new Trigger([1800, 500], [100, 100], ["once"], () => {
        cl("hellow jrnmg")
    });

    const playerViewRadius = 700;

    var sent = new Sentient("sentTest" + entCount, PickRandomPos(), [100, 100], "assets/img/testent8.png", "axis", true);
    sent.ignoreGravity = false;

    let visRadius = new Entity("PlayerVisRadius", player.pos, [(playerViewRadius * 2 - player.CenterOfMass()[0]), (playerViewRadius * 2 - player.CenterOfMass()[1])], ["", {}])

    visRadius.SetModel(["", {
        BGColor: "radial-gradient(circle, rgba(0, 0, 0, 0.35) 10%,rgba(255, 0, 0, 0) 70%)",
        index: 1,
        border: {
            borderRadius: "50%"
        }
    }])

    visRadius.ignoreGravity = true;
    visRadius.solid = false;
    visRadius.linkTo(player, [(visRadius.CenterOfMass()[0] * -1) + player.CenterOfMass()[0], (visRadius.CenterOfMass()[1] * -1) + player.CenterOfMass()[0]]);


    player.Teleport([800, 100], false);
    player.movespeed = 5
    player.weight = pWeight
}

document.addEventListener("mousedown", async (event) => {

    var ClickRef = new Entity("mousePos" + entCount, mousePos, [100, 100], "red")
    ClickRef.Weight = 10;
    ClickRef.ignoreGravity = false;
    ClickRef.solid = true;
})

function RandomSize() {
    return [Math.max(Math.floor(Math.random() * 800), 100), Math.max(Math.floor(Math.random() * 800), 100)];
}

function PickRandomPos() {
    return [Math.floor(Math.random() * GameSafeSpace.right), Math.floor(Math.random() * GameSafeSpace.bottom)];
}