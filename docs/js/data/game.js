var game = {
    version: "1.0",
    timeSaved: Date.now(),
    layers: [],
    highestLayer: 0,
    automators: {
        autoMaxAll: new Automator("Auto Max All", "Automatically buys max on all Layers", () =>
        {
            for(let i = Math.max(0, game.volatility.autoMaxAll.apply().toNumber()); i < game.layers.length; i++)
            {
                game.layers[i].maxAll();
            }
        }, new DynamicLayerUpgrade(level => Math.floor(level / 3) + 1, () => null, () => "Decrease the Automator interval",
            level => Decimal.pow(10, PrestigeLayer.getPrestigeCarryOverForLayer(level.toNumber()) * [0.2, 0.5, 0.8][level.toNumber() % 3]),
            level => level.gt(0) ? Math.pow(0.8, level.toNumber() - 1) * 10 : Infinity, null, {
                getEffectDisplay: effectDisplayTemplates.automator()
            })),
        autoPrestige: new Automator("Auto Prestige", "Automatically prestiges all Layers", () =>
        {
            for(let i = 0; i < game.layers.length - 1; i++)
            {
                if(game.layers[game.layers.length - 2].canPrestige() && !game.settings.autoPrestigeHighestLayer)
                {
                    break;
                }
                if(game.layers[i].canPrestige() && !game.layers[i].isNonVolatile())
                {
                    game.layers[i].prestige();
                }
            }
        }, new DynamicLayerUpgrade(level => Math.floor(level / 2) + 2, () => null, () => "Decrease the Automator interval",
            level => Decimal.pow(10, PrestigeLayer.getPrestigeCarryOverForLayer(level.add(2).toNumber()) * (level.toNumber() % 2 === 0 ? 0.25 : 0.75)),
            level => level.gt(0) ? Math.pow(0.6, level.toNumber() - 1) * 30 : Infinity, null, {
                getEffectDisplay: effectDisplayTemplates.automator()
            })),
        autoAleph: new Automator("Auto Aleph", "Automatically Max All Aleph Upgrades", () =>
        {
            game.alephLayer.maxAll();
        }, new DynamicLayerUpgrade(level => level + 3, () => null, () => "Decrease the Automator interval",
            level => Decimal.pow(10, PrestigeLayer.getPrestigeCarryOverForLayer(level.add(3).toNumber()) * 0.7),
            level => level.gt(0) ? Math.pow(0.6, level.toNumber() - 1) * 60 : Infinity, null, {
                getEffectDisplay: effectDisplayTemplates.automator()
            })),
    },
    volatility: {
        layerVolatility: new DynamicLayerUpgrade(level => level + 1, level => level,
            function()
            {
                return "Make the next Layer non-volatile";
            }, level => Decimal.pow(10, PrestigeLayer.getPrestigeCarryOverForLayer(level.add(1).toNumber())), level => level.sub(1), null, {
                getEffectDisplay: function()
                {
                    let val1 = this.level.eq(0) ? "None" : PrestigeLayer.getNameForLayer(this.apply().toNumber());
                    let val2 = PrestigeLayer.getNameForLayer(this.getEffect(this.level.add(1)).toNumber());
                    return val1 + " → " + val2;
                }
            }),
        prestigePerSecond: new DynamicLayerUpgrade(level => Math.round(level * 1.3) + 3, level => null,
            () => "Boost the Prestige Reward you get per second",
            function(level)
            {
                let max = PrestigeLayer.getPrestigeCarryOverForLayer(Math.round(level.toNumber() * 1.3) + 3);
                return Decimal.pow(10, new Random(level.toNumber() * 10 + 10).nextDouble() * max).round();
            }, level => new Decimal(0.5 + 0.1 * level), null, {
                getEffectDisplay: effectDisplayTemplates.percentStandard(0)
            }),
        autoMaxAll: new DynamicLayerUpgrade(level => level + 2, level => level,
            function()
            {
                return "The next Layer is maxed automatically each tick";
            }, level => Decimal.pow(10, PrestigeLayer.getPrestigeCarryOverForLayer(level.add(2).toNumber()) * 0.125), level => level.sub(1), null, {
                getEffectDisplay: function()
                {
                    let val1 = this.level.eq(0) ? "None" : PrestigeLayer.getNameForLayer(this.apply().toNumber());
                    let val2 = PrestigeLayer.getNameForLayer(this.getEffect(this.level.add(1)).toNumber());
                    return val1 + " → " + val2;
                }
            }),
    },
    alephLayer: new AlephLayer(),
    restackLayer: new ReStackLayer(),
    metaLayer: new MetaLayer(),
    achievements: [
        new Achievement("Alpha Holder MK.I", "Reach 100 α", "α<sub>0.1</sub>", () => game.layers[0] && game.layers[0].resource.gte("100")),
        new Achievement("Alpha Holder MK.II", "Reach 1e60 α", "α<sub>0.2</sub>", () => game.layers[0] && game.layers[0].resource.gte("1e60")),
        new Achievement("Alpha Holder MK.III", "Reach 1e150 α", "α<sub>0.4</sub>", () => game.layers[0] && game.layers[0].resource.gte("1e150")),
        new Achievement("Alpha Holder MK.IV", "Reach 1e300 α", "α<sub>0.8</sub>", () => game.layers[0] && game.layers[0].resource.gte("1e300")),
        new Achievement("Alpha Holder MK.V", "Reach 1e600 α", "α<sub>0.16</sub>", () => game.layers[0] && game.layers[0].resource.gte("1e600")),
        new Achievement("Alpha Holder MK.VI", "Reach 1e1200 α", "α<sub>0.32</sub>", () => game.layers[0] && game.layers[0].resource.gte("1e1200")),
        new Achievement("Alpha Holder MK.VII", "Reach 1e2400 α", "α<sub>0.64</sub>", () => game.layers[0] && game.layers[0].resource.gte("1e2400")),
        new Achievement("Alpha Holder MK.VIII", "Reach 1e4800 α", "α<span style='font-size: 70%;'><sub>0.128</sub>", () => game.layers[0] && game.layers[0].resource.gte("1e4800")),
        new Achievement("Alpha Holder MK.IX", "Reach 1e9600 α", "α<span style='font-size: 70%;'><sub>0.256</sub>", () => game.layers[0] && game.layers[0].resource.gte("1e9600")),
        new Achievement("Alpha Holder MK.X", "Reach 1e60K α", "α<span style='font-size: 70%;'><sub>0.512</sub>", () => game.layers[0] && game.layers[0].resource.gte("6e60000")),
        new Achievement("Alpha Holder MK.XI", "Reach 1e150K α", "α<sub>1.1</sub>", () => game.layers[0] && game.layers[0].resource.gte("1e150000")),
        new Achievement("Alpha Holder MK.XII", "Reach 1e300K α", "α<sub>1.2</sub>", () => game.layers[0] && game.layers[0].resource.gte("3e300000")),
        new Achievement("Alpha Holder MK.XIII", "Reach 1e600K α", "α<sub>1.4</sub>", () => game.layers[0] && game.layers[0].resource.gte("6e600000")),
        new Achievement("Alpha Holder MK.XIV", "Reach 1e1.2M α", "α<sub>1.8</sub>", () => game.layers[0] && game.layers[0].resource.gte("1e1200000")),
        new Achievement("Alpha Holder MK.XV", "Reach 1e10M α", "α<sub>1.16</sub>", () => game.layers[0] && game.layers[0].resource.gte("1e10000000")),
        new Achievement("Alpha Holder MK.XVI", "Reach 1e1B α", "α<sub>1.32</sub>", () => game.layers[0] && game.layers[0].resource.gte("1e1000000000")),
        new Achievement("Alpha Holder MK.XVII", "Reach 1e1T α", "α<sub>1.64</sub>", () => game.layers[0] && game.layers[0].resource.gte("1e1000000000000")),
        new Achievement("Alpha Holder MK.XVIII", "Reach 1ee15 α", "α<sub>1.128</sub>", () => game.layers[0] && game.layers[0].resource.gte("1e1000000000000000")),
        new Achievement("The beginning of Idling", "Have 1 <span>α<sub>1</sub></span> Generator", "<span>α<sub>1</sub></span>", () => game.layers[0] && game.layers[0].generators[0].bought.gt(0)),
        new Achievement("Polynomial Growth", "Have 1 <span>α<sub>2</sub></span> Generator", "<span>α<sub>2</sub></span>", () => game.layers[0] && game.layers[0].generators[1].bought.gt(0)),
        new Achievement("Still Polynomial Growth", "Have 1 <span>α<sub>3</sub></span> Generator", "<span>α<sub>3</sub></span>", () => game.layers[0] && game.layers[0].generators[2].bought.gt(0)),
        new Achievement("A Square of Generators", "Have 1 <span>α<sub>4</sub></span> Generator", "<span>α<sub>4</sub></span>", () => game.layers[0] && game.layers[0].generators[3].bought.gt(0)),
        new Achievement("Pentagen", "Have 1 <span>α<sub>5</sub></span> Generator", "<span>α<sub>5</sub></span>", () => game.layers[0] && game.layers[0].generators[4].bought.gt(0)),
        new Achievement("Power of Six", "Have 1 <span>α<sub>6</sub></span> Generator", "<span>α<sub>6</sub></span>", () => game.layers[0] && game.layers[0].generators[5].bought.gt(0)),
        new Achievement("Seven Heaven", "Have 1 <span>α<sub>7</sub></span> Generator", "<span>α<sub>7</sub></span>", () => game.layers[0] && game.layers[0].generators[6].bought.gt(0)),
        new Achievement("Octacore", "Have 1 <span>α<sub>8</sub></span> Generator", "<span>α<sub>8</sub></span>", () => game.layers[0] && game.layers[0].generators[7].bought.gt(0)),
        new Achievement("Upgradalicious", "Buy your first α Upgrade", "<span>α<sub>UP</sub></span>", () => game.layers[0] && game.layers[0].upgrades[0].level.gt(0)),
        new Achievement("Stonks", "Reach 1e18 α", "α", () => game.layers[0] && game.layers[0].resource.gte(1e18)),
        new Achievement("Other Times Await", "Go β", "β", () => game.layers[1] && game.layers[1].timesReset > 0),
        new Achievement("POW", "Have 1 <span>β<sub>P<sub>1</sub></sub></span> Generator", "<span>β<sub>P<sub>1</sub></sub></span>", () => game.layers[1] && game.layers[1].powerGenerators[0].bought.gt(0)),
        new Achievement("Polynomial POW", "Have 1 <span>β<sub>P<sub>2</sub></sub></span> Generator", "<span>β<sub>P<sub>2</sub></sub></span>", () => game.layers[1] && game.layers[1].powerGenerators[1].bought.gt(0)),
        new Achievement("In thousands", "Have over 1,000 <span>α<sub>1</sub></span> Generators", "<span>α<sub>1</sub></span>", () => game.layers[0] && game.layers[0].generators[0].bought.gte(1000)),
        new Achievement("Other Times Arrived", "Go β 10 Times", "β", () => game.layers[1] && game.layers[1].timesReset >= 10),
        new Achievement("Automatic!", "Enable the \"Max All\" Automator", "<img src=\"images/hardware-chip.svg\" alt=\"A\">", () => game.automators.autoMaxAll.upgrade.level.gte(1)),
        new Achievement("Exploding Numbers", "Reach 1e6 β", "β", () => game.layers[1] && game.layers[1].resource.gte(1e6)),
        new Achievement("A big Boost", "Reach 1e9 β-Power", "<span>β<sub>P</sub></span>", () => game.layers[1] && game.layers[1].power.gte(1e9)),
        new Achievement("A Square of Power", "Have 1 <span>β<sub>P<sub>4</sub></sub></span> Generator", "<span>β<sub>P<sub>4</sub></sub></span>", () => game.layers[1] && game.layers[1].powerGenerators[3].bought.gt(0)),
        new Achievement("Another Layer?!", "Reach 1e20 β", "β", () => game.layers[1] && game.layers[1].resource.gte(1e20)),
        new Achievement("Other Times Await... Again", "Go γ", "γ", () => game.layers[2] && game.layers[2].timesReset > 0),
        new Achievement("POγγ", "Have 1 <span>γ<sub>P<sub>1</sub></sub></span> Generator", "<span>γ<sub>P<sub>1</sub></sub></span>", () => game.layers[2] && game.layers[2].powerGenerators[0].bought.gt(0)),
        new Achievement("The True Time", "Go γ 42 Times", "γ", () => game.layers[2] && game.layers[2].timesReset >= 42),
        new Achievement("More Gamma, more Boost", "Reach 1e6 γ", "γ", () => game.layers[2] && game.layers[2].resource.gte(1e6)),
        new Achievement("How Challenging", "Beat Challenge y-01 at least once", "γ", () => game.layers[2] && game.layers[2].challenges[0].level > 0),
        new Achievement("Persistence", "Make Layer α Non-Volatile", '<img src="images/save.svg" alt="S">', () => game.volatility.layerVolatility.level.gt(0)),
        new Achievement("Other Times Await... Yet Again", "Go δ", "δ", () => game.layers[3] && game.layers[3].timesReset > 0),
        new Achievement("Rookie Numbers", "Reach 1,000 ℵ", '<span class="aleph">ℵ</span>', () => game.alephLayer.aleph.gte(1000)),
        new Achievement("Float limit", "Reach 1e38 ℵ", '<span class="aleph">ℵ</span>', () => game.alephLayer.aleph.gte(1e38)),
        new Achievement("Anfinty", "Reach 1.8e308 ℵ", '<span class="aleph">ℵ<sub>∞</sub></span>', () => game.alephLayer.aleph.gte(1.78e308)),
        new Achievement("Oh yea?", "Reach 1.8e1700 ℵ", "<span class='aleph'>ℵ<span style='font-size: 70%;'><sub>∞[y:2]</sub></span>", () => game.alephLayer.aleph.gte(1e1700)),
        new Achievement("It all runs by itself", "Enable the Aleph Automator", "<img src=\"images/hardware-chip.svg\" alt=\"A\">", () => game.automators.autoAleph.upgrade.level.gte(1)),
        new Achievement("How many are there?!", "Go ε", "ε", () => game.layers[4] && game.layers[4].timesReset > 0),
        new Achievement("It's time to stop! (not)", "Go ζ", "ζ", () => game.layers[5] && game.layers[5].timesReset > 0),
        new Achievement("Temperature", "Go θ", "θ", () => game.layers[7] && game.layers[7].timesReset > 0),
        new Achievement("Stack A-New!", "ReStack", "<img alt=\"LC\" class=\"inline\" src=\"images/layercoin.svg\"/>", () => game.restackLayer.timesReset > 0),
        new Achievement("H λ l f L i f e", "Go λ", "λ", () => game.layers[10] && game.layers[10].timesReset > 0),
        new Achievement("One for Everyone", "Have 7,800,000,000 Layer Coins", "<img alt=\"LC\" class=\"inline\" src=\"images/layercoin.svg\"/>", () => game.restackLayer.layerCoins.gte(7.8e9)),
        new Achievement("I forgot how much upgrades there was...", "Have 1,000,000,000,000,000,000 Layer Coins", "<img alt=\"LC\" class=\"inline\" src=\"images/layercoin.svg\"/>", () => game.restackLayer.layerCoins.gte(1e18)),
        new Achievement("What's the Point of Layers?", "Buy the Meta Upgrade", "<img alt=\"LC\" class=\"inline\" src=\"images/layercoin.svg\"/>", () => game.restackLayer.metaUpgrade.level.gt(0)),
        new Achievement("Wake Up", "Go Meta", "<img alt=\"LC\" class=\"inline\" src=\"images/layercoin.svg\"/>", () => game.metaLayer.active),
        new Achievement("Ω-Layers", "Reach Layer Ω", "Ω", () => game.metaLayer.layer.gte(47)),
        new Achievement("One for each Second", "Advance 1 Layer per second", "»", () => game.metaLayer.getLayersPS().gte(1)),
        new Achievement("The Ladder is Infinite", "Reach Layer 1000", "Ρ↑β", () => game.metaLayer.layer.gte(1000)),
        new Achievement("Stupidly fast", "Advance 10 Layer per second", "»»", () => game.metaLayer.getLayersPS().gte(10)),
        new Achievement("What are Layer resets?", "Buy the ReStack Tree Upgrade in Row 5", "<img alt=\"LC\" class=\"inline\" src=\"images/layercoin.svg\"/>", () => game.restackLayer.upgradeTreeNames.substractLayers.apply()),
        new Achievement("Faster than Light", "Advance ~300e9 Layers per second", "»»»", () => game.metaLayer.getLayersPS().gte(299792458)),
        new Achievement("Me and my boys on our way...", "Advance ~1e90 Layers per second", "»»»»", () => game.metaLayer.getLayersPS().gte(1e90)),
        new Achievement("...to do Omega Layers EX...", "Advance ~1.78e308 Layers per second", "»»»»»", () => game.metaLayer.getLayersPS().gte(1.78e308)),
        new Achievement("It never Ends", "Reach Layer 1e10", "<span style='font-size: 30%;'><span>Ω<sub>ϝ</sub></span><sup>ρ</sup>↑<span>Ω<sub>ϙ</sub></span><sup>Ν</sup>↑<span>Ω<sub>ϛ</sub></span><sup>κ</sup>↑<span>Ω</span><sup>Σ</sup></span>", () => game.metaLayer.layer.gte(1e10)),
        new Achievement("Inf-Infinity", "Reach Layer ~1.8e308", "<span class='flipped-v'>Ω</span>", () => game.metaLayer.layer.gte(1.78e308)),
        new Achievement("It never actually Ends", "Reach Layer 1ee9", "<span style='font-size: 70%;'><span>Ω<sub>ϝ</sub></span><sup>ρ↑↑↑3</sup>", () => game.metaLayer.layer.gte("1ee9")),
    ],
    currentLayer: null,
    currentChallenge: null,
    notifications: [],
    timeSpent: 0,
    settings: {
        tab: "Layers",
        showAllLayers: true,
        showMinLayers: 5,
        showMaxLayers: 5,
        showLayerOrdinals: false,
        layerTickSpeed: 1,
        buyMaxAlways10: true,
        disableBuyMaxOnHighestLayer: false,
        resourceColors: true,
        resourceGlow: true,
        newsTicker: true,
        autoMaxAll: true,
        autoPrestigeHighestLayer: true,
        notifications: true,
        saveNotifications: true,
        confirmations: true,
        offlineProgress: true,
        titleStyle: 2,
        theme: "dark.css"
    }
};

let initialGame = functions.getSaveString();