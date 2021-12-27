<template>
    <iframe :src="url" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</template>

<script>

export default {
    name: 'VideoPlayer',
    props: ['url']
}
</script>

<style lang="scss" scoped>
    iframe {
        width: 100%;
        height: 100%;
    }
</style>

