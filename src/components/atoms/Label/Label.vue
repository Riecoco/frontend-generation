<template>
  <label
      data-slot="label"
      :for="htmlFor"
      :class="classes"
  >
    {{ label }}
  </label>
</template>

<script>
import { computed } from "vue";

export default {
  name: "my-label",

  props: {
    label: {
      type: String,
      required: true,
    },
    htmlFor: {
      type: String,
      default: null,
    },
  },

  setup() {
    const classes = computed(() => {
      const baseClasses =
          "flex items-center gap-2 text-sm leading-none font-medium select-none";

      const stateClasses =
          "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50";

      return `${baseClasses} ${stateClasses}`;
    });

    return {
      classes,
    };
  },
};
</script>