<template>
  <div class="reservation-page">
    <div class="form-group">
      <label for="party-size">Selectați numărul de persoane:</label>
      <select id="party-size" v-model="partySize" @change="updateDisabledDates()">
        <!-- Opțiuni pentru numărul de persoane -->
        <option value="1">1 persoană</option>
        <option value="2">2 persoane</option>
        <option value="3">3 persoane</option>
        <option value="4">4 persoane</option>
        <option value="5">5 persoane</option>
        <option value="6">6 persoane</option>
        <option value="7">7 persoane</option>
        <option value="8">8 persoane</option>
        <option value="9">9 persoane</option>
        <option value="10">10 persoane</option>
        <option value="11">11 persoane</option>
        <option value="12">12 persoane</option>
      </select>
    </div>
    <div class="form-group">
      <!-- Componenta DatePicker pentru selectarea datei și orei -->
      <DatePicker id="reservation-date" v-model="date"
      :disabled-dates="disabledDates"
      :rules="rules"
      :min-date="new Date()"
      :max-date="futureDate"
      mode="dateTime"
      is-required
      is24hr
      hide-time-header>
      <template #default="{ togglePopover }">
        <button @click="togglePopover" class="date-button">
          Selectați data și ora
        </button>
      </template>
      </DatePicker>
      <!-- Formular pentru trimiterea detaliilor rezervării -->
      <form @submit.prevent="submitForm">
        <input type="text" id="name" autocomplete="name" v-model="name" placeholder="Nume" required>
        <input type="tel" id="phone" autocomplete="tel" v-model="phone" placeholder="+40 000 000 000" required>
        <button type="submit">Trimite</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { db } from '@/firebase.mjs'
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore'
import { DatePicker } from 'v-calendar'

// reguli pentru componenta
const date = ref(new Date())
const futureDate = new Date()
futureDate.setMonth(futureDate.getMonth() + 6)
const rules = ref({
  hours: { min: 15, max: 21 },
  minutes: { interval: 30 }
})

// variabile
const name = ref('')
const phone = ref('')
const partySize = ref(5)
const disabledDates = ref([])
let tablesSnapshot = null

// Funcția pentru actualizarea datelor dezactivate în funcție de număeul de persoane
const updateDisabledDates = async () => {
  try {
    const tablesRef = collection(db, 'tables')
    const tablesQuery = query(tablesRef, where('capacity', '>=', parseInt(partySize.value)))
    tablesSnapshot = await getDocs(tablesQuery)
    const tableIds = tablesSnapshot.docs.map(doc => doc.id)

    // Query pentru datele cu mesele cu capacitate mai mare
    const reservationsQuery = query(collection(db, 'reservations'), where('table', 'in', tableIds))
    const reservationsSnapshot = await getDocs(reservationsQuery)

    // Map pentru a stoca numărul de rezervări pentru fiecare dată
    const reservationCounts = new Map()
    reservationsSnapshot.forEach((doc) => {
      const reservationDate = doc.data().dateTime.toDate().toDateString()
      const count = reservationCounts.get(reservationDate) || 0
      reservationCounts.set(reservationDate, count + 1)
    })

    // Filtrarea datelor unde toate mesele sunt rezervate
    const filteredDates = []
    reservationCounts.forEach((count, date) => {
      if (count === tableIds.length) {
        filteredDates.push(date)
      }
    })
    // Generarea array-ului disabledDates bazat pe datele rezervate
    disabledDates.value = filteredDates
  } catch (error) {
    console.error('Error updating disabled dates:', error)
  }
}

// Apelarea inițială a funcției updateDisabledDates când componenta este montată
updateDisabledDates()

// Funcția pentru trimiterea formularului de rezervare
const submitForm = async () => {
  // Verificarea dacă numele, telefonul și dimensiunea grupului sunt completate
  if (!name.value.trim() || !phone.value.trim() || !partySize.value) {
    alert('Completati toate câmpurile.')
    return
  }

  try {
    let closestTable = null
    let minDifference = Infinity

    tablesSnapshot.forEach(doc => {
      const tableCapacity = doc.data().capacity
      const difference = tableCapacity - partySize.value
      console.log('tableCapacity:', tableCapacity)
      console.log('difference:', difference)
      // Verificarea dacă masa curentă are o capacitate mai apropiată de dimensiunea grupului
      if (difference < minDifference) {
        closestTable = doc
        minDifference = difference
      }
    })

    // Construirea datelor pentru rezervare
    const reservationData = {
      name: name.value.trim(),
      phone: phone.value.trim(),
      partySize: parseInt(partySize.value),
      dateTime: date.value,
      table: closestTable.id
    }

    console.log('reserv data', reservationData)

    // Adăugarea rezervării în Firestore
    const reservationsCollection = collection(db, 'reservations')
    await addDoc(reservationsCollection, reservationData)

    // Ștergerea datelor din formular după trimiterea cu succes
    name.value = ''
    phone.value = ''
    partySize.value = 5

    alert('Rezervarea a fost efectuată cu succes!')
  } catch (error) {
    console.error('Error making reservation:', error)
    alert('A apărut o eroare la efectuarea rezervării. Vă rugăm să încerci din nou mai târziu.')
  }
}
</script>
