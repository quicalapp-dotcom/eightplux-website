const admin = require('firebase-admin');
const serviceAccount = require('../eightplux-63c05-firebase-adminsdk-fbsvc-52ac3517d5.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://eightplux-63c05-default-rtdb.firebaseio.com'
});

const db = admin.firestore();

async function initializeWorldHero() {
  try {
    const worldHeroRef = db.collection('world_sections').doc('world_hero');
    
    const existingDoc = await worldHeroRef.get();
    if (existingDoc.exists) {
      console.log('World hero section already exists');
      return;
    }

    const worldHeroData = {
      mediaUrl: '/whero.jpg',
      mediaType: 'image',
      isActive: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await worldHeroRef.set(worldHeroData);
    console.log('World hero section initialized successfully');

  } catch (error) {
    console.error('Error initializing world hero section:', error);
  } finally {
    process.exit();
  }
}

initializeWorldHero();
