var sentients = [];

class Sentient extends Entity {
    //state
    aiEnabled = true;
    oblivious = false;
    notarget = false;
    godMode = false;
    health = 100;
    dead = false;

    //think
    team = "unset";
    target = undefined;

    constructor(id, sp, ppr, img, team, hasAI) {
        super(id, sp, ppr, img);

        this.aiEnabled = hasAI;
        this.team = team;

        this.docRef.classList.add("sentient");

        this.RegisterSentient();
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
        if (this.dead || this.oblivious)
            return;

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

        let stub = [];
        stub[0] = this.target.pos[0];
        stub[1] = this.target.pos[1];

        this.MoveTo(stub, true)
    }

    RegisterSentient() {
        sentients.push(this);
    }

    Shoot() {
        console.log("bang");
    }

    Damage(amount) {
        if (this.health <= 0 || this.godMode)
            return;

        this.health -= amount;
    }

    onDeath() {
        this.dead = true;
        this.StopMove();

        this.docRef.classList.add("dead");
    }
}