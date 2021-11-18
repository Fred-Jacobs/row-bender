<template>
  <div @dragover.prevent @drop="dropFile">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FileDrop',
  props: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fileDrop: {type: Function , default: (s: string) => true}
  },
  methods:{
    dropFile: function(e: DragEvent) {
      e.preventDefault()
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      e.dataTransfer?.files[0].text().then(s => this.fileDrop(s))
    },
  },
  setup() {
    return {

    }
  },
})
</script>
