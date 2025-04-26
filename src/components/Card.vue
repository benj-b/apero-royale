<template>
  <div class="card">
    <div class="card-value" :class="colorClass">{{ valueLabel }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'CardComponent',
  props: {
    value: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const colorClass = computed(() => (props.color === 'noir' ? 'black' : 'red'))
    const valueLabel = computed(() => {
      switch (props.value) {
        case 1:
          return 'A'
        case 11:
          return 'J'
        case 12:
          return 'Q'
        case 13:
          return 'K'
        default:
          return props.value.toString()
      }
    })

    return {
      colorClass,
      valueLabel,
    }
  },
})
</script>

<style scoped>
.card {
  width: 80px;
  height: 120px;
  border-radius: 8px;
  border: 2px solid #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  background-color: #fff;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.card-value {
  text-align: center;
}

.card-value.black {
  color: black;
}

.card-value.red {
  color: red;
}
</style>
