var weaponTemplate = new Map();
var weapons = [];
var friendlyFire = false;


function _RegisterWeapons() {
    new Weapon("DEFAULTMELEE", "melee", 12, 150, Infinity, 0, 10, 1, 10, [{
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
}

function GetWeaponByName(name) {
    const template = weaponTemplate.get(name);
    if (template) {
        const weapon = Object.assign(Object.create(Object.getPrototypeOf(template)), template);
        weapon.reloading = false;
        weapon.LFT = 0;
        return weapon;
    }
    return weaponTemplate.get("DEFAULTMELEE");
}

class Weapon {
    name;
    type;
    damage;
    sndSet;
    bulletSpeed;

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

    constructor(name, type, damage, range, ammoCount, ammoCountRes, fireTime, reloadTime, bulletSpeed, sndSet) {

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

        this.bulletSpeed = bulletSpeed;

        this.RegisterWeapon();
    }

    Shoot(sset) {

        if (this.LFT + (this.fireTime * 10) > timePassed || this.reloading) return;

        if (this.curAmmoCount == 0) {
            PlaySound(this.GetWepSoundInfo("dryfire"));
            return;
        }

        this.LFT = timePassed;
        
        if (!sset.infiniteAmmo)
            this.curAmmoCount--;

        let sound = this.GetWepSoundInfo("attack");
        
        new Bullet("bullet" + entCount, sset.CenterOfMass(), this.calculateTargetPoint(sset.CenterOfMass(), sset.target.CenterOfMass(), this.range), this.damage, sset.team, this.bulletSpeed, this.range, sound)
    }

    calculateTargetPoint(startPos, targetPos, range) {
        const dx = targetPos[0] - startPos[0];
        const dy = targetPos[1] - startPos[1];
        
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= range) {
            return targetPos;
        }
        
        const scale = range / distance;
        return [
            startPos[0] + dx * scale,
            startPos[1] + dy * scale
        ];
    }
    

    async Reload(sset) {
        if (this.curAmmoCountRes <= 0 || this.reloading || this.curAmmoCount >= this.ammoCount)
            return;

        this.reloading = true;

        PlaySound(this.GetWepSoundInfo("reload"));
        await s(this.reloadTime);

        if (this.curAmmoCountRes > (this.ammoCount - this.curAmmoCount)) {
            this.curAmmoCountRes = this.curAmmoCountRes - (this.ammoCount - this.curAmmoCount);
            this.curAmmoCount = this.curAmmoCount + (this.ammoCount - this.curAmmoCount);
        }
        else {

            this.curAmmoCount = this.curAmmoCount + this.curAmmoCountRes;
            this.curAmmoCountRes = 0;
        } 


        this.reloading = false;
    }

    entType() {
        return "weapon";
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
        weaponTemplate.set(this.name, this);
    }
}

class Bullet extends Entity {
    startTime = 0;
    duration = 0;
    lifeTime = 0;

    damage = 0;
    team = "unset";
    bulletSpeed = 1;

    constructor(id, startPos, end, dmg, team, bulletSpeed, bLifeTime, sndInfo) {
        super(id, startPos, [50, 50], "./assets/img/testbullet.png");
        this.ignoreGravity = true;
        this.solid = false;

        this.movespeed = 10;
        this.startTime = timePassed;
        this.duration = bLifeTime;
        this.lifeTime = this.startTime + this.duration;
        this.damage = dmg;
        this.team = team;

        this.movespeed = bulletSpeed;

        if (sndInfo != undefined)
            PlaySound(sndInfo);

        this.MoveTo(end);

        this._CollListener();

        this._BulletCleanup();
        this._CleanupGoal();
    }

    async _BulletCleanup() {

        while (this.lifeTime > timePassed) {
            await ms(tickrate);
        }

        this.Delete();
    }

    async _CleanupGoal() {
        await this.Goal();

        this.Delete();
    }

    _CanHitTarget() {

        if (this.collTarget == null)
            return false;

        if (this.collTarget.entType() != 'sentient')
            return false;
        
        if (this.collTarget.dead)
            return false;

        if (this.collTarget.team == this.team && !friendlyFire)
            return false;

        return true;
    }

    async _CollListener() {

        while (true) {
            if (this._CanHitTarget()) {
                PlaySound(GetSoundInfo("hit"));
                this.collTarget.Damage(this.damage)
                this.Delete();
                return;
            }
            await ms(tickrate);
        }
    }

    entType() {
        return "bullet";
    }
}