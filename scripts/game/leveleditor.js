let __editor_target = undefined;
let __editor_onAction = false;

function _LevelEditorMain() {

    devMode = true;

    loadedLevel = "editor"

    document.addEventListener("contextmenu", (e) => {
        e.preventDefault();
    })

    document.addEventListener("mousedown", (e) => {

        if (__editor_onAction)
            return;

        if (!isMenuOpen("UtilityMenu"))
            GetMousePos(e)

        switch (e.button) {
            case 0:
                _SelectEnt();
                break;
            case 1:
                break;
            case 2:
                _UtilityMenu(undefined);
                break;
            default:
                ""
        }
    })
}

async function _SelectEnt() {

    if (isMenuOpen("UtilityMenu")) {
        return;
    }

    __editor_onAction = true;

    let stubEnt = new Entity("mouseCast" + entCount, mousePos, [1, 1], "transparent");
    stubEnt.ignoreGravity = true;
    stubEnt.solid = false;

    _collMain(stubEnt); // Big, huge brain move

    if (stubEnt.collTarget != undefined) {
        __editor_target = stubEnt.collTarget;

        _UtilityMenu(__editor_target);
    } else {
        __editor_onAction = false;
    }

    stubEnt.Delete();

}

function _UtilityMenu(selectedEnt) {

    if (isMenuOpen("UtilityMenu")) {
        let stubUtil = GetEnt("UtilityMenu")
        stubUtil.Delete();
        return;
    }

    const UtilContainer = new GameContainer(
        mousePos,
        [200, 200],
        {
            display: "flex",
            flexDir: "column",
            alignX: "center",
            alignY: "top",
            BGColor: "#ffffff",
            padding: 20,
            index: 15,
            gap: 10,
            border: {
                borderImg: "black",
                borderSize: 1,
                borderStyle: "solid",
                borderRadius: 25
            }
        },
        false,
        true
    );

    //________________________________CREATE ENTITY_________________________
    if (selectedEnt == undefined) {

        const CreateEntBtn = new GameButton(
            [0, 0],
            ["100%", "max-content"],
            "Create new entity",
            () => {
                _selectEntType();
            },
            {
                display: "flex",
                position: "relative",
                alignX: "center",
                alignY: "center",
                color: "black",
                fontSize: 20,
                border: {
                    borderImg: "black",
                    borderSize: 1,
                    borderStyle: "solid",
                    borderRadius: 25
                }
            },
            true
        );

        UtilContainer.AttachToMe(CreateEntBtn);

        //__________________________________EDIT ENTITY_________________________
    } else {

        const CloseMenuBtn = new GameButton(
            [0, 0],
            [15, "max-content"],
            "X",
            () => {
                UtilContainer.Delete();
                // isMenuOpen("EntSizeEditor") ? GetEnt("EntSizeEditor").Delete() : "" 
                __editor_onAction = false;
            },
            {
                display: "flex",
                position: "relative",
                alignX: "center",
                alignY: "center",
                color: "red",
                fontSize: 15,
                padding: 5,
                border: {
                    borderImg: "red",
                    borderSize: 1,
                    borderStyle: "solid",
                    borderRadius: "50%"
                }
            },
            true
        );

        const SetEntImgBtn = new GameButton(
            [0, 0],
            ["100%", "max-content"],
            "Set ent image",
            () => {
                _SetEntImage(selectedEnt);
                UtilContainer.Delete();
            },
            {
                display: "flex",
                position: "relative",
                alignX: "center",
                alignY: "center",
                color: "black",
                fontSize: 20,
                border: {
                    borderImg: "black",
                    borderSize: 1,
                    borderStyle: "solid",
                    borderRadius: 25
                }
            },
            true
        );

        const moveToBtn = new GameButton(
            [0, 0],
            ["100%", "max-content"],
            "Move to",
            () => {
                _MoveEnt(selectedEnt);
                UtilContainer.Delete();
            },
            {
                display: "flex",
                position: "relative",
                alignX: "center",
                alignY: "center",
                color: "black",
                fontSize: 20,
                border: {
                    borderImg: "black",
                    borderSize: 1,
                    borderStyle: "solid",
                    borderRadius: 25
                }
            },
            true
        );

        const SizeBtn = new GameButton(
            [0, 0],
            ["100%", "max-content"],
            "Change shape",
            () => {
                _SizeEnt(selectedEnt);
                UtilContainer.Delete();
            },
            {
                display: "flex",
                position: "relative",
                alignX: "center",
                alignY: "center",
                color: "black",
                fontSize: 20,
                border: {
                    borderImg: "black",
                    borderSize: 1,
                    borderStyle: "solid",
                    borderRadius: 25
                }
            },
            true
        );

        UtilContainer.AttachToMe(CloseMenuBtn);
        UtilContainer.AttachToMe(SetEntImgBtn);
        UtilContainer.AttachToMe(moveToBtn);
        UtilContainer.AttachToMe(SizeBtn);

    }

    UtilContainer.SetID("UtilityMenu")
    UtilContainer.docRef.style.borderTopLeftRadius = 0;

}

