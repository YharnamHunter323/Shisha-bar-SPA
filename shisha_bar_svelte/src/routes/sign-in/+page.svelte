<script>
  // Importarea modulului de autentificare și a funcției de autentificare cu email și parolă
    import { auth } from '../../firebase';
    import { signInWithEmailAndPassword } from 'firebase/auth';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';

    // Declarațiile pentru email, parolă și mesajul de eroare
    let email = '';
    let password = '';
    let errorMessage = '';

    // Funcția pentru autentificare
    const signIn = async () => {
      try {
        // Încercarea de autentificare cu email și parolă
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('user:', userCredential.user);
        await goto('/'); // Redirecționarea către pagina principală după autentificare
      } catch (error) {
        console.error('Error signing in:', error.message);
        errorMessage = error.message; // Stocarea mesajului de eroare
      }
    };
</script>
  
<main>
    <!-- Formularul pentru Sign-in -->
    <div>
      <h1>Sign In</h1>
      <form on:submit|preventDefault={signIn}>
        <div>
          <label for="email">Email:</label>
          <input type="email" id="email" autocomplete="email" bind:value={email} required>
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" id="password" bind:value={password} required>
        </div>
        {#if errorMessage} <!-- Afisarea mesajului de eroare -->
          <p class="error">{errorMessage}</p>
        {/if}
        <button type="submit">Sign In</button>
      </form>
    </div>
</main>
  
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
      width: 90%;
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
</style>
  