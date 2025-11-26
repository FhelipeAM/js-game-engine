class BaseUIElem extends Entity {
    
    HUDElem = false;
    style;

    constructor(pos, size, model, isHUDElem) {
        super("UIElem" + entCount, pos, size, model);

        this.trigger = false;

        if (isHUDElem)
            this.MakeHUDElem();
    }

    async FadeOut(time) {
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
}

class GameText extends BaseUIElem {
    text;

    constructor(pos, text, style, isHUDElem, size) {
        super(pos, size == undefined ? [100, 100] : size, [text, style], isHUDElem);
        this.text = text;
        this.style = style;

        this.ignoreGravity = true;
        this.solid = false;
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
    
    constructor(pos, size, alignment, isHUDElem) {
        super(pos, size, ["model", { 
            alignY: alignment[1],
            alignX: alignment[0]
        }], isHUDElem);
    }

    AttachToMe(elem) {
        elem.docRef.parentNode.removeChild(elem);
        this.appendChild(elem);
    }

    entType() {
        return "gamecontainer";
    }
}

class GameButton extends GameText {
    
    action;

    constructor(pos, size, text, action, isHUDElem, style) {
        super(pos, text, style, isHUDElem, size);

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