<template>
  <div class="getThings">
    <div @click="$router.push('get-things/new')">New</div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Jobs from '@/classes/Jobs'
import { BingoButton } from 'simsalabim-design'

@Component({
  components: {
    BingoButton
  }
})
export default class getThings extends Vue {
  jobs = new Jobs
} 
</script>

<style scoped lang="sass" src="./getThings.sass">