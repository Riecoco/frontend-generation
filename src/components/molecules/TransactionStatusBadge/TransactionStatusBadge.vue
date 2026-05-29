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
import { CircleCheck, CircleX, Clock } from "lucide-vue-next";
import Badge from "../../atoms/Badge/Badge.vue";

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) =>
        ["PENDING", "COMPLETED", "FAILED"].includes(value),
  },
});

const statusMap = {
  PENDING: {
    label: "Pending",
    variant: "warning",
    icon: Clock,
  },
  COMPLETED: {
    label: "Completed",
    variant: "success",
    icon: CircleCheck,
  },
  FAILED: {
    label: "Failed",
    variant: "danger",
    icon: CircleX,
  },
};

const statusConfig = computed(() => statusMap[props.status]);
</script>