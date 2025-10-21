var entities = [];
entCount = 0;

class Entity {
    //movement
    movespeed = 1;
    ignoreGravity = false;
    coll = [0, 0];
    collTarget;
    solid = true;
    weight = 0;
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
        entCount++;
        entities.push(this);
    }

    Teleport(pos) {
        this.pos = pos;
        this.end = pos;
        this.interpos = this.pos;

        this.interpolating = false;
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
        
        if (mdlstr.includes('/')) {
            this.docRef.style.backgroundImage = `url(${this.mdl})`
            this.docRef.style.backgroundColor = `transparent`
        }
        else {
            this.docRef.style.backgroundColor = `${this.mdl}`
            this.docRef.style.backgroundImage = `url()`
        } 
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
        entities.splice(entities.indexOf(this), 1);
        this.docRef.remove();
        delete this;
    }

    CenterOfMass() {
        return [this.pos[0] + (this.coll[0] / 2), this.pos[1] + (this.coll[1] / 2)]; 
    }

    IsToTheLeft(ent2) {
        return this.CenterOfMass()[0] > ent2.CenterOfMass()[0];
    }

    IsAbove(ent2) {
        let v1 = this.CenterOfMass()[1] > ent2.CenterOfMass()[1];
        cl(v1)
        return v1;
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