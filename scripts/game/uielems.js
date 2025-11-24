class GameText extends Entity {
    text;
    style;

    constructor(pos, text, style) {
        super("text" + entCount, pos, [100, 100], [text, style]);
        this.text = text;
        this.style = style;

        this.ignoreGravity = true;
        this.solid = false;
    }
    
    entType() {
        return "gametext";
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
    }

    SetText(txt) {
        this.text = txt;
        this.SetModel([this.text, this.style]);
    }

    SetStyle(css) {
        this.style = css;
        this.SetModel([this.text, this.style]);
    }
}