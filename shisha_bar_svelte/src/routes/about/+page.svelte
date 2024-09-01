<script>
	// Importul componentei Section din fișierul specificat
	import Section from '../../lib/components/Section.svelte';
  
	// Definirea secțiunilor personalizate cu informații despre Shisha Bar
	let mySections = [
	  {
		backgroundImage: 'src/lib/images/about_image.jpg',
		position: 'left',
		title: 'About Shisha Bar',
		description: `Shisha Bar is a haven for shisha enthusiasts seeking a blend of rich flavors and a relaxing ambiance. Established with a passion for creating a unique experience, we take pride in offering a diverse selection of premium shisha flavors.`
	  },
	  {
		backgroundImage: 'src/lib/images/about_image.jpg',
		position: 'right',
		title: '',
		description: `Our team is dedicated to providing exceptional service, ensuring each visit is a memorable one. Whether you're a seasoned shisha connoisseur or a newcomer, our welcoming atmosphere and skilled staff are here to make your time with us enjoyable.`
	  }
	];
  
	// Titlul paginii
	let pageTitle = 'About';
	// Descrierea meta pentru optimizarea motoarelor de căutare
	let metaDescription = 'About this app';
</script>
  
  <svelte:head>
	<title>{pageTitle}</title> <!-- Setarea titlului paginii -->
	<meta name="description" content="{metaDescription}" /> <!-- Setarea descrierii meta pentru optimizarea motoarelor de căutare -->
  </svelte:head>
<div class="about-page-wrapper">
  {#each mySections as section}
	<Section
	  backgroundImage={section.backgroundImage}
	  position={section.position}
	  title={section.title}
	  description={section.description}
	/>
  {/each}
</div>
  
  
<style lang="scss"> 
	@import "src/lib/styles/about.scss"; // Importul fișierului de stiluri pentru pagina Despre
</style>
  
