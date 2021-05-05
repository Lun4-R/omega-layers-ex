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
        new Achievement("What is that?", "Reach 10 α", "MK.I", () => game.layers[0] && game.layers[0].resource.gte("10")),
        new Achievement("Wow you spent 1 min getting that", "Reach 1K α", "MK.II", () => game.layers[0] && game.layers[0].resource.gte("1000")),
        new Achievement("I learned it from school", "Reach 1B α", "<span style='font-size: 80%;'><span>MK.III</span>", () => game.layers[0] && game.layers[0].resource.gte("1e9")),
        new Achievement("Now open-beta!", "Reach 1Sp α", "<span style='font-size: 80%;'><span>MK.IV</span>", () => game.layers[0] && game.layers[0].resource.gte("1e24")),
        new Achievement("I forgot what number was it...", "Reach 1e308 α", "<span style='font-size: 80%;'><span>MK.V</span>", () => game.layers[0] && game.layers[0].resource.gte("1e308")),
        new Achievement("2^1028^2", "Reach 1e94 864 α", "<span style='font-size: 80%;'><span>MK.VI</span>", () => game.layers[0] && game.layers[0].resource.gte("1e94864")),
        new Achievement("2^1028^2^2", "Reach 1e18 999 178 496 α", "<span style='font-size: 70%;'><span>MK.VII</span>", () => game.layers[0] && game.layers[0].resource.gte("1e8999178496")),
        new Achievement("2^1028^2*4", "Reach 1e80 985 213 602 868 822 016 α", "<span style='font-size: 70%;'><span>MK.VIII</span>", () => game.layers[0] && game.layers[0].resource.gte("1e80985213602868822016")),
        new Achievement("Bruh my calculator gave up...", "Reach 6.55ee39 α", "<span style='font-size: 80%;'><span>MK.XI</span>", () => game.layers[0] && game.layers[0].resource.gte("6.55ee39")),
        new Achievement("Still not on Meta?", "Reach 1ee60 α", "<span style='font-size: 70%;'><span>MK.VIII</span>", () => game.layers[0] && game.layers[0].resource.gte("1ee60")),
        new Achievement("Sheesh", "Reach 6.55ee120 α", "<span style='font-size: 80%;'><span>MK.XI</span>", () => game.layers[0] && game.layers[0].resource.gte("6.55ee120")),
        new Achievement("I think thats why Break_Eternity.js was useful", "Reach 1eee50 α", "<span style='font-size: 70%;'><span>MK.VIII</span>", () => game.layers[0] && game.layers[0].resource.gte("1eee50")),
        new Achievement("Limit breaker", "Reach 6.55eeee50 α", "<span style='font-size: 80%;'><span>MK.XI</span>", () => game.layers[0] && game.layers[0].resource.gte("6.55eeee50")),
        new Achievement("Wonderbar!", "Have 1 <span>α<sub>1</sub></span> Generator", "<span>α<sub>1</sub></span>", () => game.layers[0] && game.layers[0].generators[0].bought.gt(0)),
        new Achievement("Here hold this!", "Have 1 <span>β<sub>1</sub></span> Generator", "<span>β<sub>1</sub></span>", () => game.layers[1] && game.layers[1].powerGenerators[0].bought.gt(0)),
        new Achievement("Radioactive", "Have 1 <span>γ<sub>1</sub></span> Generator", "<span>γ<sub>1</sub></span>", () => game.layers[2] && game.layers[2].powerGenerators[0].bought.gt(0)),
        new Achievement("Triangle into seed", "Have 1 <span>δ<sub>1</sub></span> Generator", "<span>δ<sub>1</sub></span>", () => game.layers[3] && game.layers[3].powerGenerators[0].bought.gt(0)),
        new Achievement("Beta but in Meta!", "Go β", "β", () => game.layers[1] && game.layers[1].timesReset > 0),
        new Achievement("I skipped physics...", "Go γ", "γ", () => game.layers[2] && game.layers[2].timesReset > 0),
        new Achievement("Should u stop?", "Go δ", "δ", () => game.layers[3] && game.layers[3].timesReset > 0),
        new Achievement("Eh 5th layer is ez", "Go ε", "ε", () => game.layers[4] && game.layers[4].timesReset > 0),
        new Achievement("I messed alphabet up D:", "Go ζ", "ζ", () => game.layers[5] && game.layers[5].timesReset > 0),
        new Achievement("Long boiiiii", "Go η", "η", () => game.layers[6] && game.layers[6].timesReset > 0),
        new Achievement("Temperature counter", "Go θ", "θ", () => game.layers[7] && game.layers[7].timesReset > 0),
        new Achievement("Its L and i at same time", "Go ι", "ι", () => game.layers[8] && game.layers[8].timesReset > 0),
        new Achievement("kilo or k", "Go κ", "κ", () => game.layers[9] && game.layers[9].timesReset > 0),
        new Achievement("11th layer? Yea 117 to go :/", "Go λ", "λ", () => game.layers[10] && game.layers[10].timesReset > 0),
        new Achievement("Still going on...", "Go μ", "μ", () => game.layers[11] && game.layers[11].timesReset > 0),
        new Achievement("N or v?", "Go ν", "ν", () => game.layers[12] && game.layers[12].timesReset > 0),
        new Achievement("E but in 3d", "Go ξ", "ξ", () => game.layers[13] && game.layers[13].timesReset > 0),
        new Achievement("OwO", "Go ο", "ο", () => game.layers[14] && game.layers[14].timesReset > 0),
        new Achievement("aka 3.14 or circle thing idk", "Go π", "π", () => game.layers[15] && game.layers[15].timesReset > 0),
        new Achievement("ρ = M/V ", "Go ρ", "ρ", () => game.layers[16] && game.layers[16].timesReset > 0),
        new Achievement("Σ = mc", "Go σ", "σ", () => game.layers[17] && game.layers[17].timesReset > 0),
        new Achievement("Smooth T", "Go τ", "τ", () => game.layers[18] && game.layers[18].timesReset > 0),
        new Achievement("U", "Go υ", "υ", () => game.layers[19] && game.layers[19].timesReset > 0),
        new Achievement("Finally 21th lay- oh wait 107 to go :/", "Go φ", "φ", () => game.layers[20] && game.layers[20].timesReset > 0),
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