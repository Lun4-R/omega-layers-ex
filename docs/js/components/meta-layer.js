Vue.component("meta-layer", {
    data: function()
    {
        return {
            metaLayer: game.metaLayer
        }
    },
    methods: {
        formatNumber: (n, prec, prec1000, lim) => functions.formatNumber(n, prec, prec1000, lim)
    },
    computed: {
        showLayersPS: function()
        {
            return this.metaLayer.getLayersPS().gte(1e308);
        },
        showPowerers: function()
        {
            return game.restackLayer.upgradeTreeNames.unlockResourcePowerers.apply();
        },
        canMaxAll: function()
        {
            return game.restackLayer.upgradeTreeNames.substractLayers.apply();
        }
    },
    template: `<div class="meta-layer">
<p class="resource">You have about excalty {{formatNumber(metaLayer.resource, 8, 3, 1e9)}} <resource-name :layerid="metaLayer.layer.floor()"></resource-name> which is equivalent about</p>
<p class="resource alpha" v-if="metaLayer.layer.gt(0)">{{formatNumber(metaLayer.getApproxAlpha(), 2, 0, 1e9)}} <resource-name :layerid="0"></resource-name> alpha / Within this amount of it you are on</p>
<p class="layer">{{formatNumber(metaLayer.layer.add(1), 2, 0, 1e12)}}th layer...</p>
<p>Your Resource multiplies by x{{formatNumber(metaLayer.getMultiPS(), 2, 2)}} each second
<span v-if="showLayersPS"><br/>and thus advancing appox. {{formatNumber(metaLayer.getLayersPS(), 2, 2)}} Layers per second</span></p>
<button v-if="canMaxAll" @click="metaLayer.maxAll()" class="max-all">Max All (M)</button>
<h4>Resource Multipliers // Base multipliers</h4>
<upgrade-container :upgrades="metaLayer.multiplierUpgrades"></upgrade-container>
<h4 v-if="showPowerers">Resource Powerers // When Expo is more important and faster</h4>
<upgrade-container v-if="showPowerers" :upgrades="metaLayer.powerUpgrades"></upgrade-container>
</div>`
})
