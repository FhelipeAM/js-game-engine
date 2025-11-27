var sentients = [];
var deadCleanupTime = 10;

class Sentient extends Entity {
    //state
    aiEnabled = true;
    infiniteAmmo = false;
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

    //methods
    onDeath;

    constructor(id, sp, ppr, img, team, hasAI) {
        super(id, sp, ppr, img);

        this.aiEnabled = hasAI;
        this.team = team;

        this.docRef.classList.add("sentient");

        this.RegisterSentient();

        this.GiveWeapon(GetWeaponByName("DEFAULTMELEE"));

        this.onDeath = () => {};
    }

    async _think() {

        if (this.dead)
            return;

        if (this.health <= 0)
            this._Death();

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

        for (let se of sentients) {

            if (se === this || !this._validEntToTarget(se)) continue;

            if (distance(this, se) < closestDistance) {
                closest = se;
                closestDistance = distance(this, se);
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
            } else {
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

    entType() {
        return "sentient";
    }

    GiveWeapon(weapon) {
        this.weapons = weapon;
    }

    Damage(amount) {
        
        if (this.health <= 0 || this.godMode)
            return;

        D_DrawText([this.pos[0], this.pos[1] - this.coll[1]], "-" + amount, "red", 2);

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

    _Death() {

        this.dead = true;
        this.StopMove();
        this.solid = false;

        if (this.docRef != null)
            this.docRef.classList.add("dead");

        this.onDeath();

        this._Cleanup();
        
    }

    async _Cleanup() {
        await s(deadCleanupTime);

        this.Delete();
    }
}