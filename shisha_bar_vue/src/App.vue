<template>
  <!-- Antetul paginii -->
  <header>
        <!-- Titlul principal -->
        <h1 style="margin: auto;">Rapirea din Serai</h1>
        <!-- Subtitlul -->
        <p>Experience captivating aromas</p>
         <!-- Componenta bara de navigare -->
        <NavBar/>
  </header>
  <!-- Vizualizatorul routerului pentru afișarea paginilor -->
  <router-view/>

  <!-- Subsolul paginii -->
  <footer>
    <!-- Textul de drepturi de autor -->
    <p>&copy; 2023 Shisha Bar. All rights reserved.</p>
  </footer>
</template>

<script>
import NavBar from './components/NavBar.vue'

export default {
  components: {
    NavBar
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  padding-bottom: 0%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
