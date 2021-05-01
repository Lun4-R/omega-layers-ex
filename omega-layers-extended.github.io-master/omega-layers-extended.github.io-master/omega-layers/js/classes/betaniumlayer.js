class BetaniumLayer
{
    constructor()
    {
        this.betanium = new Decimal(0);
        this.upgrades = {
            betaniumGain: new BetaniumUpgrade("Increase your betanium gain", level => Decimal.pow(1.215, level).mul(100),
                level => Decimal.pow(1.2 + game.restackLayer.permUpgrades.betanium.apply(), level)),
            betaniumGainBonus: new BetaniumUpgrade("Get a Bonus to betanium gain",
                level => Utils.createValueDilation(Decimal.pow(1000, level).mul(1000), 0.02),
                level => new Decimal(1).add(level.mul(0.1)).mul(Decimal.pow(1.05, Decimal.max(level.sub(10), 0))), {
                    getEffectDisplay: effectDisplayTemplates.percentStandard(3, "", " %", 0)
                }),
            betaniumBoost: new BetaniumUpgrade("Gain more betanium based on the log(ℵ) you have",
                level => new Decimal(1e6).pow(Decimal.pow(1.5, level)),
                level => new Decimal(1).add(Decimal.max(0, game.Betanium.betanium).add(1).log10().mul(level).mul(0.05)).pow(2.5)),
            deltaBoost: new BetaniumUpgrade("Gain more δ",
                level => Decimal.pow(1e5, level).mul(1e3),
                level => Decimal.pow(10, level), {
                    maxLevel: 4
                }),
            powerGenerators: new BetaniumUpgrade("All Power Generators on every Layer are stronger",
                level => Utils.createValueDilation(Decimal.pow(1e5, Decimal.pow(level, 1.5)).mul(1e20), 0.001),
                level => Decimal.pow(1.5, level)),
            prestigeNoPowerBoost: new BetaniumUpgrade("Increase Prestige Reward on all Layers that don't have Power Generators",
                level => Decimal.pow(1e8, level).mul(1e22),
                level => Decimal.pow(2, level), {
                    maxLevel: 3
                }),
            betaniumBoost2: new BetaniumUpgrade("Gain more betanium based on the log(log(α)) you have",
                level => Utils.createValueDilation(Decimal.pow(1e30, level).mul(1e100), 0.01),
                level => game.layers[0] ? Decimal.pow(new Decimal(1.1).add(level.mul(0.1)), Decimal.max(0, game.layers[0].resource).add(1).log10().add(1).log10()) : new Decimal(1)),
            betterBetaFormula: new BetaniumUpgrade("The β Prestige Formula is better",
                level => new Decimal(1e90),
                level => new Decimal(1).add(level.mul(0.12)), {
                    maxLevel: 1,
                    getEffectDisplay: effectDisplayTemplates.numberStandard(2, "^")
                }),
            prestigeRewards: new BetaniumUpgrade("Increase the Prestige Reward of all Layers",
                level => Utils.createValueDilation(Decimal.pow(1e30, level).mul(1e100), 0.005, new Decimal("1e650")),
                level => Decimal.pow(1.6, level)),
            layerExponentialBoost: new BetaniumUpgrade("Increase the exponential difference of boosts between layers, resulting in a large boost!",
                level => level.lt(2) ? new Decimal([1e125, 1e210][level.toNumber()]) : Decimal.dInf,
                level => [22, 25, 27][level.toNumber()], {
                    maxLevel: 2,
                    getEffectDisplay: effectDisplayTemplates.numberStandard(0, "")
                })
        };
    }

    getBetaniumGain()
    {
        return this.upgrades.betaniumGain.apply().mul(this.upgrades.betaniumGainBonus.apply())
            .mul(this.getBetaniumBoostFromLayer())
            .mul(this.upgrades.betaniumBoost.apply())
            .mul(this.upgrades.betaniumBoost2.apply());
    }

    isUnlocked()
    {
        return game.highestLayer >= 3;
    }

    getBetaniumBoostFromLayer()
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
            this.betanium = this.betanium.add(this.getBetaniumGain().mul(dt));
        }
    }

    loadFromSave(obj)
    {
        this.betanium = obj.betanium;
        for(let k of Object.getOwnPropertyNames(obj.upgrades))
        {
            if(this.upgrades[k])
            {
                this.upgrades[k].level = obj.upgrades[k].level;
            }
        }
    }
}