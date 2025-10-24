class GameText extends Entity {
    constructor(pos, text, style) {
        super("text" + entCount, pos, [100, 100], [text, style]);

        this.ignoreGravity = true;
        this.solid = false;
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
}