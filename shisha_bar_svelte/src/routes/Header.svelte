<script>
  import { page } from '$app/stores';
  // Importare modulul de autentificare și funcțiile necesare din Firebase
  import { auth } from '../firebase';
  import { onAuthStateChanged, signOut } from 'firebase/auth';
  import { writable } from 'svelte/store';

  // Crearea unui store pentru a urmări starea autentificării
  export const isAuthenticated = writable(false);

  // Funcția ce ascultă modificările de stare a autentificării
  onAuthStateChanged(auth, (user) => {
    isAuthenticated.set(!!user);
  });

  // Funcția pentru deconectarea utilizatorului autentificat
  const logout = async () => {
    try {
	  // Apelarea funcției de deconectare din modulul de autentificare Firebase
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }
</script>

<!-- Elementul de antet al paginii -->
<header>
	<!-- Titlul site-ului -->
	<h1>Rapirea din Serai</h1>
	<!-- Subtitlul site-ului -->
	<p>Experience captivating aromas</p>
	<div>
	  <!-- Bara de navigare -->
	  <nav>
		<!-- Lista de elemente de navigare -->
		<ul>
		  <li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
			<a href="/">Acasă</a>
		  </li>
		  <li aria-current={$page.url.pathname === '/menu' ? 'page' : undefined}>
			<a href="/menu">Meniu</a>
		  </li>
		  <li aria-current={$page.url.pathname === '/reservation' ? 'page' : undefined}>
			<a href="/reservation">Reservări</a>
		  </li>
		  <li aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>
			<a href="/about">About Us</a>
		  </li>
		  <li aria-current={$page.url.pathname === '/contact' ? 'page' : undefined}>
			<a href="/contact">Contact</a>
		  </li>
		  <!-- Verificarea stării de autentificare pentru a afișa butonul de deconectare -->
		  {#if $isAuthenticated}
			<li>
			  <button id="logout-button" on:click={logout}>Logout</button>
			</li>
		  {/if}
		</ul>
	  </nav>
	</div>
</header>

<!-- Stilurile suplimentare pentru meniu -->
<style lang="scss">
@import "src/lib/styles/nav.scss";
</style>
