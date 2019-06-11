<template>
  <div class="newRequest">
    <input type="text" v-model="what" placeholder="what do u want"/>
    <input type="text" v-model="where" placeholder="where u want it"/>
    <input type="number" v-model="tip" placeholder="how much € u wanna tip"/>
    <BingoButton @clicked="submit">submit</BingoButton>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Model } from 'vue-property-decorator'
import { createJob } from '@/helpers/jobs'
import { BingoButton } from 'simsalabim-design'

@Component({
  components: {
    BingoButton
  }
})
export default class newRequest extends Vue {
  what: string = ''
  where: string = ''
  tip: number | null = null

  async mounted() {
    this.$store.dispatch('updateLocation')
  }

  async submit() {
    const location = this.$store.getters.currentLocation

    await createJob(
      this.$store.getters.uid,
      location[0], 
      location[1], 
      {
        description:this.where,
        thing: this.what,
        tip: {
          cents: this.tip! * 100,
          currency: 'EUR'
        }
      }
    )

    this.where = ''
    this.what = ''
    this.tip = null
  }
} 
</script>

<style scoped lang="sass" src="./newRequest.sass">