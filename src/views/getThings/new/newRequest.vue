<template>
  <div class="newRequest">
    <HeadlineContentPair
      headline="🍔 What do you want?"
      description="Type what you're requesting. It can be anything, as long as someone is willing to get it for you."
    >
      <BingoInput v-model="what" placeholder="Keep it simple and specific"/>
    </HeadlineContentPair>
    <HeadlineContentPair
      headline="🗺 Where do you want it?"
      description="Describe where you are. There will be a live chat later where you can give further details."
    >
      <BingoInput v-model="where" placeholder="Details like Doorbell name"/>
    </HeadlineContentPair>
    <HeadlineContentPair
      headline="How much do you want to tip?"
      description="Select your reward. This is on top of what the requested item costs. The more you tip, the faster someone will pick it up."
    >
      <RewardPicker class="rewardPicker" :rewards="rewards" v-model="selectedReward" />
    </HeadlineContentPair>
    <BingoButton class="submitButton" :disabled="buttonActive" @clicked="submit">
      🙏 Request it!
    </BingoButton>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Model } from 'vue-property-decorator'
import { createJob } from '@/helpers/jobs'
import { 
  BingoButton,
  HeadlineContentPair,
  BingoInput,
  RewardPicker,
  RewardList,
} from 'simsalabim-design'

import rewardConfig from './rewardConfig'

@Component({
  components: {
    BingoButton,
    HeadlineContentPair,
    BingoInput,
    RewardPicker
  }
})
export default class newRequest extends Vue {
  what: string = ''
  where: string = ''

  selectedReward: any = null

  rewardConfig: RewardList = rewardConfig;

  async mounted() {
    this.$store.dispatch('updateLocation')
  }

  get rewards(): RewardList {
    return this.rewardConfig;
  }

  get buttonActive(): boolean {
    return !(this.what !== '' && this.where !== '' && this.selectedReward !== null);
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
        tip: this.selectedReward.value
      }
    )
  }
} 
</script>

<style scoped lang="sass" src="./newRequest.sass">