<template>
  <div class="getThings">
    <BingoButton class="newRequestButton" @clicked="handleNewClick">{{ $t('getThings.newRequest') }}</BingoButton>
    <div class="yourJobs">
      <JobListView :loading="loading">
        <div class="job" v-for="(job, index) in myJobs" :key="index">
          <JobCard class="jobCard"
            :title="job.thing"
            :description="job.description"
            :actions="null"
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
import Jobs, { JobList } from '@/classes/Jobs'
import JobListView from '@/components/JobListView'
import { BingoButton, JobCard } from 'simsalabim-design'

@Component({
  components: {
    BingoButton,
    JobCard,
    JobListView
  }
})
export default class getThings extends Vue {
  jobs = new Jobs
  myJobs: JobList = []
  loading: boolean = true

  handleNewClick() {
    this.$router.push('get-things/new')
  }

  async mounted() {
    this.loading = true
    this.myJobs = await this.jobs.getOwn()
    this.loading = false
  }
} 
</script>

<style scoped lang="sass" src="./getThings.sass">