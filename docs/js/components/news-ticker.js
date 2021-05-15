Vue.component("news-ticker", {
    data: function()
    {
        return {
            messages: [
                "Omega Layers is the best Idle Game ever! Every day I come home from an exhausting day at work, I like to sit on the couch, take out my Laptop and have a nice session of Omega Layers. It fills my heart with joy when I see 1e23572357238972384723589 α on my Laptop Screen. I hope one day to finally achieve meta, it will be my biggest achievement. Thank you for your kind attention!",
                "when you get softcapped like bruh",
                "Good news: everything is (softcapped)!",
                "bad news: everything is at ee308 exept the fact that my game broke",
                "ReStack sponsored by RAID: Shadow Legends",
                "When you hear something banging outside its prob Kris smashing some tables y'know",
                "Bruh",
                () =>
                {
                    let res = "";
                    for(let i = 0; i < Math.floor(Math.random() * 6) + 4; i++)
                    {
                        let seed = Date.now() + i;
                        res += Utils.createRandomWord(Math.floor(Math.random() * 10) + 4, seed) + " ";
                    }
                    return res + "-" + Utils.createRandomWord(Math.floor(Math.random() * 3) + 4, Date.now() + 20) + " " + Utils.createRandomWord(Math.floor(Math.random() * 3) + 4, Date.now() + 21);
                },
                () => "This Number is randomly generated -> " + Math.pow(10, Math.random() * 3.01).toFixed(2) +
                    ". If it's above 1,000, consider yourself lucky!",
                () => `<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank">get Layer ` + PrestigeLayer.getNameForLayer(game.metaLayer.active ? game.metaLayer.layer.add(1).floor() : game.layers.length) + ` now [working 2020]</a>`,
                () => functions.formatNumber(game.metaLayer.active ? game.metaLayer.getApproxAlpha() : game.layers[0].resource, 2, 0, 1e9) + " α? Thats 0% of amount tables i break",
                () => "Motto of the Day: " + Utils.getMOTD()
            ],
            currentMessage: "",
            messageIndex: -1
        }
    },
    computed: {
        animationDuration: function()
        {
            return 10 + 0.1 * this.currentMessage.replace(/<.*?>/g, "").length;
        }
    },
    methods: {
        getMessage: function()
        {
            let arr = Array.from(this.messages);
            if(this.messageIndex !== -1)
            {
                arr.splice(this.messageIndex, 1);
            }
            let index = Math.floor(Math.random() * arr.length);
            this.messageIndex = index;
            let element = arr[index];
            this.currentMessage = typeof element === "string" ? element : element();
        }
    },
    mounted: function()
    {
        this.getMessage();
        this.$refs.message.onanimationiteration = e =>
        {
            let anim = this.$refs.message.style.animation.slice();
            this.getMessage();
            this.$refs.message.style.animation = "none";
            void this.$refs.message.offsetWidth; //black magic
            this.$refs.message.style.animation = anim;
            Vue.nextTick(() =>
            {
                if(this.$refs.message.style.animationDuration === "")
                {
                    this.$refs.message.style.animationDuration = this.animationDuration + "s";
                }
            });
        };
    },
    template: `<div class="news-ticker">
    <span ref="message" :style="{'animation-duration': animationDuration + 's'}" v-html="currentMessage"></span>
</div>`
})