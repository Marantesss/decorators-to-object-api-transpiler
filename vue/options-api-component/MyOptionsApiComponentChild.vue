<template>
    <div>
        My Component
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'

    export interface IMyOptionsApiComponentChild extends Vue {
        method1: (a: number) => void
    }

    export default Vue.extend({
        name: 'MyOptionsApiComponentChild',
        methods: {
            method1 (a: number): void {
                console.warn('method1', a)
            },
        },
    })
</script>

<style lang="scss">
    .my-class-component {
        color: red;
    }
</style>
