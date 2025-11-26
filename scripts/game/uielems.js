var HudElems = [];

class BaseUIElem extends Entity {
    
    HUDElem = false;
    style;

    constructor(pos, size, model, isHUDElem) {
        super("UIElem" + entCount, pos, size, model);

        this.style = model;

        this.trigger = false;
        this.ignoreGravity = true;
        this.solid = false;

        if (isHUDElem) {
            this.MakeHUDElem();
            this.adjustHUDElemScale();
            this.RegisterHUDElem();
        }
    }

    async FadeOut(time) {

        if (time <= 0) {
            console.warn("Invalid time specified for FadeOut()");
            return;
        }

        this.docRef.style.opacity = 1;
        let opacity = 1;
        let startTime = Date.now();
        
        while (opacity > 0) {

            while (gamePaused)
                await ms(tickrate)

            const elapsed = Date.now() - startTime;
            opacity = 1 - (elapsed / (time * 1000));
            this.docRef.style.opacity = Math.max(opacity, 0);

            await ms(tickrate);
        }
    }

    async FadeIn(time) {

        if (time <= 0) {
            console.warn("Invalid time specified for FadeIn()");
            return;
        }

        this.docRef.style.opacity = 0;
        let opacity = 0;
        let startTime = Date.now();
        
        while (opacity < 1) {
            
            while (gamePaused)
                await ms(tickrate)

            const elapsed = Date.now() - startTime;
            opacity = (elapsed / (time * 1000));
            this.docRef.style.opacity = Math.min(opacity, 1);

            await ms(tickrate);
        }
    }

    MakeHUDElem() {
        GameArea.removeChild(this.docRef);
        HUDSpace.appendChild(this.docRef);

        this.HUDElem = true;
    }

    adjustHUDElemScale() {
        if (this.docRef.parentNode != HUDSpace) {
            cl("it wasn't");
            return;
        }

        this.Teleport([((window.innerWidth - this.coll[0]) / 2) + this.pos[0], ((window.innerHeight - this.coll[1]) /2) + this.pos[1]]);
    }

    revertHUDElemScale() {
        
        this.Teleport([this.pos[0] - ((window.innerWidth - this.coll[0]) / 2), this.pos[1] - ((window.innerHeight - this.coll[1]) /2)]);
    }

    SetStyle(css) {
        this.style = css;
        this.SetModel([this.text, this.style]);
    }

    RegisterHUDElem() {
        HudElems.push(this);
    }
}

class GameText extends BaseUIElem {
    text;

    constructor(pos, size, text, style, isHUDElem) {
        super(pos, size == undefined ? [100, 100] : size, [text, style], isHUDElem);
        this.text = text;
    }
    
    entType() {
        return "gametext";
    }

    SetText(txt) {
        this.text = txt;
        this.SetModel([this.text, this.style]);
    }
}

class GameContainer extends BaseUIElem {
    
    constructor(pos, size, style, isHUDElem) {
        super(pos, size, ["", style], isHUDElem);
    }

    AttachToMe(elem) {
        elem.docRef.parentNode.removeChild(elem.docRef);
        this.docRef.appendChild(elem.docRef);
        
        elem.revertHUDElemScale();
    }

    entType() {
        return "gamecontainer";
    }
}

class GameButton extends GameText {
    
    action;

    constructor(pos, size, text, action, style, isHUDElem) {
        super(pos, size, text, style, isHUDElem);

        this.OverrideBtnAction(action);

        this.docRef.classList.add("GameButton");

        this.docRef.addEventListener("click", async (event) => {
            this.action();
        });
    }

    OverrideBtnAction(newAction) {
        this.action = newAction;
    }

    entType() {
        return "gamebutton";
    }
}