class Trigger extends Entity {
    type;
    action;
    ignoreEntTypes;

    constructor(pos, size, type, action, ignoreEntTypes) {
        let styleStub = {};

        if (devMode || __editor_mode) {
            styleStub = {
                border: {
                    borderImg: "red",
                    borderSize: 3,
                    borderStyle: "solid"
                }
            }
        } else {
            styleStub = {
                border: {
                    borderImg: "transparent",
                    borderSize: 0,
                    borderStyle: "solid"
                }
            } 
        }

        super("trigger" + entCount, pos, size, ["", styleStub]);

        if (ignoreEntTypes == undefined) {
            ignoreEntTypes = ["bullet", "uielem", "origin"];
        }

        this.type = type;
        this.ignoreEntTypes = ignoreEntTypes;

        this.solid = false;
        this.ignoreGravity = true;

        if (!Array.isArray(this.type)) {
            if (devMode) {
                console.warn("Invalid definition for trigger type, use ['type', ...parameters].");
                this.type = ["once"];
                _AvailableTriggerTypes();
            }
        }

        this.OverrideAction(action);

        this._DetectCollsion();
    }

    OverrideAction(newAction) {
        this.action = newAction;
    }

    async _DetectCollsion() {

        await ms(1);

        await this.Collide();

        let cancelTrigger = false;

        if (Array.isArray(this.ignoreEntTypes)) {
            this.ignoreEntTypes.forEach((ent) => {
                if (this.collTarget.entType() == ent) {
                    cancelTrigger = true;
                    return;
                }
            })
        }

        if (cancelTrigger) {
            await this._DetectCollsion();
        }

        this.action(this.collTarget);

        if (this.type[0] == "multiple") {

            await s(this.type[1]);
            await this._DetectCollsion();

        } else {
            this.Delete();
            return;
        }
    }

    entType() {
        return "trigger";
    }
}

function _AvailableTriggerTypes() {
    console.warn("Available trigger types:");
    console.warn("['once'] (default trigger type, works only once then cleans itself up)");
    console.warn("['multiple', interval] (used to be able to reactivate the trigger)");
}