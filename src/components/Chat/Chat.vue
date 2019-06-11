<template>
  <div class="Chat">
    <div class="messages">
      <div class="message" v-for="message in messages" :key="message.id">
        {{ profileForUid(message.created_by).displayName }}
        {{ message.message }}
      </div>
    </div>
    <BingoInput v-model="messageText" />
    <button @click="sendMessage">send message</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import firebase from 'firebase/app'
import 'firebase/firestore'

import { BingoInput } from 'simsalabim-design'

import { Job } from '../../store/models/job';

@Component({
  components: {
    BingoInput
  }
})
export default class Chat extends Vue {
  messageText = ''
  otherPersonsPublicProfile: Job | null = null

  @Prop({
    type: Object,
    required: true
  }) readonly jobData!: Job

  async mounted() {
    this.$store.dispatch('chat/openDBChannel', {
      jobID: this.jobData.id
    })

    this.otherPersonsPublicProfile = (await firebase.firestore()
      .collection('users')
      .doc(this.jobData.owner.uid)
      .get()).data() as Job
  }

  get messages() {
    return this.$store.state.chat.data
  }

  get myProfile() {
    return this.$store.getters.publicProfile
  }

  profileForUid(uid: string) {
    return (uid === this.myProfile.uid)
      ? this.myProfile
      : this.otherPersonsPublicProfile
  }

  sendMessage() {
    this.$store.dispatch('chat/insert', {
      message: this.messageText
    })

    this.messageText = ''
  }
}
</script>

<style scoped lang="sass" src="./Chat.sass">
