<script>
	// Importarea componentei Header și a fișierului de stil
	import Header from './Header.svelte';
	import './styles.css';
</script>

<!-- Structura de bază a aplicației -->
<div class="app">
	<!-- Includerea antetului -->
	<Header />

	<main>
		<slot /> <!-- Spațiul rezervat pentru conținutul dinamic -->
	</main>

	<footer>
		<!-- Textul copyright -->
		<p>&copy; 2023 Shisha Bar. All rights reserved.</p>
	</footer>
</div>

<!-- Stilurile pentru structura de bază a aplicației -->
<style lang="scss">
	.app {
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
		
		footer {
			background-color: #333;
			color: #fff;
			text-align: center;
			padding-block: 30px;
			bottom: 0;
			width: 100%;
			max-height: 300px;
			margin: 0;

			p {
				margin:  0;
				padding-bottom: 20px;
			}
		}
	}

</style>