function _SizeEnt(targetEnt) {

    let endSizeRef = new Entity("Entity" + entCount, targetEnt.pos, targetEnt.coll, ["",
        {
            index: 4,
            border: {
                borderImg: "red",
                borderSize: 1,
                borderStyle: "solid",
                borderRadius: 0
            }
        }
    ]);

    const SizeTextContainer = new GameContainer(
        [endSizeRef.pos[0] + endSizeRef.coll[0] + 10, endSizeRef.pos[1]],
        [200, "max-content"],
        {
            display: "flex",
            flexDir: "column",
            alignX: "center",
            alignY: "top",
            BGColor: "#ffffff",
            padding: 20,
            index: 11,
            gap: 10,
            border: {
                borderImg: "black",
                borderSize: 1,
                borderStyle: "solid",
                borderRadius: 25
            }
        },
        false,
        true
    );

    SizeTextContainer.SetID("EntSizeEditor")
    SizeTextContainer.onDelete = () => {
        endSizeRef.Delete();
    };

    const Width = new GameInputBox([0, 0], ["calc(100% - 20px)", "max-content"], targetEnt.coll[0] + UOS,
        () => {
            updateEntSize([Width.text, Height.text])
        },
        {
            position: "relative",
            display: "flex",
            alignX: "left",
            alignY: "center",
            BGColor: "#ffffff",
            index: 5,
            padding: 10,
            border:
            {
                borderImg: "black",
                borderSize: 1,
                borderStyle: "solid",
                borderRadius: 25
            }
        },
        false
    );

    const Height = new GameInputBox([0, 0], ["calc(100% - 20px)", "max-content"], targetEnt.coll[1] + UOS,
        () => {
            updateEntSize([Width.text, Height.text])
        },
        {
            display: "flex",
            position: "relative",
            alignX: "left",
            alignY: "center",
            BGColor: "#ffffff",
            index: 5,
            padding: 10,
            border:
            {
                borderImg: "black",
                borderSize: 1,
                borderStyle: "solid",
                borderRadius: 25
            }
        },
        false
    );

    const Confirm = new GameButton(
        [0, 0],
        ["max-content", "max-content"],
        "Confirm",
        () => {
            targetEnt.SetSize(endSizeRef.coll)
            SizeTextContainer.Delete();
            __editor_onAction = false;
        },
        {
            display: "flex",
            position: "relative",
            alignX: "left",
            alignY: "top",
            color: "green",
            padding: 5,
            border: {
                borderImg: "green",
                borderSize: 3,
                borderStyle: "solid",
                borderRadius: 10
            },
            fontSize: 20
        },
        true
    );

    SizeTextContainer.AttachToMe(Width);
    SizeTextContainer.AttachToMe(Height);
    SizeTextContainer.AttachToMe(Confirm);

    const updateEntSize = (newSize) => {
        cl(newSize)
        endSizeRef.SetSize(newSize);
        SizeTextContainer.Teleport([endSizeRef.pos[0] + endSizeRef.coll[0] + 10, endSizeRef.pos[1]], true);
    }
}

