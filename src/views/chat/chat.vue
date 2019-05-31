<template>
  <div class="home">
    <input type="text" ref="message" @change="typingHandler" />
    <button @click="sendMessage">send</button>
    <div class="messages">
      <div class="message" v-for="message in $store.state.chat.data.messages" :key="message.message">
        <img class="profilePicture" :src="getProfilePictureForUserID(message.uid)" />
        {{ `${message.displayName}: ${message.message}` }}
      </div>
    </div>
  </div>
</template>

<script>
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { arrayUnion, arrayRemove } from 'vuex-easy-firestore'
import { mapState } from 'vuex'

import firebase from 'firebase/app'
import 'firebase/functions'

const createChat = firebase.functions().httpsCallable('createChat')

@Component
export default class BottomNav extends Vue {
  async beforeCreate() {
    let chatId = this.$route.params.id
    if (!chatId) {
      const createChatRequest = await createChat({ userIDs: [
        this.$store.state.profile.data.uid,
        'GGCYpetMwYS9U1GLTf1jpemagCR2'
      ]})
      chatId = createChatRequest.data.chatId
    }
    await this.$store.dispatch('chat/openDBChannel', { chatId: chatId })
  }

  getProfilePictureForUserID(userID) {
    return this.$store.state.chat.data.users.filter(u => u.id === userID)[0].photoURL
  }

  typingHandler() {
    
  }

  sendMessage() {
    this.$store.dispatch('chat/patch', { messages: arrayUnion({
      uid: this.$store.state.profile.data.uid,
      displayName: this.$store.state.profile.data.displayName,
      message: this.$refs.message.value,
    })})
    this.$refs.message.value = ''
  }
}
</script>

<style scoped lang="sass" src="./chat.sass">