<template>
    <!-- Secțiunea care include o imagine de fundal -->
    <section class="page-content" :style="{ backgroundImage: 'url(' + backgroundImageUrl + ')' }">
      <div>
        <!-- Containerul cu poziționare dinamică (left/right) -->
        <div :class="{ 'container': true, 'right': position === 'right', 'left': position === 'left' }">
          <h2>{{title}}</h2>
          <p>{{description}}</p>
          <!-- Butonul care apare doar dacă există o cale definită în routerPath -->
          <p v-if="routerPath"><router-link class="button white border" :to=routerPath>{{buttonName}}</router-link></p>
        </div>
      </div>
    </section>
  </template>

<script>
export default {
  props: {
    // Prop pentru imaginea de fundal, de tip String, obligatoriu
    backgroundImage: {
      type: String,
      required: true
    },
    // Prop pentru poziționarea containerului, implicit 'right'
    position: {
      type: String,
      default: 'right',
      validator: value => ['right', 'left'].includes(value)
    },
    // Prop pentru titlu
    title: {
      type: String,
      default: 'Default Title'
    },
    // Prop pentru descriere
    description: {
      type: String,
      default: 'This is the default description'
    },
    // Prop pentru numele butonului
    buttonName: {
      type: String,
      default: 'Button'
    },
    // Prop pentru calea din router, de tip String
    routerPath: {
      type: String
    }
  },
  computed: {
    // Calcularea URL-ului imaginii de fundal
    backgroundImageUrl () {
      return require(`@/assets/images/${this.backgroundImage}`)
    }
  }
}
</script>

<style>
</style>
