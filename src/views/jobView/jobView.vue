<template>
  <div class="jobView">
    <JobCard class="jobCard"
      :title="data.thing"
      :jobId="data.id"
      :description="data.description"
      :actions="jobActions"
      :tip="{
        cents: data.tip.cents,
        currency: data.tip.currency
      }"
      :locale="$i18n.locale"
      :collapsed="false"
    />
    <Chat :jobData="data" iAm="owner" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { JobCard } from 'simsalabim-design'
import { subscribeToJob, unsubscribeFromJob } from '@/helpers/jobs'
import store from '@/store'
import { Route } from 'vue-router'
import { mapState } from 'vuex'

import Chat from '@/components/Chat'

@Component({
  computed: mapState('viewedJob', ['data']),
  components: {
    JobCard,
    Chat
  }
})
export default class jobView extends Vue {
  jobActions = [
    {
      title: '🚫 Cancel job',
      backgroundColor: '#EB5757',
      onClick: (event: any) => {
        event.event.stopPropagation()
      }
    },
  ]

  async mounted() {
    await subscribeToJob(this.$route.params.id)
  }

  async beforeDestroy() {
    await unsubscribeFromJob()
  }
}
</script>

<style scoped lang="sass" src="./jobView.sass">