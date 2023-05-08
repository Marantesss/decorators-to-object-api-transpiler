<!-- IsButton.vue -->

<template>
    <button
        data-test="is-button_button"
        class="is-button"
        :class="componentClass"
        :type="nativeType"
        :disabled="disabled || loading"
        @click="onClick"
        @blur="onBlur"
        @focus="onFocus">
        <template v-if="loading">
            <i
                data-test="is-button_icon-loading"
                class="is-button__prefix fal fa-spinner-third fa-spin" />
            <span v-if="loadingLabelVisible && loadingLabel">
                {{ loadingLabel }}
            </span>
        </template>
        <template v-else>
            <i
                v-if="iconPrefix"
                data-test="is-button_icon-prefix"
                class="is-button__prefix"
                :class="iconPrefix" />
            <span
                v-if="label"
                data-test="is-button_icon-label">{{ label }}</span>
            <i
                v-if="iconSuffix"
                data-test="is-button_icon-sufix"
                class="is-button__suffix"
                :class="iconSuffix" />
        </template>
    </button>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator'
    import { isVueI18Next } from '@/plugins/i18n/i18n.plugin'

    type ButtonType = 'primary' | 'secondary' | 'relevant' | 'overlay' | 'text-only' | 'success' | 'text-only-primary'

    /**
     * A styled native button to use in almost any context.
     */
    @Component
    export default class IsButton extends Vue {
        /**
         * Prevents events from parent elements
         */
        @Prop({ default: true })
        public readonly preventPropagation!: boolean

        /**
         * Text to display on the button
         */
        @Prop({ default: null, validator: (prop) => typeof prop === 'string' || prop === null })
        public readonly label!: string | null

        /**
         * Icon to show before text
         */
        @Prop({ default: null, validator: (prop) => typeof prop === 'string' || prop === null })
        public readonly iconPrefix!: string | null

        /**
         * Icon to show after text
         */
        @Prop({ default: null, validator: (prop) => typeof prop === 'string' || prop === null })
        public readonly iconSuffix!: string | null

        /**
         * Type of button to display
         */
        @Prop({ type: String, default: 'primary' })
        public readonly type!: ButtonType

        /**
         * Disable button interactions
         */
        @Prop({ type: Boolean, default: false })
        public readonly disabled!: boolean

        /**
         * Show loading label
         */
        @Prop({ type: Boolean, default: true })
        public readonly loadingLabelVisible!: boolean

        /**
         * Size of the button
         */
        @Prop({ type: String, default: 'medium' })
        public readonly size!: 'big' | 'medium' | 'small' | 'tiny'

        /**
         * Aligns the content inside the button
         */
        @Prop({ type: String, default: 'center' })
        public readonly align!: 'left' | 'center' | 'right'

        /**
         * Status of the button
         */
        @Prop({ type: String, default: 'normal' })
        public readonly status!: 'normal' | 'error' | 'success' | 'danger' | 'warning'

        /**
         * Make button use entire width available
         */
        @Prop({ type: Boolean, default: false })
        public readonly fullWidth!: string

        /**
         * Custom label for the loading status
         */
        @Prop({ type: String, default: isVueI18Next.t('redesign__is-button.loading') })
        public readonly loadingLabel!: string

        /**
         * Behaviour of the button inside a form
         */
        @Prop({ type: String, default: 'button' })
        public readonly nativeType!: 'button' | 'submit' | 'reset'

        /**
         * Whether the button should show loading when clicked
         */
        @Prop({ type: Boolean, default: false })
        public readonly hasLoading!: boolean

        loading = false

        get componentClass () {
            return [
                `is-button--${this.type}`,
                `is-button--${this.size}`,
                `is-button--${this.status}`,
                `is-button--${this.align}`,
                {
                    'is-button--full-width': this.fullWidth,
                    'is-button--loading': this.loading,
                },
            ]
        }

        onClick (e: Event) {
            if (this.preventPropagation) {
                e.stopPropagation()
            }

            if (this.hasLoading) {
                this.loading = true
                /**
                 * Triggers when button is clicked
                 */
                this.$emit('click', () => {
                    this.loading = false
                })
            } else {
                /**
                 * Triggers when button is clicked
                 */
                this.$emit('click')
            }
        }

        onBlur (e: FocusEvent) {
            if (!this.loading) {
                /**
                 * Triggers when button loses focus
                 */
                this.$emit('blur', e)
            }
        }

        onFocus (e: FocusEvent) {
            if (!this.loading) {
                /**
                 * Triggers when button gets focus
                 */
                this.$emit('focus', e)
            }
        }
    }
</script>

