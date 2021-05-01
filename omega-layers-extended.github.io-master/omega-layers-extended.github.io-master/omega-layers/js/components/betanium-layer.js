Vue.component("betanium-layer", {
    data: function()
    {
        return {
            betanium: game.betaniumLayer
        }
    },
    computed: {
        canProduceBetanium: function()
        {
            return this.betanium.getBetaniumBoostFromLayer().gt(0);
        },
        isSoftCapped: function()
        {
            return this.betanium.betanium.gt(1e300);
        }
    },
    methods: {
        formatNumber: (n, prec, prec1000, lim) => functions.formatNumber(n, prec, prec1000, lim),
        highestLayer: () => functions.maxLayerUnlocked()
    },
    template: `<div class="betanium-layer">
<div class="resource">
    <p>You have {{formatNumber(betanium.betanium, 2, 2, 1e9)}} <span class="betanium">&beta;</span></p>
    <p>You get {{formatNumber(betanium.getBetaniumGain(), 2, 2, 1e9)}} <span class="betanium">&beta;</span>/s</p>
</div>
<div class="boosts">
    <div v-if="canProduceBetanium">
        <p>Your highest Layer is <resource-name :layerid="highestLayer()"></resource-name>, translated to a x{{formatNumber(betanium.getBetaniumBoostFromLayer(), 2, 2)}} Boost on <span class="betanium">&beta;</span> Production</p>
    </div>
    <div v-else>
        <p>You need to go <resource-name :layerid="5"></resource-name> at least once to produce <span class="betanium">&beta;</span></p>
    </div>
</div>
<div class="tabs">
    <button @click="betanium.maxAll()">Max All (M)</button>
</div>
<div class="upgrades">
    <betanium-upgrade :upgrade="betanium.upgrades.betaniumGain"></betanium-upgrade>
    <betanium-upgrade :upgrade="betanium.upgrades.betaniumGainBonus"></betanium-upgrade>
</div>
<h3>Enhancers</h3>
<div class="upgrades">
    <betanium-upgrade :upgrade="betanium.upgrades.deltaBoost"></betanium-upgrade>
    <betanium-upgrade :upgrade="betanium.upgrades.betaniumBoost"></betanium-upgrade>
    <betanium-upgrade :upgrade="betanium.upgrades.powerGenerators"></betanium-upgrade>
    <betanium-upgrade :upgrade="betanium.upgrades.prestigeNoPowerBoost"></betanium-upgrade>
    <betanium-upgrade :upgrade="betanium.upgrades.betterBetaFormula"></betanium-upgrade>
    <betanium-upgrade :upgrade="betanium.upgrades.betaniumBoost2"></betanium-upgrade>
    <betanium-upgrade :upgrade="betanium.upgrades.prestigeRewards"></betanium-upgrade>
    <betanium-upgrade :upgrade="betanium.upgrades.layerExponentialBoost"></betanium-upgrade>
</div>
</div>`
});