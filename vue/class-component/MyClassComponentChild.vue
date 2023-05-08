<template>
    <div>
        My Component
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator'

    @Component
    export default class MyClassComponentChild extends Vue {
        method1 (a: number): void {
            console.warn('method1', a)
        }
    }
</script>

<style lang="scss">
    .my-class-component {
        color: red;
    }
</style>
