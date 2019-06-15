<template>
  <div class="stub">
    <h2>{{ headline }}</h2>
    <p>{{ description }}</p>
    <BingoButton @clicked="pemFunction" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { BingoButton } from 'simsalabim-design'

@Component({
  components: {
    BingoButton
  }
})
export default class Stub extends Vue {
  @Prop({
    type: String,
    required: true
  }) private headline!: string

  @Prop({
    type: String,
    required: true
  }) private description!: string

  @Prop({
    type: Function,
    required: true
  }) private pemFunction!: Function
}
</script>

<style scoped lang="sass" src="./stub.sass">