function _MoveEnt(targetEnt) {

    let endPosRef = new Entity("Entity" + entCount, mousePos, targetEnt.coll, ["",
        {
            border: {
                borderImg: "red",
                borderSize: 1,
                borderStyle: "solid",
                borderRadius: 0
            }
        }
    ]);

    const updateEntPos = (e) => {
        GetMousePos(e)
        endPosRef.Teleport(mousePos, true);
    }

    const placeEnt = () => {

        document.removeEventListener("mousemove", updateEntPos);

        targetEnt.Teleport(mousePos, true);
        endPosRef.Delete();

        __editor_onAction = false;

        document.removeEventListener("click", placeEnt);

    }

    document.addEventListener("mousemove", updateEntPos)

    setTimeout(() => {
        document.addEventListener("click", placeEnt)
    }, tickrate);
}

function _SetEntImage(targetEnt) {

    LoadFile('image/*', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (e) {
            const image = e.target.result;

            cl(image)

            try {
                targetEnt.SetModel(image);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        reader.readAsDataURL(file);

        reader.onerror = function (error) {
            console.error('Error:', error);
        };

        reader.readAsText(file);
    });

    __editor_onAction = false;
}

function _selectEntType() {

    const EntListContainer = new GameContainer(
        mousePos,
        [300, 300],
        {
            display: "flex",
            flexDir: "column",
            alignX: "center",
            alignY: "center",
            BGColor: "#ffffff",
            index: 45,
            gap: 10,
            border: {
                borderImg: "black",
                borderSize: 1,
                borderStyle: "solid",
                borderRadius: 25
            }
        },
        false,
        true
    );

    const EntTypeDef = new GameButton(
        [0, 0],
        ["80%", "max-content"],
        "Default",
        () => {
            _CreateSampleEnt("default");
            EntListContainer.Delete();
        },
        {
            display: "flex",
            position: "relative",
            alignX: "center",
            alignY: "center",
            color: "black",
            fontSize: 20,
            index: 4,
            border: {
                borderImg: "black",
                borderSize: 1,
                borderStyle: "solid",
                borderRadius: 25
            }
        },
        true
    );

    // const EntTypeWep = new GameButton(
    //     [0, 0],
    //     ["80%", "max-content"],
    //     "Weapon Settings",
    //     () => {
    //         _CreateSampleEnt("weapon");
    //         EntListContainer.Delete();
    //     },
    //     {
    //         display: "flex",
    //         position: "relative",
    //         alignX: "center",
    //         alignY: "center",
    //         color: "black",
    //         fontSize: 20,
    //         index: 4,
    //         border: {
    //             borderImg: "black",
    //             borderSize: 1,
    //             borderStyle: "solid",
    //             borderRadius: 25
    //         }
    //     },
    //     true
    // );

    const EntTypeTrigger = new GameButton(
        [0, 0],
        ["80%", "max-content"],
        "Trigger",
        () => {
            _CreateSampleEnt("trigger");
            EntListContainer.Delete();
        },
        {
            display: "flex",
            position: "relative",
            alignX: "center",
            alignY: "center",
            color: "black",
            fontSize: 20,
            index: 4,
            border: {
                borderImg: "black",
                borderSize: 1,
                borderStyle: "solid",
                borderRadius: 25
            }
        },
        true
    );

    EntListContainer.AttachToMe(EntTypeDef);
    // EntListContainer.AttachToMe(EntTypeWep);
    EntListContainer.AttachToMe(EntTypeTrigger);

    EntListContainer.SetID("SelectEntType")
    EntListContainer.docRef.style.borderTopLeftRadius = 0;

}

function _CreateSampleEnt(type) {

    res = undefined;

    switch (type) {
        default:
        case "default":
            res = new Entity("Entity" + entCount, mousePos, [100, 100], "");
            break;
        // case "weapon":
        //     res = new Weapon("Weapon" + entCount, "single", 15, 1000, 30, 300, 2.2, 4, 5, [
        //         {
        //             name: "attack",
        //             path: "./assets/snd/weapon/Gunshot2.ogg",
        //             loop: false,
        //             vol: 0.5
        //         }
        //     ]);
        //     break;
        case "trigger":
            res = new Trigger(mousePos, [100, 100], ["once"], () => { }, undefined);
            break;
    }

    GetEnt("UtilityMenu").Delete();
    __editor_onAction = false;

}

function isMenuOpen(menuID) {

    let stubUtil = GetEnt(menuID);

    return stubUtil != undefined;
}