<style lang="scss">
    .is-button {
        -webkit-appearance: none;
        appearance: none;
        line-height: 1rem;
        border-radius: var(--pk-corner-small);
        border: 1px solid transparent;
        background: none;
        font-size: 0.875rem;
        font-family: inherit;
        cursor: pointer;
        display: inline-flex;
        column-gap: var(--pk-xxs);
        transition: background 0.2s var(--pk-easing), border 0.2s var(--pk-easing);
        vertical-align: top;

        @media (forced-colors: active) {
            border: 1px solid ButtonBorder !important;
            background: ButtonFace !important;
            color: ButtonText !important;
        }

        span {
            line-height: inherit;
            display: inline-flex;
            vertical-align: middle;
        }

        i {
            vertical-align: middle;
        }

        .is-button__prefix,
        .is-button__suffix {
            text-align: center;
            width: 16px;
            font-size: 16px;
            line-height: 16px;
            transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.320, 1.275);
        }

        &--full-width {
            display: flex;
            width: 100%;
        }

        // Aligns
        &--left {
            justify-content: flex-start;
            text-align: left;
        }

        &--center {
            justify-content: center;
            text-align: center;
        }

        &--right {
            justify-content: flex-end;
            text-align: right;
        }

        // Sizes
        &--big {
            min-width: 48px;
            padding: 15px;
        }
        &--medium {
            min-width: 40px;
            padding: 11px;
        }
        &--small {
            min-width: 32px;
            padding: 7px;
        }
        &--tiny {
            min-width: 24px;
            padding: 3px;
            font-size: 0.75rem;

            .is-button__prefix,
            .is-button__suffix {
                font-size: 12px;
            }
        }

        &:active:not(:disabled) :is(.is-button__prefix, .is-button__suffix) {
            transform: scale(0.8);
        }

        &:focus-visible {
            outline: 2px solid var(--pk-primary-500);
            outline-offset: 2px;
        }

        &:disabled {
            background: var(--pk-grey-100);
            color: var(--pk-grey-300);
            cursor: not-allowed;
        }

        // Types
        &--primary {
            background: var(--pk-primary-500);
            color: var(--pk-interface-text-on-primary);

            &:hover {
                background: var(--pk-primary-400);
            }

            &:active {
                background: var(--pk-primary-600);
            }

            &.is-button--success:disabled,
            &.is-button--warning:disabled,
            &.is-button--error:disabled,
            &.is-button--danger:disabled {
                background: var(--pk-grey-100);
                color: var(--pk-grey-300);
            }
        }
        &--secondary {
            border-color: var(--pk-interface-border);
            color: var(--pk-grey-900);

            &:hover {
                background: var(--pk-grey-100);
            }

            &:active,
            &.is-button--active {
                background: var(--pk-grey-150);
            }
        }
        &--relevant {
            border-color: var(--pk-interface-border);
            color: var(--pk-primary-500);

            &:hover {
                background: var(--pk-grey-100);
            }

            &:active,
            &.is-button--active {
                background: var(--pk-grey-150);
            }
        }
        &--overlay {
            border-color: var(--pk-interface-border);
            background: var(--pk-grey-0);
            color: var(--pk-grey-900);

            &:hover {
                background: var(--pk-grey-100);
            }

            &:active,
            &.is-button--active {
                background: var(--pk-grey-150);
            }
        }
        &--text-only {
            color: var(--pk-grey-900);

            &:hover {
                background: var(--pk-grey-100);
            }

            &:active,
            &.is-button--active {
                background: var(--pk-grey-150);
            }
        }
        &--text-only-primary {
            color: var(--pk-primary-500);

            &:hover {
                background: var(--pk-grey-100);
            }

            &:active,
            &.is-button--active {
                background: var(--pk-grey-150);
            }
        }
        &--success {
            background: var(--pk-green-500);
            color: var(--pk-interface-text-on-primary);

            &:hover {
                background: var(--pk-green-400);
            }

            &:active,
            &.is-button--active {
                background: var(--pk-green-600);
            }
        }

        &--error,
        &--danger {
            background: var(--pk-red-500);
            color: var(--pk-interface-text-on-primary);

            &:hover {
                background: var(--pk-red-400);
            }

            &:active,
            &.is-button--active {
                background: var(--pk-red-600);
            }
        }

        &--loading {
            background: var(--pk-primary-700) !important;
            color: #FFFFFF !important;
            cursor: progress !important;
        }

        &--warning {
            background: var(--pk-orange-500);
            color: var(--pk-interface-text-on-primary);

            &:hover {
                background: var(--pk-orange-300);
            }

            &:active,
            &.is-button--active {
                background: var(--pk-orange-600);
            }
        }
    }
</style>
