import admin, {ServiceAccount} from 'firebase-admin'

// Replace this file with your service account key you get when setting up a firestore.
import serviceAccount from './serviceAccountKey.json'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
  databaseURL: "https://project-224740524041.firebaseio.com"
})

export default admin.firestore()
