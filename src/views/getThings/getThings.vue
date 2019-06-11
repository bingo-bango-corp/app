<template>
  <div class="getThings">
    <BingoButton class="newRequestButton" @clicked="handleNewClick">{{ $t('getThings.newRequest') }}</BingoButton>
    <div class="yourJobs">
      <JobListView :loading="loading">
        <div class="job" v-for="(job, key) in myJobs" :key="key">
          <JobCard class="jobCard"
            :title="job.thing"
            :jobId="key"
            :description="job.description"
            :actions="actions"
            :tip="{
              cents: job.tip.cents,
              currency: job.tip.currency
            }"
            :collapsed="false"
            :elevated="false"
            :locale="$i18n.locale"
          />
        </div>
      </JobListView>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { getOwnJobs, JobList } from '@/helpers/jobs'
import JobListView from '@/components/JobListView'
import router from '@/router'
import { BingoButton, JobCard } from 'simsalabim-design'

@Component({
  components: {
    BingoButton,
    JobCard,
    JobListView
  }
})
export default class getThings extends Vue {
  myJobs: JobList = {}
  loading: boolean = true

  actions = [
    {
      title: '💬 Go to chat',
      backgroundColor: 'var(--secondary)',
      onClick: (event: any) => {
        event.event.stopPropagation()
        router.push(`/get-things/${event.meta.jobId}`)
      }
    },
  ]

  handleNewClick() {
    this.$router.push('get-things/new')
  }

  async mounted() {
    this.loading = true
    this.myJobs = await getOwnJobs(this.$store.getters.uid)
    this.loading = false
  }
} 
</script>

<style scoped lang="sass" src="./getThings.sass">