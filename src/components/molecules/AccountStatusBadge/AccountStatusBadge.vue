<template>
  <Badge
      :variant="statusConfig.variant"
      size="large"
  >
    <component :is="statusConfig.icon" />
    {{ statusConfig.label }}
  </Badge>
</template>

<script setup>
import { computed } from "vue";
import { CircleCheck, CircleX, CirclePause } from "lucide-vue-next";
import Badge from "../../atoms/Badge/Badge.vue";

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) =>
        ["ACTIVE", "CLOSED", "FROZEN"].includes(value),
  },
});

const statusMap = {
  ACTIVE: {
    label: "Active",
    variant: "success",
    icon: CircleCheck,
  },
  FROZEN: {
    label: "Frozen",
    variant: "warning",
    icon: CirclePause,
  },
  CLOSED: {
    label: "Closed",
    variant: "secondary",
    icon: CircleX,
  },
};

const statusConfig = computed(() => statusMap[props.status]);
</script>