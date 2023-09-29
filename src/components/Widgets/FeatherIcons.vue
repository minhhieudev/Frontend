<template>
    <component :is="`${icon}-icon`" size="22" />
</template>
<script>
import {PackageIcon, LayersIcon, YoutubeIcon} from 'vue-feather-icons'
export default {
    props:{
        icon: {
            type: String,
            require: true
        }
    },
    components: {
        PackageIcon,
        LayersIcon,
        YoutubeIcon
    },
}
</script>