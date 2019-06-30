<template>
  <div class="jobView">
    <JobChatView
      :actions="jobActions"
      :job="data"
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
  computed: mapState('viewedJob', ['data']),
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

  async cancelJob() {
    await cancelJob(this.$route.params.id, this.$store.getters.uid)
    this.$router.push('/get-things')
  }

  handleActionClicked(): void {
    this.forceLoading = true
  }

  async beforeCreate() {
    await subscribeToJob(this.$route.params.id)
  }

  async beforeDestroy() {
    await unsubscribeFromJob()
  }
}
</script>

<style scoped lang="sass" src="./jobView.sass">