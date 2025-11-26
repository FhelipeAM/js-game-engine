main();

async function main() {
    var test = new Sentient("teste2", [1000, 10], [100, 100], "./assets/img/testent.jpg", "axis", false);
    test.movespeed = 0.65;
    test.MoveTo([120, 300], true);
    
    await test.Goal();
    
    await s(2);
    
    test.MoveTo([300, 120], true);
    
    await test.Goal();
    
    await s(2);
    test.aiEnabled = true;
    
    await s(1);
    
    var test2 = new Sentient("teste3", [1000, player.pos[1]], [100, 100], "./assets/img/testent.jpg", "allies", true);
    test2.movespeed = 0.55;

    await s(1);
    
    // player.health = 0;

    // infloopTest();
}

async function infloopTest() {

    while (true) {
        test.Teleport([120, 300], true);

        await s(0.01);
    }
}