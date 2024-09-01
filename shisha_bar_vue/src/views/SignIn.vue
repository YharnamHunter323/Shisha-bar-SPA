<template>
    <!-- Formularul de autentificare -->
    <div>
        <h1>Sign In</h1>
        <div class="sign-form-wrapper">
        <form @submit.prevent="signIn">
            <!-- Câmpul pentru introducerea adresei de email -->
            <label for="email">Email:</label>
            <input type="email" id="email" autocomplete="email" v-model="email" required>

            <!-- Câmpul pentru introducerea parolei -->
            <label for="password">Password:</label>
            <input type="password" id="password" autocomplete="password" v-model="password" required>

            <!-- Butonul de autentificare -->
            <button type="submit">Sign In</button>
        </form>
      </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase.mjs'
import { useRouter } from 'vue-router'

export default {
  setup () {
    const email = ref('')
    const password = ref('')

    const router = useRouter()

    const signIn = async () => {
      try {
        // Autentificare utilizator
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
        console.log('user:', userCredential.user)
        console.log('signed:', auth.currentUser)
        router.push({ name: 'home' })
        // Redirecționare utilizator după autentificare reușită (gestionată de router)
      } catch (error) {
        console.error('Error signing in:', error.message)
      }
    }
    return { email, password, signIn }
  }
}
</script>

<style>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f5f5f5;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 5px;
  background-color: #fff;
  width: 300px;
}

label {
  font-weight: bold;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
}

.error {
  color: red;
  font-weight: bold;
}

button {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #36a375;
}

.sign-form-wrapper{
  display: flex;
  justify-content: center;
}
</style>
