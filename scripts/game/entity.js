var entities = [];

class Entity {
    //movement
    movespeed = 1;
    ignoreGravity = false;
    coll = [0, 0];
    collTarget;
    mdl = "";
    docRef;
    
    //untweakable
    pos = [0, 0];
    end = [0, 0];
    iIgnoreGravity = false;
    interpolating = false;
    interpos = [0, 0];
    falling = false;
    midAir = false;

    constructor(id, startPos, ppr, img) {

        this.mdl = img;

        this.coll = ppr;

        if (document.getElementById(id) != undefined) {
            this.MakeEntityFromElement(id);
        } else {
            this.SpawnEntity(id);
        }

        this.SetModel(img);

        this.RegisterEntity();

        this.Teleport(startPos);
    }

    SpawnEntity(id) {
        var stub = document.createElement("div");
        
        // console.log(id);
        stub.setAttribute("id", id);
        stub.classList.add("entity");

        GameArea.appendChild(stub);

        this.MakeEntityFromElement(id);
    }

    MakeEntityFromElement(id) {
        this.docRef = document.getElementById(id);

        this.docRef.style.width = this.coll[0] + "px";
        this.docRef.style.height = this.coll[1] + "px";
    }

    RegisterEntity() {
        entities.push(this);
    }

    Teleport(pos) {
        this.pos = pos;
        this.end = pos;

        this.docRef.style.marginLeft = pos[0] + "px";
        this.docRef.style.marginTop = pos[1] + "px";
    }

    MoveTo(end, gravity) {
        if (end == this.pos)
            return;

        this.end = end;

        this.interpos = this.pos;
        this.interpolating = true;
        this.iIgnoreGravity = gravity;
    }

    StopMove() {
        this.pos = [this.interpos[0], this.interpos[1]];
        this.end = [this.interpos[0], this.interpos[1]];

        this.interpolating = false;
        this.iIgnoreGravity = false;
    }

    SetSize(size) {
        this.coll = size;

        this.docRef.style.width = this.coll[0] + "px";
        this.docRef.style.height = this.coll[1] + "px";
    }
    
    SetModel(mdlstr) {
        this.mdl = mdlstr
        this.docRef.style.backgroundImage = `url(${this.mdl})`
    }

    Hide() {
        this.docRef.style.opacity = 0;
    }

    Show() {
        this.docRef.style.opacity = 1;
    }

    Opaque(percent) {
        this.docRef.style.opacity = percent;
    }

    Delete() {
        this.docRef.remove();
        delete this;
    }

    async Collide() {
        while (this.collTarget == undefined) {
            await new Promise(resolve => setTimeout(resolve, tickrate));
        }
    }

    async Goal() {
        while (this.interpolating) {
            await new Promise(resolve => setTimeout(resolve, tickrate));
        }
    }
    async OnGround() {
        while (this.falling || this.midAir) {
            await new Promise(resolve => setTimeout(resolve, tickrate));
        }
    }
}