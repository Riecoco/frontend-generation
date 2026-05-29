<template>
  <div class="inline-flex items-center gap-2">
    <MyText
        :text="`${label}:`"
        as="span"
        size="sm"
        weight="semibold"
        color="muted"
    />

    <MyText
        :text="value"
        as="span"
        size="sm"
        weight="medium"
        color="muted"
    />
  </div>
</template>

<script>
import MyText from "../../atoms/Text/Text.vue";

export default {
  name: "InfoRow",

  components: {
    MyText,
  },

  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
      required: true,
    },
  },
};
</script>