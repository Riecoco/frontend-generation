import IconIndicator from "./IconIndicator.vue";

export default {
    title: "Atoms/IconIndicator",
    component: IconIndicator,
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: { type: "select" },
            options: ["positive", "negative", "neutral"],
        },
    },
    args: {
        variant: "negative",
    },
    render: (args) => ({
        components: { IconIndicator },
        setup() {
            return { args };
        },
        template: `
          <IconIndicator :variant="args.variant" />
        `,
    }),
};

export const Negative = {
    args: {
        variant: "negative",
    },
};

export const Positive = {
    args: {
        variant: "positive",
    },
};

export const Neutral = {
    args: {
        variant: "neutral",
    },
};

export const AllVariants = {
    render: () => ({
        components: { IconIndicator },
        template: `
          <div class="flex items-center gap-4">
            <IconIndicator variant="negative" />
            <IconIndicator variant="positive" />
            <IconIndicator variant="neutral" />
          </div>
        `,
    }),
};