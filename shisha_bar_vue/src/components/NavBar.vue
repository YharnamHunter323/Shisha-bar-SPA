<template>
      <!-- Container pentru bara de navigare -->
      <div class="nav-container">
        <nav>
          <!-- Link-uri de navigare către diferite rute -->
          <router-link to="/">
            <span>Acasă</span>
          </router-link>
          <router-link to="/menu">
            <span>Meniu</span>
          </router-link>
          <router-link to="/reservation">
            <span>Reservări</span>
          </router-link>
          <router-link to="/about">
            <span>About Us</span>
          </router-link>
          <router-link to="/contact">
            <span>Contact</span>
          </router-link>
          <!-- Butonul de deconectare, vizibil doar dacă utilizatorul este autentificat -->
          <button v-if="isAuthenticated" id="logout-button" @click="logout">Logout</button>
        </nav>
      </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '@/firebase.mjs'

export default {
  setup () {
    // Referință reactivă pentru starea autentificării utilizatorului
    const isAuthenticated = ref(false)

    // Funcție pentru verificarea stării autentificării utilizatorului
    const checkAuthState = () => {
      onAuthStateChanged(auth, (user) => {
        isAuthenticated.value = !!user
      })
    }

    // Funcție pentru deconectarea utilizatorului
    const logout = async () => {
      try {
        await signOut(auth)
      } catch (error) {
        console.error('Error signing out:', error)
      }
    }

    // Verificarea stării autentificării când componenta este montată
    onMounted(checkAuthState)

    return {
      isAuthenticated,
      logout
    }
  }
}
</script>

<style >

</style>
