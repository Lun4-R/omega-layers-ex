Vue.component("betanium-upgrade", {
    props: ["upgrade"],
    template: `<resource-upgrade :upgrade="upgrade" :resourcename="'&beta'"></resource-upgrade>`
});