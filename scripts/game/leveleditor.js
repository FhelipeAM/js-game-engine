let target = undefined;
let onAction = false;

function _LevelEditorMain() {

    devMode = true;

    loadedLevel = "editor"

    document.addEventListener("contextmenu", (e) => {
        e.preventDefault();
    })

    document.addEventListener("mousedown", (e) => {

        if (onAction)
            return;

        if (!isUtilMenuOpen())
            GetMousePos(e)

        e.preventDefault();

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

    onAction = true;

    if (isUtilMenuOpen()) {
        return;
    }

    let stubEnt = new Entity("mouseCast" + entCount, mousePos, [1, 1], "transparent");
    stubEnt.ignoreGravity = true;
    stubEnt.solid = false;

    _collMain(stubEnt); // Big, huge brain move

    if (stubEnt.collTarget != undefined) {
        target = stubEnt.collTarget;

        _UtilityMenu(target);
    }

    stubEnt.Delete();

}

function _UtilityMenu(selectedEnt) {

    if (isUtilMenuOpen()) {
        let stubUtil = GetEnt("UtilityMenu")
        stubUtil.Delete();
        return;
    }

    const UtilContainer = new GameContainer(
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

    if (selectedEnt == undefined) {

        const CreateEntBtn = new GameButton(
            [0, 0],
            ["80%", "max-content"],
            "Create ent",
            () => {
                _selectEntType();
                UtilContainer.Delete();
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

        UtilContainer.AttachToMe(CreateEntBtn);
    } else {

        const SetEntImg = new GameButton(
            [0, 0],
            ["80%", "max-content"],
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

        const moveToBtn = new GameButton(
            [0, 0],
            ["80%", "max-content"],
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

        UtilContainer.AttachToMe(SetEntImg);
        UtilContainer.AttachToMe(moveToBtn);

    }

    UtilContainer.SetID("UtilityMenu")
    UtilContainer.docRef.style.borderTopLeftRadius = 0;

}

function _CreateSampleEnt(type) {

    switch (type) {
        default:
        case "default":
            let ent = new Entity("Entity" + entCount, mousePos, [100, 100], "");
            break;
        case "weapon":
            let wep = new Entity("Weapon" + entCount, mousePos, [100, 100], "");
            break;
        case "trigger":
            let trig = new Entity("trigger" + entCount, mousePos, [100, 100], "");
            break;
    }

    onAction = false;
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

    const EntTypeWep = new GameButton(
        [0, 0],
        ["80%", "max-content"],
        "Weapon Settings",
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
    EntListContainer.AttachToMe(EntTypeWep);
    EntListContainer.AttachToMe(EntTypeTrigger);

    EntListContainer.SetID("SelectEntType")
    EntListContainer.docRef.style.borderTopLeftRadius = 0;

}

function _MoveEnt(targetEnt) {

    let endPosRef = new Entity("Entity" + entCount, [mousePos[0] + 2, mousePos[1] + 2], [100, 100], ["",
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

        onAction = false;

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
}

function isUtilMenuOpen() {

    let stubUtil = GetEnt("UtilityMenu");

    return stubUtil != undefined;
}