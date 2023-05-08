<template>
    <div class="my-class-component">
        <my-class-component-child ref="child" />
    </div>
</template>

<script lang="ts">
    import moment, { Moment } from 'moment'
    import { Component, Emit, Prop, Ref, Vue, Watch } from 'vue-property-decorator'

    import MyClassComponentChild from './MyClassComponentChild.vue'

    interface IProp4 {
        arg1: number
        arg2: null | string
    }

    @Component({
        components: {
            MyClassComponentChild,
        },
    })
    export default class MyClassComponent extends Vue {
        @Ref('child')
        readonly refChild!: MyClassComponentChild

        @Prop({ type: Boolean, default: true })
        public readonly prop1!: boolean

        @Prop({ type: String, default: 'option 1', validator: (value: string) => ['option 1', 'option 2'].includes(value) })
        public readonly prop2!: 'option 1' | 'option 2'

        @Prop({ type: String, default: 'option 1' })
        public readonly prop3!: string

        @Prop()
        public readonly prop4?: IProp4

        data1: Moment | null = null
        data2: string = 'my string'
        data3: number = 0

        readonly data4: number = 123

        get computedProp1 (): number {
            return this.data1!.hour() + 1
        }

        get computedProp2 () {
            return this.data1!.minute() + this.data4
        }

        @Watch('data1')
        onData1Change (): void {
            this.data3++
        }

        @Watch('data2', { immediate: true, deep: true })
        onData2Change (newVal: string, oldVal: string): void {
            this.data3++
        }

        @Emit('event1')
        emitEvent1 (): void {}

        @Emit('event2')
        emitEvent2 (arg1: string, arg2: number): void {}

        @Emit('event3')
        emitEvent3 (arg1: string): number {
            return this.data3
        }

        beforeCreate (): void {
            console.warn('beforeCreate')
        }

        created (): void {
            console.warn('created')
        }

        beforeMount (): void {
            console.warn('beforeMount')
        }

        mounted (): void {
            console.warn('mounted')
        }

        beforeUpdate (): void {
            console.warn('beforeUpdate')
        }

        updated (): void {
            this.refChild.method1(this.data4)
        }

        beforeDestroy (): void {
            console.warn('beforeDestroy')
        }

        destroyed (): void {
            console.warn('destroyed')
        }

        method1 (): void {
            this.emitEvent1()
        }

        method2 (arg1: number, arg2: string | null): string {
            return this.data1 + this.data2
        }
    }
</script>

<style lang="scss">
    .my-class-component {
        color: red;
    }
</style>
