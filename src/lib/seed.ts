import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const seedData = {
  stocks: [
    {
      name: 'AAPL',
      price: 150.00,
      change: 1.25,
      movement: 'up',
    },
    {
      name: 'GOOGL',
      price: 2800.00,
      change: -0.75,
      movement: 'down',
    },
    {
      name: 'TSLA',
      price: 700.00,
      change: 2.50,
      movement: 'up',
    },
  ],
};

export const seedWatchlist = async () => {
  try {
    await setDoc(doc(db, 'watchlist/user-default'), seedData);
    console.log('Watchlist data seeded successfully!');
  } catch (error) {
    console.error('Error seeding watchlist data:', error);
  }
};
