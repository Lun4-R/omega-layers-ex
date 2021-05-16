class ReStackLayer
{
    constructor()
    {
        this.layerCoins = new Decimal(0);
        this.timeSpent = 0;
        this.timesReset = 0;
        this.permUpgrades = {
            prestigeGains: new RestackLayerUpgrade("All Prestige gains are higher", level => Decimal.pow(128, level),
                level => Decimal.pow(128, level), {
                    maxLevel: 100
                }),
            layerExponentialBoostFactorTime: new RestackLayerUpgrade("The Layer Exponential Factor increases over time",
                level => this.getPermUpgradeCost(),
                level => Math.min(1, this.timeSpent / 28800) * 2 * level.toNumber(), {
                    maxLevel: 1,
                    getEffectDisplay: effectDisplayTemplates.numberStandard(4, "+")
                }),
            upgradeEffects: new RestackLayerUpgrade("All Upgrade Effects are stronger (including Tree Upgrades)", level => Decimal.pow(1280, level),
                level => new Decimal(1).add(level.mul(1)), {
                    maxLevel: 4,
                    getEffectDisplay: effectDisplayTemplates.numberStandard(2, "^")
                }),
            powerGenerators: new RestackLayerUpgrade("All Power Generators are stronger",
                level => this.getPermUpgradeCost(),
                level => new Decimal(1).add(level.mul(0.15)), {
                    maxLevel: 1,
                    getEffectDisplay: effectDisplayTemplates.numberStandard(2, "^")
                }),
            aleph: new RestackLayerUpgrade("\"Increase your Aleph gain\" Upgrade scales better",
                level => this.getPermUpgradeCost(),
                level => 0.005 * level.toNumber(), {
                    maxLevel: 1,
                    getEffectDisplay: effectDisplayTemplates.numberStandard(3, "+")
                }),
            layerExponentialBoostFactor: new RestackLayerUpgrade("The Layer Exponential Factor is higher",
                level => this.getPermUpgradeCost(),
                level => level.toNumber(), {
                    maxLevel: 1,
                    getEffectDisplay: effectDisplayTemplates.numberStandard(0, "+")
                })
        };
        this.metaUpgrade = new RestackLayerUpgrade("All your Layer Resources are multiplied each second", level => Decimal.pow(1.215, level),
        level => Decimal.pow(10000, level),
        level => Decimal.mul(100),
            level => 1 + 0.2 * level.toNumber(),{
                maxLevel: 10000
            });
            
        this.upgradeTree = [
            [
                new RestackLayerUpgrade("Increase the Resource Multiplier", level => Decimal.pow(4e20, level),
                    level => Decimal.pow(1.2, level), {
                        maxLevel: 800,
                        getEffectDisplay: effectDisplayTemplates.numberStandard(2, "^")
                    })
            ],
            [
                new RestackLayerUpgrade("Resource Multipliers are stronger", level => Decimal.pow("4e2000", level),
                    level => Decimal.pow(1.1, level),{
                        getEffectDisplay: effectDisplayTemplates.numberStandard(4, "^")
                    }),
                new RestackLayerUpgrade("Resource Multiplier Upgrades are stronger based on time spent this ReStack",  level => Decimal.pow("4ee100000", level),
                level => new Decimal(1).add(Decimal.pow(4, level).sub(1).mul(this.timeSpent / 1)),{

                        getEffectDisplay: effectDisplayTemplates.numberStandard(2, "^")
                    })
            ],
            [
                new RestackLayerUpgrade("Unlock Resource Powerers",
                    level => new Decimal(1e150),
                    level => level.gt(0), {
                        maxLevel: 1,
                        getEffectDisplay: function()
                        {
                            return this.level.gt(0) ? "Unlocked" : "Locked";
                        }
                    })
            ],
            [
                new RestackLayerUpgrade("Resource Powerers are stronger",
                    level => new Decimal("1e2000"),
                    level => new Decimal(1).add(level.mul(0.1)), {
                        maxLevel: 1,
                        getEffectDisplay: effectDisplayTemplates.numberStandard(2, "^")
                    }),
                new RestackLayerUpgrade("Resource Multipliers are stronger",
                    level => new Decimal("1e1500"),
                    level => new Decimal(1).add(level.mul(3)), {
                        maxLevel: 1,
                        getEffectDisplay: effectDisplayTemplates.numberStandard(2, "^")
                    })
            ],
            [
                new RestackLayerUpgrade("Your Layer gets substracted instead of reset when buying Upgrades",
                    level => new Decimal("1e10000"),
                    level => level.gt(0), {
                        maxLevel: 1,
                        getEffectDisplay: function()
                        {
                            return this.level.gt(0) ? "Unlocked" : "Locked";
                        }
                    })
            ],
            [
                new RestackLayerUpgrade("Resource Powerers are stronger", level => Decimal.pow("4e2000", level),
                level => Decimal.pow(1.5, level), {
                    }),
                new RestackLayerUpgrade("Resource Multipliers scale better to their level",
                    level => new Decimal.pow("1ee10"),
                    level => new Decimal(1).add(level.mul(0.15)), {
                        maxLevel: 1,
                        getEffectDisplay: effectDisplayTemplates.numberStandard(2, "^")
                    }),
            ],
        ];
        this.upgradeTree[1][0].setRequirements([this.upgradeTree[0][0]], [this.upgradeTree[1][1]]);
        this.upgradeTree[1][1].setRequirements([this.upgradeTree[0][0]], [this.upgradeTree[1][0]]);
        this.upgradeTree[2][0].setRequirements([this.upgradeTree[1][0], this.upgradeTree[1][1]], []);
        this.upgradeTree[3][0].setRequirements([this.upgradeTree[2][0]], [this.upgradeTree[3][1]]);
        this.upgradeTree[3][1].setRequirements([this.upgradeTree[2][0]], [this.upgradeTree[3][0]]);
        this.upgradeTree[4][0].setRequirements([this.upgradeTree[3][0], this.upgradeTree[3][1]], []);
        this.upgradeTree[5][0].setRequirements([this.upgradeTree[4][0]], [this.upgradeTree[5][1]]);
        this.upgradeTree[5][1].setRequirements([this.upgradeTree[4][0]], [this.upgradeTree[5][0]]);
        this.upgradeTreeNames = {
            resourceMultiplier: this.upgradeTree[0][0],
            resourceMultiplierUpgrades: this.upgradeTree[1][0],
            resourceMultiplierUpgradesTime: this.upgradeTree[1][1],
            unlockResourcePowerers: this.upgradeTree[2][0],
            resourceMultiplierUpgrades2: this.upgradeTree[3][1],
            resourcePowerersUpgrades: this.upgradeTree[3][0],
            substractLayers: this.upgradeTree[4][0],
            resourcePowerersStrength: this.upgradeTree[5][0],
            resourceMultipliersLevelScaling: this.upgradeTree[5][1]
        };
    }

    isUnlocked()
    {
        return game.highestLayer >= 3;
    }

    getPermUpgradeCost()
    {
        return Decimal.pow(100, Object.values(this.permUpgrades).filter(u => u.level.gt(0)).length).floor();
    }

    getRestackGain()
    {
        let l = game.metaLayer.active ? game.metaLayer.layer : new Decimal(game.layers.length - 1);
        return l >= 0 ? Decimal.pow(25, l.sub(0).floor()) : new Decimal(0);
    }

    allPermUpgradesBought()
    {
        return Object.values(this.permUpgrades).filter(u => u.level.eq(0)).length === 0;
    }

    respecPermUpgrades()
    {
        if(game.settings.confirmations && (!confirm("Are you sure you want to respec?") || this.allPermUpgradesBought()))
        {
            return;
        }
        this.restack(false);
        for(let k of Object.keys(this.permUpgrades))
        {
            if(this.permUpgrades[k].level.gt(0))
            {
                this.permUpgrades[k].level = new Decimal(0);
                this.layerCoins = this.layerCoins.add(this.getPermUpgradeCost());
            }
        }
    }

    respecUpgradeTree()
    {
        if(game.settings.confirmations && !confirm("Are you sure you want to respec? This will do a ReStack without reward and you won't get any Layer Coins back."))
        {
            return;
        }
        this.restack(false);
        for(let row of this.upgradeTree)
        {
            for(let upg of row)
            {
                upg.level = new Decimal(0);
            }
        }
    }

    restack(reward = true)
    {
        if(reward && game.settings.confirmations && !confirm("Are you sure you want to ReStack? You will lose all progress in exchange for Layer Coins."))
        {
            return;
        }
        if(reward)
        {
            this.layerCoins = this.layerCoins.add(this.getRestackGain());
            this.timesReset++;
        }
        game.currentChallenge = null;
        game.layers = [];
        functions.generateLayer(0);
        game.currentLayer = game.layers[0];
        this.timeSpent = 0;
        if(game.metaLayer.active)
        {
            game.metaLayer.layer = new Decimal(0);
            game.metaLayer.resource = new Decimal(1);
        }
        game.alephLayer = new AlephLayer(); //reset Aleph Layer
        for(let k of Object.keys(game.automators))
        {
            game.automators[k].upgrade.level = new Decimal(0);
        }
        for(let k of Object.keys(game.volatility))
        {
            game.volatility[k].level = new Decimal(0);
        }
    }

    canMeta()
    {
        return game.highestLayer >= 128 && this.metaUpgrade.level.gt(10);
    }

    goMeta()
    {
        this.restack(false);
        game.metaLayer.active = true;
        functions.createNotification(new Notification(NOTIFICATION_SPECIAL, "Other Times await..."));
    }

    tick(dt)
    {
        this.timeSpent += dt;
    }

    load(obj)
    {
        this.layerCoins = obj.layerCoins;
        this.timeSpent = obj.timeSpent;
        for(let k of Object.keys(obj.permUpgrades))
        {
            this.permUpgrades[k].level = obj.permUpgrades[k].level;
        }
        this.metaUpgrade.level = obj.metaUpgrade.level;
        if(obj.upgradeTree)
        {
            for(let r = 0; r < obj.upgradeTree.length; r++)
            {
                for(let c = 0; c < obj.upgradeTree[r].length; c++)
                {
                    this.upgradeTree[r][c].level = obj.upgradeTree[r][c].level;
                }
            }
        }
    }
}
