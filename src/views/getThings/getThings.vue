<template>
  <div class="home">
    getThings!
  </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
import Jobs from '@/classes/Jobs'

@Component
export default class makeMoney extends Vue {
  jobs = new Jobs

  mounted() {
    this.jobs.new(52.540717, 13.353449, {
      description: 'test job',
      thing: 'a test thing',
      tip: {
        cents: 1000,
        currency: 'EUR'
      }
    })
  }
} 
</script>

<style scoped lang="sass" src="./getThings.sass">