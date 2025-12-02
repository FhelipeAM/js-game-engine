__editor_mode = true;

let __editor_target = undefined;
let __editor_onAction = false;

let __editor_levelSettings = undefined;

function _LevelEditorMain() {

    window.scrollTo(0, 0);

    hudElem_health.Delete();
    hudElem_ammo.Delete();

    GetEnt("mousetarget").Delete();

    _StartLevelSettings();

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

function _StartLevelSettings() {

    __editor_levelSettings = new GameButton(
        [920, -430],
        [80, 80],
        "",
        () => {
            _LevelSidebar()
        },
        {},
        true
    );

    __editor_levelSettings.SetModel("assets/img/editor/settings.png");
    hudContainer.AttachToMe(__editor_levelSettings);
}

function _LevelSidebar() {

    if (isMenuOpen("EntSideBar")) {
        CloseMenu("EntSideBar");
        __editor_onAction = false;
        return;
    }

    __editor_onAction = true;

    const SettingsContainer = new GameContainer(
        [0, 0],
        [400, "100vh"],
        {
            position: "absolute",
            display: "flex",
            flexDir: "column",
            alignX: "center",
            alignY: "center",
            BGColor: "#ffffff",
            index: 45,
            padding: 15,
            gap: 10,
            border: {
                borderImg: "black",
                borderSize: 1,
                borderStyle: "solid"
            }
        },
        false,
        true
    );
    SettingsContainer.SetID("EntSideBar");

    const LevelSettingsLabel = new GameText([0, 0], ["max-content", "max-content"], "Level settings: ", {
        position: "relative",
        fontSize: 30
    }, true);
    SettingsContainer.AttachToMe(LevelSettingsLabel);

    const LevelSizeLabel = new GameText([0, 0], ["max-content", "max-content"], "Boundaries: \n X: " + GameSafeSpace.right + " Y: " + GameSafeSpace.bottom + "", {
        position: "relative",
        textAlign: "center",
        fontSize: 30
    }, true);
    SettingsContainer.AttachToMe(LevelSizeLabel);

    let stubSize = [GameSafeSpace.right, GameSafeSpace.bottom];

    const LevelSizeChng = new GameButton(
        [0, 0],
        ["80%", 30],
        "Change Size",
        () => {
            var thing = _InputMenu([LevelSizeChng.pos[0] + LevelSizeChng.coll[0], LevelSizeChng.pos[1]],
                () => {
                    SettingsContainer.Delete();
                    SetPlayableAreaSize(stubSize);
                    __editor_onAction = false;
                },
                () => {

                },
                (newVal) => {
                    stubSize = newVal;
                }, ["Width: ", stubSize[0]], ["Height: ", stubSize[1]]);
        },
        {
            display: "flex",
            position: "relative",
            alignX: "center",
            alignY: "center",
            color: "blue",
            fontSize: 20,
            index: 4,
            border: {
                borderImg: "blue",
                borderSize: 1,
                borderStyle: "solid",
                borderRadius: 25
            }
        },
        true
    );
    SettingsContainer.AttachToMe(LevelSizeChng);

    const BGImgChng = new GameButton(
        [0, 0],
        ["80%", 30],
        "Change background image",
        () => {
            LoadFile('image/*', (event) => {
                const file = event.target.files[0];
                if (!file) return;

                const reader = new FileReader();

                reader.onload = function (e) {
                    const image = e.target.result;

                    try {
                        SetGameBackground(image);
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
            SettingsContainer.Delete();
            __editor_onAction = false;
        },
        {
            display: "flex",
            position: "relative",
            alignX: "center",
            alignY: "center",
            color: "blue",
            fontSize: 20,
            index: 4,
            border: {
                borderImg: "blue",
                borderSize: 1,
                borderStyle: "solid",
                borderRadius: 25
            }
        },
        true
    );
    SettingsContainer.AttachToMe(BGImgChng);

    const weaponSectionText = new GameText([0, 0], ["max-content", "max-content"], "Registered weapons: ", {
        position: "relative",
        fontSize: 30
    }, true);
    SettingsContainer.AttachToMe(weaponSectionText);

    const WeaponsContainer = new GameContainer(
        [0, 0],
        ["max-content", "max-content"],
        {
            position: "relative",
            display: "flex",
            flexDir: "column",
            alignX: "center",
            alignY: "center",
            BGColor: "#ffffff",
            padding: 15,
            gap: 10,
            border: {
                borderImg: "black",
                borderSize: 1,
                borderStyle: "solid",
                borderRadius: 10
            }
        },
        false,
        true
    );
    SettingsContainer.AttachToMe(WeaponsContainer);

    _GenerateWeaponList(WeaponsContainer, _VisEntInfo);

    const AddWepBtn = new GameButton(
        [0, 0],
        ["80%", "max-content"],
        "New Weapon",
        () => {
            _VisEntInfo(_CreateSampleEnt("weapon"));
        },
        {
            display: "flex",
            position: "relative",
            alignX: "center",
            alignY: "center",
            color: "green",
            fontSize: 20,
            index: 4,
            border: {
                borderImg: "green",
                borderSize: 1,
                borderStyle: "solid",
                borderRadius: 25
            }
        },
        true
    );

    WeaponsContainer.AttachToMe(AddWepBtn);

    const LoadSaveContainer = new GameContainer(
        [0, 0],
        ["max-content", "max-content"],
        {
            position: "relative",
            display: "flex",
            alignX: "center",
            alignY: "center",
            BGColor: "#ffffff",
            padding: 15,
            gap: 10,
            border: {
                borderImg: "black",
                borderSize: 1,
                borderStyle: "solid",
                borderRadius: 10
            }
        },
        false,
        true
    );

    const SaveLevelBtn = new GameButton(
        [0, 0],
        ["max-content", "max-content"],
        "Save level",
        () => {
            _SaveLevel();
        },
        {
            display: "flex",
            position: "relative",
            alignX: "center",
            alignY: "center",
            color: "green",
            fontSize: 20,
            padding: 5,
            index: 4,
            border: {
                borderImg: "green",
                borderSize: 1,
                borderStyle: "solid",
                borderRadius: 25
            }
        },
        true
    );

    const LoadLevelBtn = new GameButton(
        [0, 0],
        ["max-content", "max-content"],
        "Load level",
        () => {
            _LoadLevelFile();
        },
        {
            display: "flex",
            position: "relative",
            alignX: "center",
            alignY: "center",
            color: "blue",
            fontSize: 20,
            padding: 5,
            index: 4,
            border: {
                borderImg: "blue",
                borderSize: 1,
                borderStyle: "solid",
                borderRadius: 25
            }
        },
        true
    );

    SettingsContainer.AttachToMe(LoadSaveContainer);
    LoadSaveContainer.AttachToMe(SaveLevelBtn);
    LoadSaveContainer.AttachToMe(LoadLevelBtn);
}

function _UtilityMenu(selectedEnt) {

    if (isMenuOpen("UtilityMenu")) {
        CloseMenu("UtilityMenu")
        return;
    }

    const UtilContainer = new GameContainer(
        mousePos,
        [200, "max-content"],
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

        const GetEntInfoBtn = new GameButton(
            [0, 0],
            ["100%", "max-content"],
            "Entity info",
            () => {
                _VisEntInfo(selectedEnt);
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

        var DeleteBtn = undefined;

        if (selectedEnt != player) {
            DeleteBtn = new GameButton(
                [0, 0],
                ["100%", "max-content"],
                "Delete",
                () => {
                    selectedEnt.Delete();
                    UtilContainer.Delete();
                    __editor_onAction = false;
                },
                {
                    display: "flex",
                    position: "relative",
                    alignX: "center",
                    alignY: "center",
                    color: "red",
                    fontSize: 20,
                    border: {
                        borderImg: "red",
                        borderSize: 1,
                        borderStyle: "solid",
                        borderRadius: 25
                    }
                },
                true
            );
        }

        let SetEntImgBtn = undefined;

        if (selectedEnt.entType() != "trigger") {
            SetEntImgBtn = new GameButton(
                [0, 0],
                ["100%", "max-content"],
                "Change image",
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
        }

        let GiveWeaponBtn = undefined;

        if (selectedEnt.entType() == "sentient") {
            GiveWeaponBtn = new GameButton(
                [0, 0],
                ["100%", "max-content"],
                "Give weapon",
                () => {
                    _GiveSentWep(selectedEnt);
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
        }

        UtilContainer.AttachToMe(CloseMenuBtn);
        UtilContainer.AttachToMe(GetEntInfoBtn);
        if (selectedEnt.entType() != "trigger")
            UtilContainer.AttachToMe(SetEntImgBtn);
        if (selectedEnt.entType() == "sentient")
            UtilContainer.AttachToMe(GiveWeaponBtn);
        UtilContainer.AttachToMe(moveToBtn);
        UtilContainer.AttachToMe(SizeBtn);
        if (selectedEnt != player)
            UtilContainer.AttachToMe(DeleteBtn);

    }

    UtilContainer.SetID("UtilityMenu")
    UtilContainer.docRef.style.borderTopLeftRadius = 0;

}

async function _SelectEnt() {

    if (isMenuOpen("UtilityMenu")) {
        return;
    }

    __editor_onAction = true;

    let stubEnt = undefined;
    if (GetEnt("mouseCast") != undefined)
        stubEnt = GetEnt("mouseCast");
    else
        stubEnt = new Entity("mouseCast", mousePos, [1, 1], "transparent");

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

function _GiveSentWep(targetEnt) {

    const WeaponsContainer = new GameContainer(
        [targetEnt.pos[0] + targetEnt.coll[0] + 10, targetEnt.pos[1]],
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

    _GenerateWeaponList(WeaponsContainer, (e) => {
        targetEnt.GiveWeapon(GetWeaponByName(e.name))
        __editor_onAction = false;
        WeaponsContainer.Delete();
    });

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

    let size = targetEnt.coll;

    const updateEntSize = (newSize) => {
        endSizeRef.SetSize(newSize);
        if (SizeTextContainer != null)
            SizeTextContainer.Teleport([endSizeRef.pos[0] + endSizeRef.coll[0] + 10, endSizeRef.pos[1]], true);
    }

    var SizeTextContainer = _InputMenu([endSizeRef.pos[0] + endSizeRef.coll[0] + 10, endSizeRef.pos[1]],
        () => {
            targetEnt.SetSize(size);
            endSizeRef.Delete();

        },
        () => endSizeRef.Delete(),
        (newVal) => {
            size = newVal;
            updateEntSize(size)

        }, ["Width: ", size[0]], ["Height: ", size[1]]);
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

    const EntTypeSentient = new GameButton(
        [0, 0],
        ["80%", "max-content"],
        "Sentient",
        () => {
            _CreateSampleEnt("sentient");
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
    EntListContainer.AttachToMe(EntTypeSentient);
    EntListContainer.AttachToMe(EntTypeTrigger);

    EntListContainer.SetID("SelectEntType")
    EntListContainer.docRef.style.borderTopLeftRadius = 0;

}

function _CreateSampleEnt(type) {

    let res = undefined;

    switch (type) {
        default:
        case "default":
            res = new Entity("Entity" + entCount, mousePos, [100, 100], "");
            break;
        case "weapon":
            res = new Weapon("Weapon" + entCount, "single", 15, 1000, 30, 300, 2.2, 4, 5, [
                {
                    name: "attack",
                    path: "./assets/snd/weapon/Gunshot2.ogg",
                    loop: false,
                    vol: 0.5
                }
            ]);
            break;
        case "sentient":
            res = new Sentient("Sentient" + entCount, mousePos, [100, 100], "", "allies", true);
            break;
        case "trigger":
            res = new Trigger(mousePos, [100, 100], ["once"], () => { }, undefined);
            break;
    }

    if (isMenuOpen("UtilityMenu"))
        CloseMenu("UtilityMenu");

    __editor_onAction = false;

    return res;

}

function _VisEntInfo(targetEnt) {

    if (isMenuOpen("EntSideBar")) {
        CloseMenu("EntSideBar");
    }

    //centralizer and rescaler
    const RootContainer = new GameContainer(
        [0, 0],
        ["100%", "100%"],
        {
            position: "absolute",
            display: "flex",
            alignX: "center",
            alignY: "center",
            BGColor: "#00000033",
            index: 15
        },
        true,
        true
    );
    RootContainer.SetID("EntInfoBox");

    const InfoContainer = new GameContainer(
        [0, 0],
        [300, 400],
        {
            position: "relative",
            display: "flex",
            flexDir: "column",
            alignX: "left",
            alignY: "top",
            BGColor: "#ffffff",
            padding: 15,
            gap: 10,
            index: 16,
            overflow: "scroll",
            border: {
                borderImg: "black",
                borderSize: 1,
                borderStyle: "solid",
                borderRadius: 10
            }
        },
        true,
        false
    );

    const CloseMenuBtn = new GameButton(
        [0, 0],
        [15, "max-content"],
        "X",
        () => {
            RootContainer.Delete();
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

    let EntNameText = undefined;
    let EntIdText = undefined;

    if (targetEnt.entType() == "weapon") {

        EntNameText = new GameText([0, 0], ["max-content", "max-content"], "name: " + targetEnt.name, {
            position: "relative",
        }, true);

    } else {

        EntIdText = new GameText([0, 0], ["max-content", "max-content"], "docRef ID: " + targetEnt.docRef.id, {
            position: "relative",
        }, true);
    }

    const EditNameContainer = new GameContainer(
        [0, 0],
        ["100%", "max-content"],
        {
            position: "relative",
            display: "flex",
            alignX: "left",
            alignY: "center",
            gap: 20,
            index: 17
        },
        true,
        false
    );

    RootContainer.AttachToMe(InfoContainer);
    InfoContainer.AttachToMe(CloseMenuBtn);
    InfoContainer.AttachToMe(EditNameContainer);

    if (targetEnt.entType() != "weapon")
        EditNameContainer.AttachToMe(EntIdText);
    else
        EditNameContainer.AttachToMe(EntNameText);

    if (targetEnt != weaponTemplate.get("DEFAULTMELEE") && targetEnt != player) {

        const EditNameField = new GameButton(
            [0, 0],
            ["max-content", "max-content"],
            "Edit",
            () => {
                if (targetEnt.entType() != "weapon")
                    _EditEntParam(targetEnt, "docRef ID", targetEnt.docRef.id, typeof targetEnt.docRef.id);
                else
                    _EditEntParam(targetEnt, "name", targetEnt.name, typeof targetEnt.name);
            },
            {
                display: "flex",
                position: "relative",
                alignX: "center",
                alignY: "center",
                color: "blue",
                fontSize: 10,
                padding: 5,
                border: {
                    borderImg: "blue",
                    borderSize: 1,
                    borderStyle: "solid",
                    borderRadius: 25
                }
            },
            false
        );

        EditNameContainer.AttachToMe(EditNameField);

    }

    for (const key in targetEnt) {

        let readOnly = false;

        // hard coded because there is no way to dinamically tell
        // which fields are supposed to be not editable.
        // at least that i could think of
        if (key == "name" || key == "docRef" || key == "collTarget" ||
            key == "mdl" || key == "pos" || key == "end" || key == "linkedTo" ||
            key == "linkedToOffset" || key == "shouldFall" || key == "falling" ||
            key == "midAir" || key == "iIgnoreGravity" || key == "interpolating" ||
            key == "dead" || key == "target" || key == "interpos" || key == "reloading" ||
            key == "curAmmoCount" || key == "curAmmoCountRes" || key == "LFT" || key == "coll" ||
            typeof targetEnt[key] == "function") {
            continue;
        }

        if (key == "weapons" || targetEnt == weaponTemplate.get("DEFAULTMELEE") ||
            (targetEnt == player && key == "aiEnabled")) {

            readOnly = true;
        }

        if (Array.isArray(targetEnt[key])) {

            const EntKeyText = new GameText([0, 0], ["max-content", "max-content"], key + ": ", {
                position: "relative",
            }, true);

            const ArrayContainer = new GameContainer(
                [0, 0],
                ["max-content", "max-content"],
                {
                    position: "relative",
                    display: "flex",
                    flexDir: "column",
                    alignX: "left",
                    alignY: "top",
                    BGColor: "#ffffff",
                    padding: 15,
                    gap: 10,
                    border: {
                        borderImg: "black",
                        borderSize: 1,
                        borderStyle: "solid",
                        borderRadius: 10
                    }
                },
                true,
                false
            );
            InfoContainer.AttachToMe(EntKeyText)
            InfoContainer.AttachToMe(ArrayContainer);

            for (const key2 in targetEnt[key]) {

                const EntKeyText = new GameText([0, 0], ["max-content", "max-content"], key2 + ": " + targetEnt[key][key2], {
                    position: "relative",
                }, true);

                ArrayContainer.AttachToMe(EntKeyText);
            }

            continue;

        } else if (key == "weapons") {

            const EntKeyText = new GameText([0, 0], ["max-content", "max-content"], key + ": " + targetEnt[key].name, {
                position: "relative",
            }, true);

            InfoContainer.AttachToMe(EntKeyText);

            continue;
        }

        const KeyContainer = new GameContainer(
            [0, 0],
            ["max-content", "max-content"],
            {
                position: "relative",
                display: "flex",
                alignX: "around",
                alignY: "center",
                BGColor: "#ffffff",
                gap: 10,
                padding: 5,
            },
            true,
            false
        );

        const EntKeyText = new GameText([0, 0], ["max-content", "max-content"], key + ": " + targetEnt[key], {
            position: "relative",
        }, true);

        InfoContainer.AttachToMe(KeyContainer);
        KeyContainer.AttachToMe(EntKeyText);

        if (!readOnly) {
            const EditFieldBtn = new GameButton(
                [0, 0],
                ["max-content", "max-content"],
                "Edit",
                () => {
                    _EditEntParam(targetEnt, key, targetEnt[key], typeof targetEnt[key]);
                },
                {
                    display: "flex",
                    position: "relative",
                    alignX: "center",
                    alignY: "center",
                    color: "blue",
                    fontSize: 10,
                    padding: 5,
                    border: {
                        borderImg: "blue",
                        borderSize: 1,
                        borderStyle: "solid",
                        borderRadius: 25
                    }
                },
                false
            );

            KeyContainer.AttachToMe(EditFieldBtn);

        }
    }
}

function _GenerateWeaponList(hostContainer, action) {

    weaponTemplate.forEach((wep) => {
        const TestBtn = new GameButton(
            [0, 0],
            ["100%", "max-content"],
            wep.name,
            () => {
                action(wep);
            },
            {
                display: "flex",
                position: "relative",
                alignX: "center",
                alignY: "center",
                color: "black",
                fontSize: 20,
                padding: 5,
                border: {
                    borderImg: "black",
                    borderSize: 1,
                    borderStyle: "solid",
                    borderRadius: 25
                }
            },
            false
        );

        hostContainer.AttachToMe(TestBtn);
    })
}

function _EditEntParam(targetEnt, key, curVal, valType) {

    if (isMenuOpen("EditElemParam"))
        return;

    let inputBox = undefined;

    const EditInfoContainer = new GameContainer(
        [0, 0],
        [250, "max-content"],
        {
            position: "relative",
            display: "flex",
            flexDir: "column",
            alignX: "center",
            alignY: "center",
            BGColor: "#ffffff",
            padding: 15,
            gap: 10,
            index: 16,
            overflow: "scroll",
            border: {
                borderImg: "black",
                borderSize: 1,
                borderStyle: "solid",
                borderRadius: 10
            }
        },
        true,
        false
    );

    const InputLabelDFlexContainer = new GameContainer(
        [0, 0],
        ["60%", "max-content"],
        {
            position: "relative",
            display: "flex",
            alignX: "center",
            alignY: "center",
            BGColor: "#ffffff",
            gap: 10
        },
        true,
        false
    );
    EditInfoContainer.AttachToMe(InputLabelDFlexContainer);

    let inputLabel = new GameText([0, 0], ["calc(100% - 20px)", "max-content"], key + ": ",
        {
            display: "flex",
            position: "relative",
            alignX: "center",
            alignY: "center",
            BGColor: "#ffffff",
        },
        true
    );
    InputLabelDFlexContainer.AttachToMe(inputLabel);

    switch (valType) {
        case "boolean":
            inputBox = new GameCheckbox([0, 0], 20, curVal, () => { }, undefined, true)
            InputLabelDFlexContainer.AttachToMe(inputBox);
            break;
        case "number":
        case "string":
            inputBox = new GameInputBox([0, 0], ["calc(100% - 20px)", "max-content"], curVal, valType == "number" ? "number" : "text",
                () => { },
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
            EditInfoContainer.AttachToMe(inputBox);
            break;
        default:
            if (devMode)
                console.warn("Type of value was not supported by the function! value: " + valType);
            return;
    }

    const RootContainer = new GameContainer(
        [0, 0],
        ["100%", "100%"],
        {
            display: "flex",
            position: "absolute",
            BGColor: "#33333333",
            alignX: "center",
            alignY: "center",
            index: 15
        },
        true,
        true
    );
    RootContainer.SetID("EditElemParam");

    RootContainer.AttachToMe(EditInfoContainer);

    const ActionBtnContainer = new GameContainer(
        [0, 0],
        ["100%", "max-content"],
        {
            position: "relative",
            display: "flex",
            alignX: "center",
            alignY: "center",
            gap: 20,
            index: 17
        },
        true,
        false
    );

    const ApplyBtn = new GameButton(
        [0, 0],
        ["50%", "max-content"],
        "Apply",
        () => {

            if (key != "docRef ID") {
                if (valType == "number")
                    targetEnt[key] = Number(inputBox.GetValue());
                else
                    targetEnt[key] = inputBox.GetValue();
            } else {
                targetEnt.docRef.id = inputBox.GetValue();
            }

            RootContainer.Delete();
            CloseMenu("EntInfoBox");
            _VisEntInfo(targetEnt);
        },
        {
            display: "flex",
            position: "relative",
            alignX: "center",
            alignY: "center",
            color: "green",
            fontSize: 20,
            padding: 5,
            border: {
                borderImg: "green",
                borderSize: 1,
                borderStyle: "solid",
                borderRadius: 25
            }
        },
        false
    );

    const CancelBtn = new GameButton(
        [0, 0],
        ["50%", "max-content"],
        "Cancel",
        () => {
            RootContainer.Delete();
        },
        {
            display: "flex",
            position: "relative",
            alignX: "center",
            alignY: "center",
            color: "red",
            fontSize: 20,
            padding: 5,
            border: {
                borderImg: "red",
                borderSize: 1,
                borderStyle: "solid",
                borderRadius: 25
            }
        },
        false
    );

    EditInfoContainer.AttachToMe(ActionBtnContainer);
    ActionBtnContainer.AttachToMe(ApplyBtn);
    ActionBtnContainer.AttachToMe(CancelBtn);

}

// universal input menu creator (valField uses [label, value] parameter)
function _InputMenu(contPos, onConfirm, onCancel, onValChange, ...valField) {

    let valRet = [];

    const DataContainer = new GameContainer(
        contPos,
        [200, "max-content"],
        {
            display: "flex",
            flexDir: "column",
            alignX: "center",
            alignY: "top",
            BGColor: "#ffffff",
            padding: 20,
            index: 51,
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

    const CloseMenuBtn = new GameButton(
        [0, 0],
        [15, "max-content"],
        "X",
        () => {
            DataContainer.Delete();
            onCancel();
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
    DataContainer.AttachToMe(CloseMenuBtn);

    valField.forEach((dat, index) => {

        if (!Array.isArray(dat)) {
            if (devMode)
                console.warn("Invalid field supplied to _InputMenu! fields use ['label', value] format!");
            return;
        }

        let inputBox = undefined;

        let inputLabel = new GameText([0, 0], ["calc(100% - 20px)", "max-content"], dat[0],
            {
                display: "flex",
                position: "relative",
                alignX: "left",
                alignY: "bottom",
                BGColor: "#ffffff",
            },
            true
        );

        switch (typeof dat[1]) {
            case "boolean":
                inputBox = new GameCheckbox([0, 0], 20, dat[1], () => { valRet.splice(index, 1, inputBox.text); onValChange(valRet) }, undefined, true)
                break;
            case "number":
            case "string":
                inputBox = new GameInputBox([0, 0], ["calc(100% - 20px)", "max-content"], dat[1], typeof dat[1] == "number" ? "number" : "text",
                    () => { valRet.splice(index, 1, typeof dat[1] == "number" ? Number(inputBox.text) : inputBox.text); onValChange(valRet) },
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
                break;
            default:
                if (devMode)
                    console.warn("Type of value was not supported by the function! value: " + dat);
                return;
        }

        valRet.push(dat[1]);

        DataContainer.AttachToMe(inputLabel);
        DataContainer.AttachToMe(inputBox);
    });

    const Confirm = new GameButton(
        [0, 0],
        ["max-content", "max-content"],
        "Confirm",
        () => { onConfirm(); DataContainer.Delete(); __editor_onAction = false },
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

    DataContainer.AttachToMe(Confirm);

    return DataContainer;
}

function _SaveLevel() {
    CloseMenu("EntSideBar");
    __editor_levelSettings.Delete();

    if (GetEnt("mouseCast") != undefined) {
        let mouseCast = GetEnt("mouseCast");
        mouseCast.Delete();
    }

    let levelDat = [];

    let levelStub = {
        type: "level",
        keys: {
            size: [GameSafeSpace.right, GameSafeSpace.bottom],
            img: GameArea.style.backgroundImage,
        },
    };

    levelDat.push(levelStub);

    weaponTemplate.forEach((wep) => {

        //hardcoded weapon
        if (wep.name == "DEFAULTMELEE")
            return;

        let stubInfo = {
            type: wep.entType(),
            keys: {}
        }

        let keyStub = {};

        for (const key in wep) {

            if (_LSLisStateVal(key) || typeof wep[key] == "function")
                continue;

            if (key == "docRef") {
                keyStub[key + "ID"] = wep[key].id;
                continue;
            } else if (key == "weapons") {
                keyStub[key + "Name"] = wep[key].name;
                continue;
            }

            keyStub[key] = wep[key];
        }

        stubInfo.keys = keyStub;

        levelDat.push(stubInfo);
    })

    entities.forEach((ent) => {

        if (ent.entType() == "uielem") // cannot create UI elements (not yet at least)
            return;

        let stubInfo = {
            type: ent.entType(),
            keys: {}
        }

        let keyStub = {};

        for (const key in ent) {

            if (_LSLisStateVal(key) || typeof ent[key] == "function")
                continue;

            if (key == "docRef") {
                keyStub[key + "ID"] = ent[key].id;
                continue;
            } else if (key == "weapons") {
                keyStub[key + "Name"] = ent[key].name;
                continue;
            } else if (key == "mdl") {
                // keyStub[key] = CompressImage(ent[key]);
                // continue;
            }

            keyStub[key] = ent[key];
        }

        stubInfo.keys = keyStub;

        levelDat.push(stubInfo);
    })

    let fLevelDat = "loadedLevel = " + JSON.stringify(levelDat) + ";";

    const RootContainer = new GameContainer(
        [0, 0],
        ["100%", "100%"],
        {
            position: "absolute",
            display: "flex",
            alignX: "center",
            alignY: "center",
            BGColor: "#00000099",
            index: 49
        },
        true,
        true
    );
    RootContainer.SetID("EntInfoBox");

    const InfoContainer = new GameContainer(
        [0, 0],
        [300, 400],
        {
            position: "relative",
            display: "flex",
            flexDir: "column",
            alignX: "left",
            alignY: "top",
            BGColor: "#ffffff",
            padding: 15,
            gap: 10,
            index: 16,
            overflow: "scroll",
            border: {
                borderImg: "black",
                borderSize: 1,
                borderStyle: "solid",
                borderRadius: 10
            }
        },
        true,
        false
    );

    const LevelDatImp = new GameInputBox([0, 0], ["calc(100% - 20px)", "max-content"], fLevelDat, "text",
        () => { },
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
    LevelDatImp.docRef.readOnly = true;

    navigator.clipboard.writeText(fLevelDat);

    const QuitEditor = new GameButton(
        [0, 0],
        ["100%", "max-content"],
        "Close",
        () => {
            RootContainer.Delete();
            _StartLevelSettings();
            __editor_onAction = false;
        },
        {
            display: "flex",
            position: "relative",
            alignX: "center",
            alignY: "center",
            color: "blue",
            fontSize: 20,
            index: 4,
            border: {
                borderImg: "blue",
                borderSize: 1,
                borderStyle: "solid",
                borderRadius: 25
            }
        },
        true
    );

    RootContainer.AttachToMe(InfoContainer);
    InfoContainer.AttachToMe(LevelDatImp);
    InfoContainer.AttachToMe(QuitEditor);
}

function _LoadLevelFile() {

    CloseMenu("EntSideBar");

    LoadFile('.js,.javascript,text/javascript', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (e) {
            const scriptContent = e.target.result;

            try {
                _LoadLevel(_GetLevelData(scriptContent));

            } catch (error) {
                console.error('Error executing level script:', error);
                alert("Error loading level script!");
            }
        };

        reader.onerror = function (error) {
            console.error('Error:', error);
        };

        reader.readAsText(file);
    });
}

function _LSLisStateVal(key) {
    return key == "collTarget" || key == "end" || key == "shouldFall" || key == "falling" ||
        key == "midAir" || key == "iIgnoreGravity" || key == "interpolating" ||
        key == "dead" || key == "target" || key == "interpos" || key == "reloading" ||
        key == "curAmmoCount" || key == "curAmmoCountRes" || key == "LFT";
}

function isMenuOpen(menuID) {

    let stubUtil = GetEnt(menuID);

    return stubUtil != undefined;
}

function CloseMenu(menuID) {

    let stubUtil = GetEnt(menuID);

    stubUtil.Delete();
}