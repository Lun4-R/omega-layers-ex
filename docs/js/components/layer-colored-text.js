Vue.component("layer-colored-text", {
    props: ["text", "layer", "layerid"],
    computed: {
        textColor: function()
        {
            let lid = new Decimal(this.getLayerId());
            if(this.getLayerId() instanceof Decimal && this.getLayerId().gte("1.78eee308"))
            {
                return "#cc00ff";
            }
            let h = 33 * Math.min(lid.toNumber(), 10000);
            if(lid.gt(10000))
            {
                h += Decimal.log10(lid.div(10000)).toNumber() * 600;
            }
            let s = Math.min(100, 1 * this.getLayerId());
            return "hsl(" + h + ", " + s + "%, 50%)";
        },
        textGlow: function()
        {
            let thickness = 0.055 * this.getLayerId();
            let t = [Math.min(2, thickness), Math.min(2, thickness / 4),
                Math.min(2, Math.max(0.5, thickness - 0.2) / 2)];
            let color = "currentcolor";
            return "0px 0px " + t[0] + "em currentcolor"+
                ",0px 0px " + t[1] + "em currentcolor"+
                ",0px 0px " + t[2] + "em currentcolor";
        }
    },
    methods:
    {
        getLayerId: function()
        {
            return this.layerid;
        },
        getStyle: function()
        {
            let styles = {};
            if(game.settings.resourceColors)
            {
                styles.color = this.textColor;
            }
            if(game.settings.resourceGlow)
            {
                styles.textShadow = this.textGlow;
            }
            return styles;
        }
    },
    template: `<span :style="getStyle()"><slot></slot></span>`
})