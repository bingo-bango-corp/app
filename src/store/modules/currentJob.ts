import firebase from 'firebase/app'
import 'firebase/firestore'

const myJobs = {
  firestorePath: 'jobs/{jobID}',
  firestoreRefType: 'doc',
  moduleName: 'currentJob',
  statePropName: 'data',
  namespaced: true,
  sync: {
    preventInitialDocInsertion: true
  },
  getters: {
    job(state: any) {
      return state.data
    },
    ownerPictureUrl(state: any) {
      return state.ownerPictureUrl
    }
  },
  mutations: {
    writeOwnerPictureUrl(state: any, payload: string) {
      state.ownerPictureUrl = payload
    }
  },
  actions: {
    async setOwnerPictureUrl(context: any, uid: string) {
      if (!context.state.ownerPictureUrl) {
        const db = firebase.firestore()

        const ownerProfile = (await db
          .collection('users')
          .doc(uid)
          .get()).data()

        context.commit(
          'writeOwnerPictureUrl',
          ownerProfile!.photoURL
        )
      }
    }
  },
  serverChange: {
    async modifiedHook(updateStore: any, doc: any, id: any, store: any) {
      await store.dispatch('currentJob/setOwnerPictureUrl', doc.owner.uid)
      updateStore(doc)
    }
  }
}

export default myJobs