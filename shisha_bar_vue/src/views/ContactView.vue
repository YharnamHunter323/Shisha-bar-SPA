<template>

    <main class="content">
        <!-- Container pentru detaliile de contact -->
        <div class="contact-details-container">

            <div class="contact-section">

                <h2>Contact Us</h2>

                <div class="address-working-hours">
                    <!-- Adresa de contact -->
                    <div class="contact-address">

                        <p>Adresa:</p>
                        <p> Shisha Bar,Strada Baia de Fier 8, București 030167</p>

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

                    <a href="https://www.facebook.com/" target="_blank" class="icon-facebook"></a>
                    <a href="https://www.instagram.com/YourInstagramPage" target="_blank" class="icon-instagram"></a>

                </div>

                <!-- Formularul de contact -->
                <section class="contact-form">

                    <h3>Get in Touch</h3>
                    <form @submit.prevent="submitForm">
                        <input type="text" id="name" autocomplete="name" v-model="name" placeholder="Nume" required>
                        <input type="email" id="email" autocomplete="email" v-model="email" placeholder="Email" required>
                        <textarea v-model="message" id="text" placeholder="Mesaj" required></textarea>
                        <button type="submit">Trimite</button>
                    </form>

                </section>
            </div>
        </div>

        <!-- Hartă -->
        <div class="map-container">

            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d448.
            71591937445527!2d26.10659195934168!3d44.
            42972202276184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.
            1!3m3!1m2!1s0x40b1ff2d925932f9%3A0xec423645e7263e4f!2s
            Pamfi%20Jina%20SRL!5e0!3m2!1sen!2sro!4v1702723492756!5m2!1sen!2sro" class="map-section" allowfullscreen="true" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>

        </div>
    </main>
</template>

<script>
import { ref } from 'vue'
import { db } from '@/firebase.mjs'
import { addDoc, collection } from 'firebase/firestore'

export default {
  setup () {
    // Definirea variabilelor reactive pentru nume, email, mesaj și timp
    const name = ref('')
    const email = ref('')
    const message = ref('')
    const time = ref(new Date())

    // Funcția pentru trimiterea formularului
    const submitForm = async () => {
      try {
        // Adaugarea datelor formularului în colecția 'contacts' din Firestore
        await addDoc(collection(db, 'contacts'), {
          name: name.value,
          email: email.value,
          message: message.value,
          time: time.value
        })

        // Golirea câmpurilor formularului după trimiterea cu succes
        name.value = ''
        email.value = ''
        message.value = ''
        time.value = new Date()
      } catch (error) {
        console.error('Error submitting form:', error)
      }
    }

    // Returnarea variabilelor și a funcției pentru a fii utilizate în template
    return {
      name,
      email,
      message,
      time,
      submitForm
    }
  }
}
</script>
