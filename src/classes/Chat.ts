import firebase from 'firebase/app'
import 'firebase/functions'
import store from '@/store'

import { arrayUnion, arrayRemove } from 'vuex-easy-firestore'

const createChat = firebase.functions().httpsCallable('createChat')


export type ChatUserIDs = [string, string]


export interface ChatUser {
  displayName: string
  email: string
  id: string
  phoneNumber?: string
  photoUrl?: URL
}


export default class Chat {
  myUid: string
  chatId: string | null
  myDisplayName: string

  constructor() {
    if (!store.state.chat) throw new Error('Chat module has not been initialized.')
    if (!store.state.profile.data.uid) throw new Error('No user profile found.')

    this.myUid = store.state.profile.data.uid
    this.myDisplayName = store.state.profile.data.displayName
    this.chatId = null
  }

  public async create(users: ChatUserIDs): Promise<void> {
    const chatId = await this.newChat(users)
    this.initializeChatStore(chatId)
  }

  public initializeChatStore(id: string): void {
    store.dispatch('chat/openDBChannel', { chatId: id })
  }

  public sendMessage(message: string): void {
    store.dispatch('chat/patch', { messages: arrayUnion({
      uid: this.myUid,
      displayName: this.myDisplayName,
      message: message,
    })})
  }

  set typing(typing: boolean) {
    if (typing === true) {
      store.dispatch('chat/patch', {
        typing: arrayUnion(this.myUid)
      })
    } else {
      store.dispatch('chat/patch', {
        typing: arrayRemove(this.myUid)
      })
    }
  }
  
  public getUserFromId(id: string): ChatUser {
    return store.state.chat.data.users.filter((u: ChatUser) => u.id === this.myUid)[0]
  }

  get otherUser(): ChatUser {
    return store.state.chat.data.users.filter((u: ChatUser) => u.id != this.myUid)[0]
  }

  get chatMessages(): object[] {
    return store.state.chat.data.messages
  }

  private async newChat(users: ChatUserIDs): Promise<string> {
    console.log('creating chat with', users)
    const createChatRequest = await createChat({userIDs: users})
    return createChatRequest.data.chatId
  }
}