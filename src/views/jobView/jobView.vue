<template>
  <div class="jobView" v-if="job">
    <JobChatView
      :actions="jobActions"
      :job="job"
      :forceLoading="forceLoading"
      role="owner"
      @actionClicked="handleActionClicked"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { subscribeToJob, unsubscribeFromJob, cancelJob } from '@/helpers/jobs'
import store from '@/store'
import { Route } from 'vue-router'
import { mapState } from 'vuex'

import JobChatView from '@/components/JobChatView'

@Component({
  components: {
    JobChatView
  }
})
export default class jobView extends Vue {
  forceLoading: boolean = false

  jobActions = [
    {
      title: '🚫 Cancel job',
      backgroundColor: '#EB5757',
      onClick: (event: any) => {
        event.event.stopPropagation()
        this.cancelJob()
      }
    },
  ]

  get job() {
    return this.$store.getters['myJobs/specificJob'](this.$route.params.id)
  }

  async cancelJob() {
    await cancelJob(this.$route.params.id, this.$store.getters.uid)
    this.$router.push('/get-things')
  }

  handleActionClicked(): void {
    this.forceLoading = true
  }
}
</script>

<style scoped lang="sass" src="./jobView.sass">