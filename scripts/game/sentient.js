var sentients = [];

class Sentient extends Entity {
    //state
    aiEnabled = true;
    oblivious = false;
    notarget = false;
    godMode = false;
    health = 100;
    bulletSpeed = 1;
    dead = false;

    weapons;

    //think
    team = "unset";
    target = undefined;

    constructor(id, sp, ppr, img, team, hasAI) {
        super(id, sp, ppr, img);

        this.aiEnabled = hasAI;
        this.team = team;

        this.docRef.classList.add("sentient");

        this.RegisterSentient();

        this.GiveWeapon(GetWeaponByName("DEFAULTMELEE"));
    }

    _think() {

        if (this.dead)
            return;

        if (this.health <= 0)
            this.onDeath();

        if (!this.aiEnabled)
            return;

        if (this.team == "unset")
            return;

        if (!this._validTarget()) {
            this._seekTarget();
        } else {
            this._chase();
        }
    }

    _validTarget() {
        return this.target != undefined && this.target.team != "unset" && !this.target.dead && this.target.team != this.team && !this.target.notarget;
    }

    _validEntToTarget(ent) {
        return !ent.dead && ent.team != "unset" && ent.team != this.team && !ent.notarget;
    }

    _seekTarget() {
        if (this.dead || this.oblivious) {
            this.target = undefined;
            return;
        }

        let closest = null;
        let closestDistance = Infinity;

        for (const se of sentients) {

            if (se === this || !this._validEntToTarget(se)) continue;

            const dist = distance(this, se);
            if (dist < closestDistance) {
                closest = se;
                closestDistance = dist;
            }
        }

        this.target = closest;
    }

    _chase() {
        if (this.dead)
            return;

        if (this.InRangeToTarget()) {
            if (this.weapons.curAmmoCount > 0) {
                this.weapons.Shoot(this);
            } else if (!this.weapons.reloading) {
                this.weapons.Reload(this);
            }

            return;
        }

        let stub = [];
        stub[0] = this.target.pos[0];
        stub[1] = this.target.pos[1];

        this.MoveTo(stub, false)
    }

    RegisterSentient() {
        sentients.push(this);
    }

    GiveWeapon(weapon) {
        this.weapons = weapon;
    }


    Damage(amount) {
        if (this.health <= 0 || this.godMode)
            return;

        D_DrawText(this.pos, "-" + amount, "red", 2);

        this.health -= amount;
    }

    InRangeToTarget() {
        return distance(this, this.target) <= this.weapons.range;
    }

    async Death() {
        while (this.health > 0) {
            await new Promise(resolve => setTimeout(resolve, tickrate));
        }
    }

    onDeath() {
        this.dead = true;
        this.StopMove();
        this.solid = false;

        this.docRef.classList.add("dead");
    }
}