<template>
  <button type="button" :class="classes" @click="onClick" :style="style">
    {{ label }}
  </button>
</template>

<script>
import { computed, reactive } from "vue";

export default {
  name: "my-button",

  props: {
    label: {
      type: String,
      required: true,
    },
    primary: {
      type: Boolean,
      default: false,
    },
    variant: {
      type: String,
      default: null,
      validator: function (value) {
        return (
            value === null ||
            ["default", "destructive", "outline", "secondary", "ghost", "link"].includes(value)
        );
      },
    },
    size: {
      type: String,
      validator: function (value) {
        return ["small", "medium", "large"].indexOf(value) !== -1;
      },
    },
    backgroundColor: {
      type: String,
    },
  },

  emits: ["click"],

  setup(props, { emit }) {
    props = reactive(props);
    return {
      classes: computed(() => {
        const baseClasses =
            "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50";

        const figmaVariantClasses = {
          default: "bg-primary text-primary-foreground hover:bg-primary/90",
          destructive: "bg-destructive text-white hover:bg-destructive/90",
          outline: "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
          secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          ghost: "hover:bg-accent hover:text-accent-foreground",
          link: "text-primary underline-offset-4 hover:underline",
        };

        const legacyVariantClasses = props.primary
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-transparent text-foreground ring-1 ring-border hover:bg-accent hover:text-accent-foreground";

        const variantClasses = props.variant
            ? figmaVariantClasses[props.variant]
            : legacyVariantClasses;

        const sizeClasses = {
          small: "h-9 px-4 text-sm",
          medium: "h-11 px-6 py-2 text-sm",
          large: "h-12 px-8 text-base",
        };

        const size = props.size || "medium";

        return `${baseClasses} ${variantClasses} ${sizeClasses[size]}`;
      }),
      style: computed(() => ({
        backgroundColor: props.backgroundColor,
      })),
      onClick() {
        emit("click");
      },
    };
  },
};
</script>

