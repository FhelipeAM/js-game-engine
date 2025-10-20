var friendlyFire = false;

class Bullet extends Entity {
    startTime = 0;
    damage = 0;
    team = "unset";

    constructor(id, startPos, end, dmg, team, fsnd) {
        super(id, startPos, [50, 50], "./assets/img/testbullet.jpg");
        this.ignoreGravity = true;

        this.movespeed = 10;
        this.startTime = timePassed;
        this.damage = dmg;
        this.team = team;
        
        if (fsnd != undefined)
            PlaySound(fsnd[0], fsnd[1], false);

        this.MoveTo(end);

        this._CollListener();

        this.AwaitGoal();
    }

    async AwaitGoal() {
        await this.Goal();

        this.Delete();
    }

    async _CollListener() {

        while (true) {
            if (this.collTarget != undefined && this.collTarget.Damage) {
                if (this.collTarget.team != this.team || !friendlyFire) {
                    this.collTarget.Damage(this.damage)
                    this.Delete();
                    return;
                }
            }
-
            await ms(tickrate);
        }
    }
}