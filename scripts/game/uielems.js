var HudElems = [];

class BaseUIElem extends Entity {

    HUDElem = false;
    style;

    constructor(pos, size, model, isHUDElem) {
        super("UIElem" + entCount, pos, size);

        this.style = model;

        this.docRef.classList.add("UIElem");

        this.ignoreGravity = true;
        this.solid = false;

        if (isHUDElem) {
            this.MakeHUDElem();
            this.RegisterHUDElem();
        }

        this.SetModel(model);

        _RescaleHUDElems();
    }

    async FadeOut(time) {

        if (time <= 0) {
            if (devMode)
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
            if (devMode)
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

    SetStyle(css) {
        this.style = css;
        this.SetModel([this.text, this.style]);
    }

    RegisterHUDElem() {
        HudElems.push(this);
    }

    entType() {
        return "uielem";
    }
}

class GameText extends BaseUIElem {
    text;

    constructor(pos, size, text, style, isHUDElem) {
        super(pos, size == undefined ? [100, 100] : size, [text, style], isHUDElem);
        this.text = text;
    }

    SetText(txt) {
        this.text = txt;
        this.SetModel([this.text, this.style]);
    }
}

class GameContainer extends BaseUIElem {

    constructor(pos, size, style, isHUDElem, scaleWithScreen) {
        super(pos, size, ["", style], isHUDElem);

        if (scaleWithScreen)
            this.docRef.classList.add("GameContainer");
    }

    AttachToMe(elem) {

        if (elem.docRef.parentNode != undefined)
            elem.docRef.parentNode.removeChild(elem.docRef);

        this.docRef.appendChild(elem.docRef);
    }

    Detach(elem) {

        if (elem.docRef.parentNode != this.docRef) {
            if (devMode)
                console.warn("Trying to detach element but it's not attached.")
            return;
        }

        this.docRef.removeChild(elem.docRef);
        HUDSpace.appendChild(elem.docRef);
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
}

class GameInputBox extends BaseUIElem {

    action;
    text;

    constructor(pos, size, defVal, action, style, isHUDElem) {
        super(pos, size, ["", style], isHUDElem);

        this.OverrideInputAction(action);

        this.docRef.classList.add("GameInputBox");
        this.text = defVal

        // replace the div with input
        let orgParent = this.docRef;

        this.docRef = document.createElement("input");
        this.docRef.id = orgParent.id;
        this.docRef.type = "text";
        this.docRef.className = orgParent.className;
        this.docRef.style.cssText = orgParent.style.cssText;

        for (let attr of orgParent.attributes) {
            if (attr.name !== 'id') {
                this.docRef.setAttribute(attr.name, attr.value);
            }
        }

        orgParent.parentNode.replaceChild(this.docRef, orgParent);

        this.docRef.value = defVal;

        this.docRef.addEventListener("input", async () => {
            this.text = parseInt(this.docRef.value);
            this.action();
        });
    }

    OverrideInputAction(newAction) {
        this.action = newAction;
    }
}

window.addEventListener('resize', (e) => {
    _RescaleHUDElems();
});

function _RescaleHUDElems() {

    HudElems.forEach((elem) => {

        if (elem.docRef == null) {
            HudElems.splice(HudElems.indexOf(elem), 1);
            return;
        }

        if (elem.docRef.classList.contains("GameContainer")) {
            elem.docRef.style.transform = `scale(${window.innerWidth / 1000})`
        }
    })
}