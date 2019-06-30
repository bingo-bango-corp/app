<template>
  <div class="JobChatView">
    <transition name="fade">
      <div class="loading" v-if="loading">
        <Spinner />
      </div>
      <div class="content" v-else>
        <JobCardWithActions
          class="JobCard"
          :title="job.thing"
          :description="job.description"
          :jobId="job.id"
          :tip="job.tip"
          :state="job.state"
          :job="job"
          :role="role"
          :collapsed="cardShouldBeCollapsed"
          @click.native="cardShouldBeCollapsed = !cardShouldBeCollapsed"
          @shouldGoToLoading="handleShouldGoToLoading()"
        />
        <Chat
          class="chat"
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
import { Job, JobRelationship } from '@/store/models/job'
import Spinner from '@/components/Spinner'
import JobCardWithActions from '@/components/JobCardWithActions'

@Component({
  components: {
    JobCard,
    Chat,
    Spinner,
    JobCardWithActions
  }
})
export default class JobChatView extends Vue {
  internallyLoading: boolean = false

  @Prop({
    type: Array,
  }) readonly actions!: BingoAction[] | undefined

  @Prop({
    type: Object,
    required: true,
  }) readonly job!: Job

  @Prop({
    type: String,
    required: true,
  }) readonly role!: JobRelationship

  @Prop({
    type: Boolean,
    default: false
  }) readonly forceLoading!: boolean

  cardShouldBeCollapsed: boolean = false

  get loading(): boolean {
    return this.forceLoading || this.internallyLoading || !this.job.state
      ? true
      : (!this.job)
  }

  handleShouldGoToLoading() {
    this.internallyLoading = true
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
