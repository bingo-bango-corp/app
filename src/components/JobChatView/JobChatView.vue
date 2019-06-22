<template>
  <div class="JobChatView">
    <transition name="fade">
      <div class="loading" v-if="loading">
        <Spinner />
      </div>
      <div class="content" v-else>
        <JobCard class="jobCard"
          :title="job.thing"
          :jobId="job.id"
          :description="job.description"
          :actions="actions"
          :tip="{
            cents: job.tip.cents,
            currency: job.tip.currency
          }"
          :locale="$i18n.locale"
          :collapsed="cardShouldBeCollapsed"
          @click.native="scrollChatToTop"
          @actionClicked="$emit('actionClicked')"
        />
        <Chat 
          :jobData="job"
          :iAm="iAmAn"
          @scrollStatus="handleScrollUpdate"
        />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { JobCard, BingoAction } from 'simsalabim-design'
import Chat from '@/components/Chat'
import { Job } from '@/store/models/job'
import Spinner from '@/components/Spinner'

@Component({
  components: {
    JobCard,
    Chat,
    Spinner
  }
})
export default class JobChatView extends Vue {
  @Prop({
    type: Array,
  }) readonly actions!: BingoAction[] | undefined

  @Prop({
    type: Object,
    required: true,
  }) readonly job!: Job

  @Prop({
    type: Boolean,
    default: false
  }) readonly forceLoading!: boolean

  cardShouldBeCollapsed: boolean = false

  get loading(): boolean {
    return this.forceLoading
      ? true
      : (!this.job)
  }

  get iAmAn(): 'owner' | 'assignee' {
    const myUid = this.$store.getters.publicProfile.uid
    const jobOwnerUid = this.job.owner.uid

    return myUid === jobOwnerUid
      ? 'owner'
      : 'assignee'
  }

  handleScrollUpdate(scrollStatus: boolean): void {
    this.cardShouldBeCollapsed = !scrollStatus
  }

  scrollChatToTop(): void {
    this.cardShouldBeCollapsed = !this.cardShouldBeCollapsed
  }
}
</script>

<style scoped lang="sass" src="./JobChatView.sass" />
