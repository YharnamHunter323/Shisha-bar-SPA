<template>
  <!-- Container principal -->
  <div>
    <!-- Formular pentru adăugarea unei noi categorii (vizibil doar dacă utilizatorul este autentificat) -->
    <div v-if="isLoggedIn" class="add-category-form">
      <h3>Add New Category</h3>
      <form @submit.prevent="addCategory">
        <label for="category-title">Category Title:</label>
        <input type="text" v-model="newCategory.title" required />

        <label for="category-name">Category Name:</label>
        <input type="text" v-model="newCategory.category" required />

        <button type="submit">Add Category</button>
      </form>
    </div>
    <!-- Container pentru meniu -->
    <div class="menu-container">
        <!-- Iterare prin fiecare categorie din datele meniului -->
        <div v-for="(category, index) in menuData" :key="index" class="menu-card">
            <h2>
              {{ category.title }}
              <!-- Buton pentru ștergerea unei categorii (vizibil doar dacă utilizatorul este autentificat și nu este în modul de editare) -->
              <button v-if="isLoggedIn && !category.editing" class="delete-button" @click="removeCategory(category.id, category.category)">x</button>
            </h2>
            <div class="subcollections-container">
                <!-- Iterare prin fiecare articol din categoria curentă -->
                <div v-for="(item, itemIndex) in category.items" :key="itemIndex" class="menu-item">
                    <span class="item-name">
                      {{ item.name }}
                      <span v-if="item.details"> ({{ item.details }})</span>
                    </span>
                    <span class="item-price">{{ item.price }} lei</span>
                    <!-- Buton pentru ștergerea unui articol (vizibil doar dacă utilizatorul este autentificat și în modul de editare) -->
                    <button v-if="isLoggedIn && category.editing" class="delete-item-button" @click="removeItem(category.id, category.category, item.id)">x</button>
                </div>
                <!-- Formular pentru adăugarea unui articol nou (vizibil doar dacă utilizatorul este autentificat și în modul de editare) -->
                <div v-if="isLoggedIn && category.editing" class="add-item-form">
                  <input type="text" v-model="category.newItem.name"   placeholder="Nume"/>
                  <input type="text" v-model="category.newItem.details" placeholder="Detalii(opțional)"/>
                  <input type="text" v-model="category.newItem.price" placeholder="Preț" required/>
                  <button @click="addItem(category.id, category.category, category.newItem)">Add Item</button>
                </div>
            </div>
            <!-- Buton pentru intrarea/ieșirea din modul de editare (vizibil doar dacă utilizatorul este autentificat) -->
            <button v-if="isLoggedIn" @click="toggleEditCategory(index)">
              {{ category.editing ? 'Exit Editing' : 'Edit' }}
            </button>
        </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { collection, getDocs, addDoc, deleteDoc, doc, writeBatch, onSnapshot } from 'firebase/firestore'
import { auth, db } from '@/firebase.mjs'
import { onAuthStateChanged } from 'firebase/auth'

