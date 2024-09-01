<script>
  // Importarea modulelor și funcțiilor necesare
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { db }  from '../../firebase';  
  import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
  import { DatePicker } from "@svelte-plugins/datepicker";
  
  // Variabile pentru setările componentei
  let date = new Date();
  let futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + 6);
  let isOpen = false;
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 6);

  // Variabile pentru datele utilizatorului
  let name = '';
  let phone = '';
  let partySize = 1;
  let disabledDates = [];
  let tablesSnapshot = null;

   // Variabile pentru selectarea orei
  let hours = Array.from({ length: 7 }, (_, i) => 15 + i); // Orele de la 15 la 21
  let minutes = ["00", "30"]; // Minute: 00 și 30
  let selectedTime = '15:00'; // Ora selectată implicit
  
  
  // Funcție pentru gestionarea selecției orei
  function handleTimeSelection() {
    // Actualizarea variabilei de dată cu data și ora selectată
    const [selectedHour, selectedMinute] = selectedTime.split(":");

    date.setHours(parseInt(selectedHour), parseInt(selectedMinute));
    // Utilizarea datei și orei selectate pentru procesare sau actualizarea stării
  }

  // Funcție toggle pentru afișărea selectorului de dată
  const toggleDatePicker = () => (isOpen = !isOpen);

  // Funcție pentru gestionarea selectării unei zile în calendar    
  const handleDayClick = (day) => {
  date = new Date(day.startDate);
  handleTimeSelection();
  };

  // Funcție pentru obținerea unei date formatate
  function getFormattedDate(date) {
      var year = date.getFullYear();

      var month = (1 + date.getMonth()).toString();
      month = month.length > 1 ? month : '0' + month;

      var day = date.getDate().toString();
      day = day.length > 1 ? day : '0' + day;

      return month + '/' + day + '/' + year;
  }

  // Funcție pentru actualizarea datelor selectate
  const updateDisabledDates = async () => {
    try {
      const tablesRef = collection(db, 'tables');
      const tablesQuery = query(tablesRef, where('capacity', '>=', parseInt(partySize)));
      tablesSnapshot = await getDocs(tablesQuery);
      const tableIds = tablesSnapshot.docs.map(doc => doc.id);

      const reservationsQuery = query(collection(db, 'reservations'), where('table', 'in', tableIds));
      const reservationsSnapshot = await getDocs(reservationsQuery);

      const reservationCounts = new Map();
      reservationsSnapshot.forEach(doc => {
        const reservationDate = getFormattedDate(doc.data().dateTime.toDate());
        const count = reservationCounts.get(reservationDate) || 0;
        reservationCounts.set(reservationDate, count + 1);
      });

      

      const filteredDates = [];
      reservationCounts.forEach((count, date) => {
        if (count === tableIds.length) {
          filteredDates.push(date);
        }
      });
      // console.log("Selected date :", date);
      // console.log("Max date:",  maxDate);
      // console.log("comparison:",  date > maxDate);
      // console.log("filtred:",  filteredDates);
      disabledDates = filteredDates;
      
    } catch (error) {
      console.error('Error updating disabled dates:', error);
    }
  };

  onMount(() => {
    updateDisabledDates();
  });

  // Funcție pentru trimiterea formularului
  const submitForm = async () => {
    if (!name.trim() || !phone.trim() || !partySize) {
      alert('Completati toate câmpurile.');
      return;
    }

    try {
      let closestTable = null;
      let minDifference = Infinity;

      tablesSnapshot.forEach(doc => {
        const tableCapacity = doc.data().capacity;
        const difference = tableCapacity - partySize;
        if (difference < minDifference) {
          closestTable = doc;
          minDifference = difference;
        }
      });

      const reservationData = {
        name: name.trim(),
        phone: phone.trim(),
        partySize: parseInt(partySize),
        dateTime: date,
        table: closestTable.id
      };
      
      console.log('reserv data', reservationData)

      const reservationsCollection = collection(db, 'reservations');
      await addDoc(reservationsCollection, reservationData);

      name = '';
      phone = '';
      partySize = 5;

      alert('Rezervarea a fost efectuată cu succes!');
    } catch (error) {
      console.error('Error making reservation:', error);
      alert('A apărut o eroare la efectuarea rezervării. Vă rugăm să încerci din nou mai târziu.');
    }
  };
</script>

<!-- Structura paginii pentru efectuarea unei rezervări -->
<div class="reservation-page">
  <!-- Selectarea numărului de persoane -->
    <div class="form-group">
      <label for="party-size">Selectați numărul de persoane:</label>
      <select id="party-size" bind:value={partySize} on:change={updateDisabledDates}>
        {#each Array.from({ length: 12 }, (_, i) => i + 1) as size}
        <option value={size}>{size} {size > 1 ? 'persoane' : 'persoană'}</option>
        {/each}
      </select>
    </div>
     <!-- Selectarea datei și orei rezervării -->
    <div class="form-group">
      <label for="reservation-date">Selectati data si ora:</label>
      <div>
      <DatePicker id="reservation-date" 
        {disabledDates}
        bind:isOpen
        enableFutureDates={true}
        enablePastDates={false}
        align={'center'}
        onDayClick={handleDayClick}
        >
        <!-- Buton pentru afișarea/ascunderea selectorului de dată -->
        <button on:click={toggleDatePicker} class="date-button">
          Selectați data și ora
        </button>
      </DatePicker>
      <!-- Selector pentru alegerea orei -->
      <select bind:value={selectedTime} on:change={handleTimeSelection}>
        {#each hours as hour}
          {#each minutes as minute}
            <option value={hour + ":" + minute}>{hour}:{minute}</option>
          {/each}
        {/each}
      </select>

      </div>
    </div>
    <!-- Formularul pentru introducerea numelui și numărului de telefon -->
    <form on:submit|preventDefault={submitForm}>
      <input type="text" id="name" autocomplete="name" bind:value={name} placeholder="Nume" required>
      <input type="tel" id="phone" autocomplete="tel" bind:value={phone} placeholder="+40 000 000 000" required>
      <button type="submit">Trimite</button>
    </form>
</div>
  
<style lang="scss">
  @import "src/lib/styles/reservations.scss";
</style>
  