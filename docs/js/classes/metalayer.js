class MetaLayer
{
    constructor()
    {
        this.active = false;
        this.layer = new Decimal(0);
        this.resource = new Decimal(1);

        this.multiplierUpgrades = [
            new MetaDynamicLayerUpgrade("MJ001",
                level => Utils.createValueDilation(level.mul(Decimal.pow(1.1, Decimal.max(0, level.sub(15)))), 0.001).floor(),
                level => new Decimal(1),
                level => Decimal.pow(1.25, level.pow(game.restackLayer.upgradeTreeNames.resourceMultipliersLevelScaling.apply())).pow(this.getResourceMultiplierBoost())),
            new MetaDynamicLayerUpgrade("MJ004",
                level => Utils.createValueDilation(level.mul(3).mul(Decimal.pow(1.1, Decimal.max(0, level.sub(15)))), 0.001).floor().add(10),
                level => new Decimal(1),
                level => Decimal.pow(1.5, level.pow(game.restackLayer.upgradeTreeNames.resourceMultipliersLevelScaling.apply())).pow(this.getResourceMultiplierBoost())),
            new MetaDynamicLayerUpgrade("MJ016",
                level => Utils.createValueDilation(level.mul(12).mul(Decimal.pow(1.1, Decimal.max(0, level.sub(15)))), 0.001).floor().add(47),
                level => new Decimal(1),
                level => Decimal.pow(2, level.pow(game.restackLayer.upgradeTreeNames.resourceMultipliersLevelScaling.apply())).pow(this.getResourceMultiplierBoost())),
            new MetaDynamicLayerUpgrade("MJ128",
                level => Utils.createValueDilation(level.mul(48).mul(Decimal.pow(1.1, Decimal.max(0, level.sub(15)))), 0.001).floor().add(143),
                level => new Decimal(1),
                level => Decimal.pow(4, level.pow(game.restackLayer.upgradeTreeNames.resourceMultipliersLevelScaling.apply())).pow(this.getResourceMultiplierBoost())),
                new MetaDynamicLayerUpgrade("1MJ001",
                level => Utils.createValueDilation(level.mul(192).mul(Decimal.pow(1.1, Decimal.max(0, level.sub(15)))), 0.001).floor().add(1000),
                level => new Decimal(1),
                level => Decimal.pow(8, level.pow(game.restackLayer.upgradeTreeNames.resourceMultipliersLevelScaling.apply())).pow(this.getResourceMultiplierBoost())),
            new MetaDynamicLayerUpgrade("1MJ004",
                level => Utils.createValueDilation(level.mul(768).mul(Decimal.pow(1.1, Decimal.max(0, level.sub(15)))), 0.001).floor().add(10000),
                level => new Decimal(1),
                level => Decimal.pow(16, level.pow(game.restackLayer.upgradeTreeNames.resourceMultipliersLevelScaling.apply())).pow(this.getResourceMultiplierBoost())),
            new MetaDynamicLayerUpgrade("1MJ016",
                level => Utils.createValueDilation(level.mul(3072).mul(Decimal.pow(1.1, Decimal.max(0, level.sub(15)))), 0.001).floor().add(47000),
                level => new Decimal(1),
                level => Decimal.pow(32, level.pow(game.restackLayer.upgradeTreeNames.resourceMultipliersLevelScaling.apply())).pow(this.getResourceMultiplierBoost())),
            new MetaDynamicLayerUpgrade("1MJ128",
                level => Utils.createValueDilation(level.mul(12288).mul(Decimal.pow(1.1, Decimal.max(0, level.sub(15)))), 0.001).floor().add(143000),
                level => new Decimal(1),
                level => Decimal.pow(64, level.pow(game.restackLayer.upgradeTreeNames.resourceMultipliersLevelScaling.apply())).pow(this.getResourceMultiplierBoost()))
        ];

        this.powerUpgrades = [
            new MetaDynamicLayerUpgrade("Rv101",
                level => Utils.createValueDilation(level.mul(250).mul(Decimal.pow(1.4, Decimal.max(0, level.sub(5)))), 0.001).floor().add(1000),
                level => new Decimal(1),
                level => Decimal.pow(1.6, level).pow(this.getResourcePowererBoost()).mul(game.restackLayer.upgradeTreeNames.resourcePowerersStrength.apply()), {
                    getEffectDisplay: effectDisplayTemplates.numberStandard(2, "^")
                }),
            new MetaDynamicLayerUpgrade("Rv102",
                level => Utils.createValueDilation(level.mul(5000).mul(Decimal.pow(2, Decimal.max(0, level.sub(5)))), 0.001).floor().add(10000),
                level => new Decimal(1),
                level => Decimal.pow(1.3, level).pow(this.getResourcePowererBoost()).mul(game.restackLayer.upgradeTreeNames.resourcePowerersStrength.apply()), {
                    getEffectDisplay: effectDisplayTemplates.numberStandard(2, "^")
                }),
            new MetaDynamicLayerUpgrade("Rv103",
                level => Utils.createValueDilation(level.mul(1e6).mul(Decimal.pow(5, Decimal.max(0, level.sub(3)))), 0.001).floor().add(1e6),
                level => new Decimal(1),
                level => Decimal.pow(1.15, level).pow(this.getResourcePowererBoost()).mul(game.restackLayer.upgradeTreeNames.resourcePowerersStrength.apply()), {
                    getEffectDisplay: effectDisplayTemplates.numberStandard(2, "^")
                }),
            new MetaDynamicLayerUpgrade("Rv104",
                level => Utils.createValueDilation(level.mul(2e12).mul(Decimal.pow(10, Decimal.max(0, level.sub(1)))), 0.001).floor().add(1e12),
                level => new Decimal(1),
                level => Decimal.pow(1.15, level).pow(this.getResourcePowererBoost()).mul(game.restackLayer.upgradeTreeNames.resourcePowerersStrength.apply()), {
                    getEffectDisplay: effectDisplayTemplates.numberStandard(2, "^")
                }),
                new MetaDynamicLayerUpgrade("2Rv101",
                level => Utils.createValueDilation(level.mul(2e60).mul(Decimal.pow(100, Decimal.max(0, level.sub(5)))), 0.001).floor().add(1e40),
                level => new Decimal(1),
                level => Decimal.pow(1.8, level).pow(this.getResourcePowererBoost()).mul(game.restackLayer.upgradeTreeNames.resourcePowerersStrength.apply()), {
                    getEffectDisplay: effectDisplayTemplates.numberStandard(2, "^")
                }),
            new MetaDynamicLayerUpgrade("2Rv102",
                level => Utils.createValueDilation(level.mul(5e150).mul(Decimal.pow(2000, Decimal.max(0, level.sub(5)))), 0.001).floor().add(1e80),
                level => new Decimal(1),
                level => Decimal.pow(1.4, level).pow(this.getResourcePowererBoost()).mul(game.restackLayer.upgradeTreeNames.resourcePowerersStrength.apply()), {
                    getEffectDisplay: effectDisplayTemplates.numberStandard(2, "^")
                }),
            new MetaDynamicLayerUpgrade("2Rv103",
                level => Utils.createValueDilation(level.mul(1e250).mul(Decimal.pow(5000, Decimal.max(0, level.sub(3)))), 0.001).floor().add(1e160),
                level => new Decimal(1),
                level => Decimal.pow(1.2, level).pow(this.getResourcePowererBoost()).mul(game.restackLayer.upgradeTreeNames.resourcePowerersStrength.apply()), {
                    getEffectDisplay: effectDisplayTemplates.numberStandard(2, "^")
                }),
            new MetaDynamicLayerUpgrade("2Rv104",
                level => Utils.createValueDilation(level.mul(2e300).mul(Decimal.pow(100000, Decimal.max(0, level.sub(1)))), 0.001).floor().add(1e300),
                level => new Decimal(1),
                level => Decimal.pow(1.1, level).pow(this.getResourcePowererBoost()).mul(game.restackLayer.upgradeTreeNames.resourcePowerersStrength.apply()), {
                    getEffectDisplay: effectDisplayTemplates.numberStandard(2, "^")
                })
        ];
    }

    getMultiPS()
    {
        let multi = new Decimal(1);
        for(let upg of this.multiplierUpgrades)
        {
            multi = multi.mul(upg.apply());
        }
        for(let upg of this.powerUpgrades)
        {
            multi = multi.pow(upg.apply());
        }
        return new Decimal(game.restackLayer.metaUpgrade.apply()).mul(multi).pow(game.restackLayer.upgradeTreeNames.resourceMultiplier.apply());
    }

    getLayersPS()
    {
        return this.getMultiPS().log10().div(PrestigeLayer.getPrestigeCarryOverForLayer(this.layer));
    }

    getResourceMultiplierBoost()
    {
        return game.restackLayer.upgradeTreeNames.resourceMultiplierUpgrades.apply()
            .mul(game.restackLayer.upgradeTreeNames.resourceMultiplierUpgradesTime.apply())
            .mul(game.restackLayer.upgradeTreeNames.resourceMultiplierUpgrades2.apply());
    }

    getResourcePowererBoost()
    {
        return game.restackLayer.upgradeTreeNames.resourcePowerersUpgrades.apply();
    }

    getApproxAlpha()
    {
        if(this.layer.gt(1e6))
        {
            let carryOver = PrestigeLayer.getPrestigeCarryOverForLayer(this.layer);
            return Decimal.pow(10, Decimal.pow(carryOver, Decimal.max(0, this.layer)));
        }
        let log = new Decimal(1);
        for(let i = 0; i < Math.min(10, this.layer); i++)
        {
            log = log.mul(PrestigeLayer.getPrestigeCarryOverForLayer(i));
        }
        let carryOver = PrestigeLayer.getPrestigeCarryOverForLayer(this.layer);
        let fract = ((carryOver - 1) * this.resource.log10().div(carryOver - 1)) + (1);
        return Decimal.pow(10, Decimal.pow(carryOver, Decimal.max(0, this.layer.sub(10))).mul(log).mul(fract));
    }

    maxAll()
    {
        for(let u of this.powerUpgrades.concat(this.multiplierUpgrades))
        {
            u.buyMax();
        }
    }

    tick(dt)
    {
        if(this.active)
        {
            if(this.getLayersPS().lt(10))
            {
                this.resource = this.resource.mul(Decimal.pow(this.getMultiPS(), dt));
                if(this.resource.log10().gte(PrestigeLayer.getPrestigeCarryOverForLayer(this.layer.toNumber())))
                {
                    let layerAmnt = this.layer.gt(10) ? this.resource.log(Decimal.pow(10, PrestigeLayer.getPrestigeCarryOverForLayer(10))).floor() : 1;
                    this.resource = this.resource.div(Decimal.pow(10, PrestigeLayer.getPrestigeCarryOverForLayer(this.layer.toNumber())).pow(layerAmnt));
                    this.layer = this.layer.add(layerAmnt);
                }
            }
            else
            {
                this.resource = new Decimal(1);
                this.layer = this.layer.add(this.getLayersPS().mul(dt));
            }
        }
    }

    load(obj)
    {
        this.active = obj.active;
        this.layer = obj.layer;
        this.resource = obj.resource;
        for(let i = 0; i < obj.multiplierUpgrades.length; i++)
        {
            this.multiplierUpgrades[i].level = obj.multiplierUpgrades[i].level;
        }
        for(let i = 0; i < obj.powerUpgrades.length; i++)
        {
            this.powerUpgrades[i].level = obj.powerUpgrades[i].level;
        }
    }
}