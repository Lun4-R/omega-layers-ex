class AlephLayer
{
    constructor()
    {
        this.aleph = new Decimal(0);
        this.upgrades = {
            alephGain: new AlephUpgrade("Aleph Power MK.I", level => Decimal.pow(16, level).mul(10),
                level => Decimal.pow(2 + game.restackLayer.permUpgrades.aleph.apply(), level)),
                alephGain2: new AlephUpgrade("Aleph Power MK.II", level => Decimal.pow(320, level).mul(1e10),
                level => Decimal.pow(2.5 + game.restackLayer.permUpgrades.aleph.apply(), level)),
            alephGainBonus: new AlephUpgrade("Aleph Percentance Power MK.I",
                level => Utils.createValueDilation(Decimal.pow(1e6, level).mul(1e6), 0.02),
                level => new Decimal(1).add(level.mul(0.05)).mul(Decimal.pow(1.05, Decimal.max(level.sub(10), 0))), {
                    getEffectDisplay: effectDisplayTemplates.percentStandard(3, "", " %", 0)
                }),
                alephGainBonus2: new AlephUpgrade("Aleph Percentance Power MK.II",
                level => Utils.createValueDilation(Decimal.pow(1e12, level).mul(1e12), 0.02),
                level => new Decimal(1).add(level.mul(0.25)).mul(Decimal.pow(1.05, Decimal.max(level.sub(10), 0))), {
                    getEffectDisplay: effectDisplayTemplates.percentStandard(3, "", " %", 0)
                }),
            alephBoost: new AlephUpgrade("Gain more Aleph based on the log(ℵ) you have",
                level => new Decimal(1e6).pow(Decimal.pow(1.5, level)),
                level => new Decimal(1).add(Decimal.max(0, game.alephLayer.aleph).add(1).log10().mul(level).mul(0.05)).pow(2.5)),
            deltaBoost: new AlephUpgrade("Gain more δ",
                level => Decimal.pow(1e5, level).mul(1e3),
                level => Decimal.pow(50, level), {
                    maxLevel: 16
                }),
            	epsilonBoost: new AlephUpgrade("Gain more ε",
                level => Decimal.pow(1e12, level).mul(1e9),
                level => Decimal.pow(16, level), {
                    maxLevel: 12
                }),
            powerGenerators: new AlephUpgrade("All Power Generators on every Layer are stronger",
                level => Utils.createValueDilation(Decimal.pow(1e5, Decimal.pow(level, 1.5)).mul(1e20), 0.001),
                level => Decimal.pow(1.5, level)),
            prestigeNoPowerBoost: new AlephUpgrade("Increase Prestige Reward on all Layers that don't have Power Generators",
                level => Decimal.pow(1e8, level).mul(1e22),
                level => Decimal.pow(2, level), {
                    maxLevel: 3
                }),
            alephBoost2: new AlephUpgrade("Gain more Aleph based on the log(log(α)) you have",
                level => Utils.createValueDilation(Decimal.pow(1e30, level).mul(1e100), 0.01),
                level => game.layers[0] ? Decimal.pow(new Decimal(1.1).add(level.mul(0.1)), Decimal.max(0, game.layers[0].resource).add(1).log10().add(1).log10()) : new Decimal(1)),
                alephBoost3: new AlephUpgrade("Gain more Aleph based on the log(log(log(α))) you have",
                level => Utils.createValueDilation(Decimal.pow(1e30, level).mul(1e150), 0.01),
                level => game.layers[0] ? Decimal.pow(new Decimal(1.1).add(level.mul(0.1)), Decimal.max(0, game.layers[0].resource).add(1).log10().add(1).log10().add(1).log10()) : new Decimal(1)),
            betterBetaFormula: new AlephUpgrade("The β Prestige Formula is better",
                level => new Decimal(1e90),
                level => new Decimal(1).add(level.mul(0.12)), {
                    maxLevel: 1,
                    getEffectDisplay: effectDisplayTemplates.numberStandard(2, "^")
                }),
            prestigeRewards: new AlephUpgrade("Increase the Prestige Reward of all Layers",
                level => Utils.createValueDilation(Decimal.pow(1e30, level).mul(1e100), 0.005, new Decimal("1e650")),
                level => Decimal.pow(1.6, level)),
            layerExponentialBoost: new AlephUpgrade("Increase the exponential difference of boosts between layers, resulting in a large boost!",
                level => level.lt(6) ? new Decimal([1e100, 1e200, 1e300][level.toNumber()]) : Decimal.dInf,
                level => [22, 25, 27][level.toNumber()], {
                    maxLevel: 2,
                    getEffectDisplay: effectDisplayTemplates.numberStandard(0, "")
                })
        };
    }

    getAlephGain()
    {
        return this.upgrades.alephGain.apply().mul(this.upgrades.alephGainBonus.apply().mul(this.upgrades.alephGain2.apply()).mul(this.upgrades.alephGainBonus2.apply()))
            .mul(this.getAlephBoostFromLayer())
            .mul(this.upgrades.alephBoost.apply())
            .mul(this.upgrades.alephBoost2.apply())
            .mul(this.upgrades.alephBoost3.apply());
    }

    isUnlocked()
    {
        return game.highestLayer >= 3;
    }

    getAlephBoostFromLayer()
    {
        if(functions.maxLayerUnlocked() < 3) return new Decimal(0);
        if(game.layers[3].timesReset === 0) return new Decimal(0);
        return Decimal.pow(10, Math.max(0, functions.maxLayerUnlocked() - 3));
    }

    maxAll()
    {
        for(let k of Object.keys(this.upgrades))
        {
            this.upgrades[k].buyMax();
        }
    }

    tick(dt)
    {
        if(this.isUnlocked())
        {
            this.aleph = this.aleph.add(this.getAlephGain().mul(dt));
        }
    }

    loadFromSave(obj)
    {
        this.aleph = obj.aleph;
        for(let k of Object.getOwnPropertyNames(obj.upgrades))
        {
            if(this.upgrades[k])
            {
                this.upgrades[k].level = obj.upgrades[k].level;
            }
        }
    }
}