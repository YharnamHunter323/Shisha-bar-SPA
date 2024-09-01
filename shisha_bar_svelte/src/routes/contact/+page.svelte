<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { db } from '../../firebase';
  import { addDoc, collection, getDocs } from 'firebase/firestore';

  let name = '';
  let phone = '';
  let message = '';
  let error = null;

  // Funcție pentru trimiterea formularului
  const submitForm = async () => {
    try {
      if (!name || !phone || !message) {
        throw new Error('All fields are required');
      }

      // Adăugare datelor formularului în colecția 'contacts' din Firestore
      await addDoc(collection(db, 'contacts'), {
        name,
        phone,
        message,
        time: new Date()
      });

      console.log('Form:',name, phone, message);

      // Ștergere câmpuri formular după trimiterea reușită
      name = '';
      phone = '';
      message = '';

      console.log('Form submitted successfully!');
    } catch (err) {
      console.error('Error submitting form:', err);
      error = err;
    }
  };

</script>
  
<main class="content">
  <!-- Container pentru detaliile de contact -->
  <div class="contact-details-container">
    <div class="contact-section">
      <h2>Contact Us</h2>

      <div class="address-working-hours">
        <!-- Adresa de contact -->
        <div class="contact-address">
          <p>Adresa:</p>
          <p>Shisha Bar, Strada Baia de Fier 8, București 030167</p>
        </div>
        <!-- Orele de funcționare -->
        <div class="business-hours">
          <p>Program:</p>
          <p>Luni - Joi: 17:00 - 23:00</p>
          <p>Vineri - Duminică: 16:00 - 2:00</p>
        </div>
      </div>

      <!-- Informații de contact -->
      <div class="contact-info">
        <p>Email: info@shishabar.com</p>
        <p>Phone: +1234567890</p>
      </div>
      <!-- Social media -->
      <div class="social-icons">
        <!-- svelte-ignore a11y-missing-content -->
        <a href="https://www.facebook.com/" target="_blank" class="icon-facebook"></a>
        <!-- svelte-ignore a11y-missing-content -->
        <a href="https://www.instagram.com/YourInstagramPage" target="_blank" class="icon-instagram"></a>
      </div>

      <!-- Formularul de contact -->
      <section class="contact-form">
        <h3>Get in Touch</h3>
        <form on:submit|preventDefault={submitForm}>
          <input type="text" id="name" autocomplete="name" bind:value={name} placeholder="Nume" required>
          <input type="tel" id="phone" autocomplete="tel" bind:value={phone} placeholder="Phone" required>
          <textarea bind:value={message} id="text" placeholder="Mesaj" required></textarea>
          <button type="submit">Trimite</button>
        </form>
      </section>
    </div>
  </div>

  <!-- Hartă -->
  <div class="map-container">
    <!-- svelte-ignore a11y-missing-attribute -->
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d448.71591937445527!2d26.10659195934168!3d44.42972202276184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1ff2d925932f9%3A0xec423645e7263e4f!2sPamfi%20Jina%20SRL!5e0!3m2!1sen!2sro!4v1702723492756!5m2!1sen!2sro"
      class="map-section"
      allowfullscreen="true"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
</main>
  
<style lang="scss">
  @import "src/lib/styles/contact.scss";
</style>
  