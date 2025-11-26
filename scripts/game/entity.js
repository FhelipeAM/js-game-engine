var entities = [];
entCount = 0;

const UOP = "px"; // unit of position
const UOS = "px"; // unit of size

class Entity {
    //movement
    movespeed = 1;
    ignoreGravity = false;
    coll = [0, 0];
    collTarget;
    solid = true;
    trigger = true;
    weight = 0;
    mdl = "";
    docRef;
    
    //untweakable
    pos = [0, 0];
    end = [0, 0];
    
    linkedTo = null;
    linkedToOffset = [0, 0];

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

        stub.setAttribute("id", id);
        stub.classList.add("entity");

        GameArea.appendChild(stub);

        this.MakeEntityFromElement(id);
    }

    MakeEntityFromElement(id) {
        this.docRef = document.getElementById(id);

        this.docRef.style.width = this.coll[0] + UOS;
        this.docRef.style.height = this.coll[1] + UOS;
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
        this.docRef.style.marginLeft = pos[0] + UOP;
        this.docRef.style.marginTop = pos[1] + UOP;
    }

    async MoveTo(end, gravity) {
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

        this.docRef.style.width = this.coll[0] + UOP;
        this.docRef.style.height = this.coll[1] + UOP;
    }

    SetModel(mdlstr) {

        this.mdl = mdlstr

        if (mdlstr.includes('/')) {
            this.docRef.style.backgroundImage = `url(${this.mdl})`
            this.docRef.style.backgroundColor = `transparent`
        }
        else if (Array.isArray(mdlstr)) {
            let dat = this.mdl[1];
            this.docRef.innerText = `${this.mdl[0]}`
            this.docRef.style.backgroundImage = `url()`

            switch (dat["alignY"]) {
                default:
                case "top":
                    this.docRef.style.alignItems = `start`
                    break;
                case "center":
                    this.docRef.style.alignItems = `center`
                    break;
                case "bottom":
                    this.docRef.style.alignItems = `end`
                    break;
            }

            switch (dat["alignX"]) {
                default:
                case "left":
                    this.docRef.style.justifyContent = `start`
                    break;
                case "center":
                    this.docRef.style.justifyContent = `center`
                    break;
                case "between":
                    this.docRef.style.justifyContent = `space-between`
                    break;
                case "around":
                    this.docRef.style.justifyContent = `space-around`
                    break;
                case "right":
                    this.docRef.style.justifyContent = `end`
                    break;
            }

            if("position" in dat) {
                this.docRef.style.position = dat["position"];
            }

            if("BGColor" in dat) {
                this.docRef.style.backgroundColor = dat["BGColor"];
            } else {
                this.docRef.style.backgroundColor = "transparent";
            }

            if("display" in dat) {
                this.docRef.style.display = dat["display"];
            } else {
                this.docRef.style.display = "flex";
            }

            if("color" in dat) {
                this.docRef.style.color = dat["color"];
            }
            
            if("textAlign" in dat) {
                this.docRef.style.textAlign = dat["textAlign"];
            }


            if("fontSize" in dat) {
                this.docRef.style.fontSize = dat["fontSize"] + UOP;
            }

            if("fontFam" in dat) {
                this.docRef.style.fontFamily = dat["fontFam"];
            }

            if("index" in dat) {
                this.docRef.style.zIndex = dat["index"];
            }

            if("opacity" in dat) {
                this.docRef.style.opacity = dat["opacity"];
            }

            if("padding" in dat) {
                this.docRef.style.padding = dat["padding"] + UOP;
            }

            if("gap" in dat) {
                this.docRef.style.gap = dat["gap"] + UOP;
            }

            if("border" in dat) {

                if (typeof dat["border"]["borderImg"] === 'string') {

                    if (dat["border"]["borderImg"].includes('/'))
                        this.docRef.style.borderImage = dat["border"]["borderImg"];
                    else
                        this.docRef.style.borderColor = dat["border"]["borderImg"];

                } else {
                    console.warn("Border for object " + this.docRef.id + " was not properly setup. Ignoring");
                    return;
                }

                this.docRef.style.borderWidth = dat["border"]["borderSize"] + UOP;
                this.docRef.style.borderStyle = dat["border"]["borderStyle"];
                this.docRef.style.borderRadius = dat["border"]["borderRadius"] + UOP;

            }

        } else {
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
        if (this.docRef == null)
            return;

        entities.splice(entities.indexOf(this), 1);
    
        this.docRef.parentNode.removeChild(this.docRef);
        this.docRef.remove();
        this.docRef = null;

        delete this.docRef;
    
    }

    async linkTo(ent2, offset) {
        this.linkedTo = ent2;
        if (offset != null)
            this.linkedToOffset = offset;
    }
    
    async unlink() {
        this.linkedTo = null;
        this.linkedToOffset = [0, 0];
    }
    
    entType() {
        return "entity";
    }

    CenterOfMass() {
        return [this.pos[0] + (this.coll[0] / 2), this.pos[1] + (this.coll[1] / 2)];
    }

    IsToTheLeft(ent2) {
        return this.CenterOfMass()[0] > ent2.CenterOfMass()[0];
    }

    IsAbove(ent2) {
        let v1 = this.CenterOfMass()[1] > ent2.CenterOfMass()[1];
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