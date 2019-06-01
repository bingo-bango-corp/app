<template>
  <div class="home">
    <input type="text" ref="message" />
    <button @click="sendMessage">send</button>
    <div class="messages">
      <div class="message" v-for="(message, index) in chat.chatMessages" :key="index">
        <img class="profilePicture" :src="chat.getUserFromId(message.uid).photoURL" />
        {{ `${message.displayName}: ${message.message}` }}
      </div>
    </div>
  </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
import Chat, { ChatUser } from '@/classes/Chat'

@Component
export default class BottomNav extends Vue {
  chat = new Chat()

  async mounted() {
    let otherUser = this.$route.params.id
    await this.chat.create([
      otherUser, 
      this.$store.state.profile.data.uid
    ])
  }

  sendMessage() {
    this.chat.sendMessage(this.$refs.message.value)
    this.$refs.message.value = ''
  }
}
</script>

<style scoped lang="sass" src="./chat.sass">