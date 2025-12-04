class Origin extends Entity {

    constructor(id, startPos) {
        let styleStub = "";

        if (devMode || __editor_mode) {
            styleStub = "red"
        } else {
            styleStub = "transparent"
        }

        super(id, startPos, [50, 50], styleStub);

        this.ignoreGravity = true;
        this.solid = false;

    }

    entType() {
        return "origin";
    }
}