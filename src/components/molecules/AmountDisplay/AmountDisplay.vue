<template>
  <MyText
      :text="formattedAmount"
      as="span"
      :size="size"
      :weight="weight"
      :color="color"
  />
</template>

<script>
import MyText from "../../atoms/Text/Text.vue";

export default {
  name: "AmountDisplay",

  components: {
    MyText,
  },

  props: {
    amount: {
      type: [Number, String],
      required: true,
    },
    currency: {
      type: String,
      default: "EUR",
    },
    locale: {
      type: String,
      default: "nl-NL",
    },
    size: {
      type: String,
      default: "base",
    },
    weight: {
      type: String,
      default: "semibold",
    },
    color: {
      type: String,
      default: "default",
    },
  },

  computed: {
    formattedAmount() {
      const numericAmount = Number(this.amount);

      if (Number.isNaN(numericAmount)) {
        return String(this.amount);
      }

      return new Intl.NumberFormat(this.locale, {
        style: "currency",
        currency: this.currency,
      }).format(numericAmount);
    },
  },
};
</script>