import IconContainer from './IconContainer.vue'
import {
    ArrowDown,
    ArrowUp,
    CreditCard,
    Wallet,
} from '@lucide/vue'

export default {
    title: 'Atoms/IconContainer',
    component: IconContainer,
    tags: ['autodocs'],
    argTypes: {
        tone: {
            control: 'select',
            options: ['primary', 'success', 'danger', 'muted'],
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
    },
}

export const Default = {
    args: {
        tone: 'primary',
        size: 'md',
    },
    render: (args) => ({
        components: {
            IconContainer,
            CreditCard,
        },
        setup() {
            return {
                args,
            }
        },
        template: `
          <IconContainer v-bind="args">
            <CreditCard class="h-5 w-5" />
          </IconContainer>
        `,
    }),
}

export const Tones = {
    render: () => ({
        components: {
            IconContainer,
            CreditCard,
            ArrowDown,
            ArrowUp,
            Wallet,
        },
        template: `
          <div class="flex items-center gap-4">
            <IconContainer tone="primary">
              <CreditCard class="h-5 w-5" />
            </IconContainer>

            <IconContainer tone="success">
              <ArrowDown class="h-5 w-5" />
            </IconContainer>

            <IconContainer tone="danger">
              <ArrowUp class="h-5 w-5" />
            </IconContainer>

            <IconContainer tone="muted">
              <Wallet class="h-5 w-5" />
            </IconContainer>
          </div>
        `,
    }),
}

export const Sizes = {
    render: () => ({
        components: {
            IconContainer,
            CreditCard,
        },
        template: `
          <div class="flex items-center gap-4">
            <IconContainer size="sm">
              <CreditCard class="h-4 w-4" />
            </IconContainer>

            <IconContainer size="md">
              <CreditCard class="h-5 w-5" />
            </IconContainer>

            <IconContainer size="lg">
              <CreditCard class="h-6 w-6" />
            </IconContainer>
          </div>
        `,
    }),
}