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

        if (this.target == undefined || !this._validTarget()) {
            this._seekTarget();
        } else {
            this._chase();
        }
    }

    _validTarget() {
        return this.target.team != "unset" && !this.target.dead && this.target.team != this.team && !this.target.notarget;
    }

    _seekTarget() {
        if (this.dead || this.oblivious) {
            this.target = undefined;
            return;
        }

        sentients.forEach((se) => {
            if (!se.dead &&
                se.team != "unset" && 
                se.team != this.team) {
                this.target = se;
            }
        });
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
        }

        let stub = [];
        stub[0] = this.target.pos[0];
        stub[1] = this.target.pos[1];

        this.MoveTo(stub, true)
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
        
        this.health -= amount;
    }

    InRangeToTarget() {
        return distance(this, this.target) < (this.coll[0] + this.weapons.range);
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