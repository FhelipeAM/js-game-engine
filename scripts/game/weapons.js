var weaponTemplate = [];
var friendlyFire = false;


function _RegisterWeapons() {

    new Weapon("DEFAULTMELEE", "melee", 12, 20, 1, Infinity, 0.1, 1, [{
        name: "attack",
        path: [
            "./assets/snd/weapon/Slash1.ogg",
            "./assets/snd/weapon/Slash2.ogg"
        ],
        loop: false,
        vol: 0.6
    },
    {
        name: "reload",
        path: "",
        loop: false,
        vol: 0.2
    }
    ])

    new Weapon("TESTRIFLE", "range", 24, 300, 20, 320, 2.6, 4, [{
        name: "attack",
        path: "./assets/snd/weapon/Gunshot2.ogg",
        loop: false,
        vol: 0.6
    },
    {
        name: "reload",
        path: "./assets/snd/error.mp3",
        loop: false,
        vol: 0.2
    }
    ])
}

function GetWeaponByName(name) {
    let ret = undefined;
    weaponTemplate.forEach((wep) => {
        if (wep.name == name) {
            ret = new wep.constructor();
            Object.assign(ret, wep);
            return;
        }
    })
    if (ret != undefined) {
        return ret;
    } else if (name != "DEFAULTMELEE") {
        return GetWeaponByName("DEFAULTMELEE");
    }
}

class Weapon {
    name;
    type;
    damage;
    sndSet;

    reloading = false;
    
    range;
    ammoCount;
    ammoCountRes;
    
    curAmmoCount;
    curAmmoCountRes;
    
    LFT = 0;
    fireTime;
    reloadTime;

    reloading = false;
    
    constructor(name, type, damage, range, ammoCount, ammoCountRes, fireTime, reloadTime, sndSet) {

        this.name = name;
        this.type = type;
        this.damage = damage;
        this.sndSet = sndSet;

        this.range = range;
        this.ammoCount = ammoCount;
        this.ammoCountRes = ammoCountRes;

        this.curAmmoCount = ammoCount;
        this.curAmmoCountRes = ammoCountRes;

        this.fireTime = fireTime;
        this.reloadTime = reloadTime;

        this.RegisterWeapon();
    }

    Shoot(sset) {
        
        if (this.LFT + (this.fireTime * 10) > timePassed || this.curAmmoCount == 0) return;

        this.LFT = timePassed;
        this.curAmmoCount --;

        let sound = this.GetWepSoundInfo("attack");

        var bullet = new Bullet("bullet" + entCount, sset.CenterOfMass(), [sset.target.CenterOfMass()[0] > sset.CenterOfMass()[0] ? sset.target.CenterOfMass()[0] * this.range : (sset.target.CenterOfMass()[0] * this.range) * -1 , sset.target.CenterOfMass()[1]], 15, sset.team, sound)
        bullet.movespeed = sset.bulletSpeed;
        return bullet;
    }

    async Reload(sset) {
        if (this.curAmmoCountRes <= 0)
            return;

        this.reloading = true;

        PlaySound(this.GetWepSoundInfo("reload"));
        await s(this.reloadTime);
        
        this.curAmmoCountRes = this.curAmmoCountRes - this.curAmmoCount;
        this.curAmmoCount = this.ammoCount - this.curAmmoCount;
        
        this.reloading = false;
    }

    GetWepSoundInfo(name) {

        let fsound = {
            name: "stub",
            sound: "./assets/snd/error.mp3",
            loop: false,
            vol: 0.2
        };

        this.sndSet.forEach((snd) => {
            if (snd.name == name) {
                fsound = snd;
                return;
            }
        })

        return fsound;
    }

    RegisterWeapon() {
        weaponTemplate.push(this);
    }
}

class Bullet extends Entity {
    startTime = 0;
    damage = 0;
    team = "unset";

    constructor(id, startPos, end, dmg, team, sndInfo) {
        super(id, startPos, [50, 50], "./assets/img/testbullet.png");
        this.ignoreGravity = true;
        this.solid = false;

        this.movespeed = 10;
        this.startTime = timePassed;
        this.damage = dmg;
        this.team = team;

        if (sndInfo != undefined)
            PlaySound(sndInfo);

        this.MoveTo(end);

        this._CollListener();

        this.AwaitGoal();
    }

    async AwaitGoal() {
        await this.Goal();

        this.Delete();
    }

    async _CollListener() {

        while (true) {
            if (this.collTarget != undefined && this.collTarget.Damage) {
                if ((this.collTarget.team != this.team || friendlyFire) && this.collTarget.solid) {
                    PlaySound(GetSoundInfo("hit"));
                    this.collTarget.Damage(this.damage)
                    this.Delete();
                    return;
                }
            }
            -
                await ms(tickrate);
        }
    }
}