<template>
  <!-- Wrapper pentru pagina de acasă -->
  <div class="home-page-wrapper">
        <!-- Componenta MySection pentru secțiunile din pagina principală -->
        <MySection :backgroundImage="'home_image.jpg'"
                    position="right"
                    :title="'Welcome to Shisha Bar'"
                    :description="'Explore our range of premium shisha flavors and unwind in our inviting atmosphere.'"
                    :buttonName="'Contact Us'"
                    :routerPath="'/contact'"
                    ></MySection>

        <MySection :backgroundImage="'menu_image.jpg'"
                    position="left"
                    :title="'Our Menu'"
                    :description="'Discover a diverse selection of shisha flavors and accompanying drinks and snacks.'"
                    :buttonName="'Meniu'"
                    :routerPath="'/menu'"
                    ></MySection>

        <MySection :backgroundImage="'reservation_image.jpg'"
                    position="right"
                    :title="'Make a Reservation'"
                    :description="'Reserve your table and guarantee an amazing experience at our shisha bar.'"
                    :buttonName="'Book Now!'"
                    :routerPath="'/reservation'"
                    ></MySection>

        <MySection :backgroundImage="'about_image.jpg'"
                    position="left"
                    :title="'About Us'"
                    :description="'Discover the story behind our shisha bar and what makes us unique.'"
                    :buttonName="'Learn More'"
                    :routerPath="'/about'"
                    ></MySection>

    </div>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>
