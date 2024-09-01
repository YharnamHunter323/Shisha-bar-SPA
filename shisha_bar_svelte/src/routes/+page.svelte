<script>
	// Importarea componentei Section din biblioteca de componente

	import Section from '../lib/components/Section.svelte';
</script>

<!-- Definirea titlului și a descrierii paginii -->
<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<!-- Wrapper-ul paginii principale -->
  <div class="home-page-wrapper">
	<!-- Secțiunile de pe pagina principală -->
	<Section
	  backgroundImage='src/lib/images/home_image.jpg'
	  position="right"
	  title="Welcome to Shisha Bar"
	  description="Explore our range of premium shisha flavors and unwind in our inviting atmosphere."
	  buttonName="Contact Us"
	  routerPath="/contact"
	/>
  
	<Section
	  backgroundImage='src/lib/images/menu_image.jpg'
	  position="left"
	  title="Our Menu"
	  description="Discover a diverse selection of shisha flavors and accompanying drinks and snacks."
	  buttonName="Meniu"
	  routerPath="/menu"
	/>
  
	<Section
	  backgroundImage='src/lib/images/reservation_image.jpg'
	  position="right"
	  title="Make a Reservation"
	  description="Reserve your table and guarantee an amazing experience at our shisha bar."
	  buttonName="Book Now!"
	  routerPath="/reservation"
	/>
  
	<Section
	  backgroundImage='src/lib/images/about_image.jpg'
	  position="left"
	  title="About Us"
	  description="Discover the story behind our shisha bar and what makes us unique."
	  buttonName="Learn More"
	  routerPath="/about"
	/>
  </div>
    
<style lang="scss">
</style>