export default {
  setup () {
    const menuData = ref([]) // Stocarea datelor meniului
    const isLoggedIn = ref(false) // Starea autentificării utilizatorului
    const newCategory = ref({ title: '', category: '' }) // Obiect pentru noua categorie
    let unsubscribe = null // Funcția de dezabonare pentru snapshot-ul meniului
    const subcollectionUnsubscribes = {} // Funcții de dezabonare pentru subcolecții

    // Funcția pentru preluarea datelor meniului
    const fetchMenuData = async () => {
      const menuCollection = collection(db, 'meniu')
      unsubscribe = onSnapshot(menuCollection, async (snapshot) => {
        const data = []
        for (const menuDoc of snapshot.docs) {
          const title = menuDoc.data().title
          const categoryId = menuDoc.id
          const categoryName = menuDoc.data().category
          const subcollectionRef = collection(db, `meniu/${menuDoc.id}/${categoryName}`)
          const subcollectionSnapshot = await getDocs(subcollectionRef)

          const items = subcollectionSnapshot.docs.map(itemDoc => ({
            id: itemDoc.id,
            name: itemDoc.data().name,
            price: itemDoc.data().price,
            details: itemDoc.data().details || null
          }))

          data.push({ title, items, id: categoryId, category: categoryName, newItem: { name: '', details: '', price: '' }, isEditing: false })
        }
        menuData.value = data
        console.log('Updated menuData:', data)
      })
    }

    // Funcția pentru preluarea datelor subcolecțiilor
    const fetchSubcollectionData = (categoryId, categoryName) => {
      const subcollectionRef = collection(db, `meniu/${categoryId}/${categoryName}`)
      const unsubscribe = onSnapshot(subcollectionRef, (snapshot) => {
        const items = snapshot.docs.map((itemDoc) => ({
          id: itemDoc.id,
          name: itemDoc.data().name,
          price: itemDoc.data().price,
          details: itemDoc.data().details || null
        }))
        const category = menuData.value.find((cat) => cat.id === categoryId)
        if (category) {
          category.items = items
          console.log('Updated items for category:', categoryId, items)
        }
      })
      subcollectionUnsubscribes[categoryId] = unsubscribe
    }

    // Funcția pentru adăugarea unei noi categorii
    const addCategory = async () => {
      try {
        await addDoc(collection(db, 'meniu'), {
          title: newCategory.value.title,
          category: newCategory.value.category
        })
        console.log('New category added:', newCategory.value)
        newCategory.value.title = ''
        newCategory.value.category = ''
      } catch (error) {
        console.error('Error adding new category: ', error)
      }
    }

    // Funcția pentru ștergerea unei categorii
    const removeCategory = async (categoryId, categoryName) => {
      try {
        // Dezabonare de la snapshot-ul subcolecției dacă se află în modul editare
        if (subcollectionUnsubscribes[categoryId]) {
          subcollectionUnsubscribes[categoryId]()
          delete subcollectionUnsubscribes[categoryId]
        }

        // Referință la subcolecție
        const subcollectionRef = collection(db, `meniu/${categoryId}/${categoryName}`)
        const subcollectionSnapshot = await getDocs(subcollectionRef)
        const batch = writeBatch(db)
        subcollectionSnapshot.forEach(doc => {
          batch.delete(doc.ref)
        })

        await batch.commit()
        await deleteDoc(doc(db, 'meniu', categoryId))
        console.log('Category and its subcollection removed with ID: ', categoryId)
      } catch (error) {
        console.error('Error removing category: ', error)
      }
    }

    // Funcția pentru adăugarea unui nou articol
    const addItem = async (categoryId, categoryName, newItem) => {
      try {
        await addDoc(collection(db, `meniu/${categoryId}/${categoryName}`), {
          name: newItem.name,
          details: newItem.details,
          price: parseFloat(newItem.price)
        })
        console.log('New item added:', newItem)
      } catch (error) {
        console.error('Error adding new item: ', error)
      }
    }

    // Funcția pentru ștergerea unui articol
    const removeItem = async (categoryId, categoryName, itemId) => {
      try {
        await deleteDoc(doc(db, `meniu/${categoryId}/${categoryName}`, itemId))
        console.log('Item removed with ID: ', itemId)
      } catch (error) {
        console.error('Error removing item: ', error)
      }
    }

    // Funcția toggle pentru modul de editare pentru o categorie
    const toggleEditCategory = (index) => {
      const category = menuData.value[index]
      category.editing = !category.editing

      if (category.editing) {
        fetchSubcollectionData(category.id, category.category)
      } else {
        if (subcollectionUnsubscribes[category.id]) {
          subcollectionUnsubscribes[category.id]()
          delete subcollectionUnsubscribes[category.id]
        }
      }
    }

    // Funcția apelată la montarea componentei
    onMounted(() => {
      console.log('Mounted')
      fetchMenuData()
      onAuthStateChanged(auth, (user) => {
        isLoggedIn.value = !!user
        console.log('Auth state changed:', isLoggedIn.value)
      })
    })

    // Funcția apelată înainte de demontarea componentei
    onBeforeUnmount(() => {
      console.log('beforeunount')
      if (unsubscribe) unsubscribe()
      Object.values(subcollectionUnsubscribes).forEach(unsub => unsub())
    })

    return {
      menuData,
      isLoggedIn,
      newCategory,
      addCategory,
      removeCategory,
      addItem,
      removeItem,
      toggleEditCategory
    }
  }
}

</script>
