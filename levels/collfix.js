main();

function main() {
    jumpForce = 600;
    // var stubEnt = new Entity("HOUSE" + entCount, [300, 300], [1000, 1000], ["", { BGColor: "red", index: 3}]);
    // stubEnt.ignoreGravity = true;
    
    // var stubEnt2 = new Entity("refPos" + entCount, [0, 0], [50, 1000], ["", { BGColor: "blue", index: 3}]);
    // stubEnt2.solid = false;
    // stubEnt2.ignoreGravity = true;
    // stubEnt2.linkTo(stubEnt, [(stubEnt.CenterOfMass()[0]) - stubEnt2.CenterOfMass()[0], (stubEnt.CenterOfMass()[1]) - stubEnt2.CenterOfMass()[1]])

    // var stubEnt3 = new Entity("refPos" + entCount, [0, 0], [1000, 50], ["", { BGColor: "blue", index: 3}]);
    // stubEnt3.solid = false;
    // stubEnt3.ignoreGravity = true;
    // stubEnt3.linkTo(stubEnt, [(stubEnt.CenterOfMass()[0]) - stubEnt3.CenterOfMass()[0], (stubEnt.CenterOfMass()[1]) - stubEnt3.CenterOfMass()[1]])
    
    // var stubEnt4 = new Entity("refPos" + entCount, stubEnt.pos, stubEnt.CenterOfMass(), ["", { BGColor: "blue", index: 3}]);
    // stubEnt4.solid = false;
    // stubEnt4.ignoreGravity = true;
    // stubEnt4.linkTo(stubEnt, [(stubEnt.CenterOfMass()[0]) , (stubEnt.CenterOfMass()[1]) - stubEnt4.CenterOfMass()[1]])

    
    var stubEnt = new Entity("HOUSE" + entCount, [300, 300], [100, 100], ["", { BGColor: "red", index: 3}]);
    stubEnt.ignoreGravity = false;
    stubEnt.weight = 1
    var stubEnt2 = new Entity("HOUSE" + entCount, [401, 300], [100, 100], ["", { BGColor: "red", index: 3}]);
    stubEnt2.ignoreGravity = false;
    stubEnt2.weight = 1
    var stubEnt3 = new Entity("HOUSE" + entCount, [501, 300], [100, 100], ["", { BGColor: "red", index: 3}]);
    stubEnt3.ignoreGravity = false;
    stubEnt3.weight = 1
    
    var stubEnt = new Entity("HOUSE" + entCount, [1400, 300], [100, 100], ["", { BGColor: "red", index: 3}]);
    stubEnt.ignoreGravity = false;
    stubEnt.weight = 1
    var stubEnt2 = new Entity("HOUSE" + entCount, [1400, 400], [100, 100], ["", { BGColor: "red", index: 3}]);
    stubEnt2.ignoreGravity = false;
    stubEnt2.weight = 1
    var stubEnt3 = new Entity("HOUSE" + entCount, [1400, 500], [100, 100], ["", { BGColor: "red", index: 3}]);
    stubEnt3.ignoreGravity = false;
    stubEnt3.weight = 1


    player.Teleport([800, 100], false);
    player.weight = 3
}