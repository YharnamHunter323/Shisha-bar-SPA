// Importarea modulelor necesare
import { faker } from '@faker-js/faker';
import { db }  from './src/firebase.mjs';
import { addDoc, collection } from 'firebase/firestore';

// Funcția pentru generarea unei rezervări aleatorii
const generateReservation = () => {
  // Generarea datelor false pentru rezervare
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 3);

  // Generarea unei date aleatoare în intervalul specificat
  const dateTime = faker.date.between({from: startDate, to: endDate});
  const partySize = faker.number.int({ min: 1, max: 12 });
  const table = `table${faker.number.int({ min: 1, max: 12 })}`; //  12 mese
  const name = faker.person.fullName();
  const phone = faker.helpers.fromRegExp(/ +40 7[0-9]{2} [0-9]{3} [0-9]{3} /);
  console.log('name', name);
  console.log('phone', phone);
  
  return { dateTime, table, partySize, name, phone};
};

// Funcția pentru adăugarea unei rezervări în baza de date Firestore
const addReservationToDatabase = async () => {
  // Generarea unei rezervări aleatoare
  const reservationData = generateReservation();
  
  try {
    // Adăugarea rezervării în baza de date
    const docRef = await addDoc(collection(db, 'reservations'), reservationData);
    console.log('Reservation added with ID:', docRef.id);
  } catch (error) {
    console.error('Error adding reservation:', error);
  }
  
};

// Generarea și adăugarea a mai multor rezervări
const numberOfReservations = 100; // Specificare numărul de rezervări de generat
for (let i = 0; i < numberOfReservations; i++) {
  addReservationToDatabase();
}
