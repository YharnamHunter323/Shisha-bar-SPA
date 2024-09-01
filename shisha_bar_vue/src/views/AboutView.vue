
<template>
  <!-- Wrapper pentru pagina "About" -->
  <div class="about-page-wrapper">
    <!-- Componenta MySection pentru secțiunile din About -->
    <MySection :backgroundImage="'home_image.jpg'"
                position="left"
                :title="'About Shisha Bar'"
                :description="'Shisha Bar is a haven for shisha enthusiasts seeking a blend of rich flavors and a relaxing ambiance. Established with a passion for creating a unique experience, we take pride in offering a diverse selection of premium shisha flavors.'"
    ></MySection>
    <MySection :backgroundImage="'home_image.jpg'"
                position="right"
                :title="''"
                :description="'Our team is dedicated to providing exceptional service, ensuring each visit is a memorable one. Whether you\'re a seasoned shisha connoisseur or a newcomer, our welcoming atmosphere and skilled staff are here to make your time with us enjoyable.'"
    ></MySection>
  </div>
</template>

<script>
</script>
