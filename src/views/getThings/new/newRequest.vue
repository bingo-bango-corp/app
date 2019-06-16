<template>
  <div class="newRequest">
    <HeadlineContentPair
      headline="🍔 What do you want?"
      description=""
    >
      <BingoInput v-model="what" placeholder="Keep it simple and specific"/>
    </HeadlineContentPair>
    <HeadlineContentPair
      headline="🗺 Where do you want it?"
      description=""
    >
      <BingoInput v-model="where" placeholder="Details like Doorbell name"/>
    </HeadlineContentPair>
    <HeadlineContentPair
      headline="How much do you want to tip?"
      description=""
    >
      <BingoInput type="number" v-model="tip" placeholder="Enter amount of tip in Euro"/>
    </HeadlineContentPair>
    <BingoButton @clicked="submit">submit</BingoButton>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Model } from 'vue-property-decorator'
import { createJob } from '@/helpers/jobs'
import { BingoButton, HeadlineContentPair, BingoInput } from 'simsalabim-design'

@Component({
  components: {
    BingoButton,
    HeadlineContentPair,
    BingoInput
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