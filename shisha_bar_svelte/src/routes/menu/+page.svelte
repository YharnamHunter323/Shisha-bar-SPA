<script>
// Importurile necesare din Firestore și Firebase Auth
import { onMount, onDestroy } from 'svelte';
import { collection, getDocs, addDoc, deleteDoc, doc, writeBatch, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Declarații de variabile și inițializări
let menuData = [];
let isLoggedIn = false;
let newCategory = { title: '', category: '' };
let unsubscribe = null;
const subcollectionUnsubscribes = {};

// Funcția pentru preluarea datelor meniului din Firestore
const fetchMenuData = async () => {
  const menuCollection = collection(db, 'meniu');
  unsubscribe = onSnapshot(menuCollection, async (snapshot) => {
    const data = [];
    for (const menuDoc of snapshot.docs) {
      const title = menuDoc.data().title;
      const categoryId = menuDoc.id;
      const categoryName = menuDoc.data().category;
      const subcollectionRef = collection(db, `meniu/${menuDoc.id}/${categoryName}`);
      const subcollectionSnapshot = await getDocs(subcollectionRef);

      const items = subcollectionSnapshot.docs.map(itemDoc => ({
        id: itemDoc.id,
        name: itemDoc.data().name,
        price: itemDoc.data().price,
        details: itemDoc.data().details || null
      }));

      data.push({ title, items, id: categoryId, category: categoryName, newItem: { name: '', details: '', price: '' }, editing: false });
    }
    menuData = data;
  });
};

// Funcția pentru preluarea datelor subcolecției din Firestore
const fetchSubcollectionData = (categoryId, categoryName) => {
  const subcollectionRef = collection(db, `meniu/${categoryId}/${categoryName}`);
  const unsubscribe = onSnapshot(subcollectionRef, (snapshot) => {
    const items = snapshot.docs.map((itemDoc) => ({
      id: itemDoc.id,
      name: itemDoc.data().name,
      price: itemDoc.data().price,
      details: itemDoc.data().details || null
    }));

    // Actualizarea datelor meniului în mod imutabil pentru reactivitate în Svelte
    menuData = menuData.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: items
        };
      } else {
        return category;
      }
    });
  });

  subcollectionUnsubscribes[categoryId] = unsubscribe;
};

// Funcția pentru adăugarea unei noi categorii
const addCategory = async () => {
  try {
    await addDoc(collection(db, 'meniu'), {
      title: newCategory.title,
      category: newCategory.category
    });
    newCategory.title = '';
    newCategory.category = '';
  } catch (error) {
    console.error('Error adding new category: ', error);
  }
};

// Funcția pentru ștergerea unei categorii existente
const removeCategory = async (categoryId, categoryName) => {
  try {
    if (subcollectionUnsubscribes[categoryId]) {
      subcollectionUnsubscribes[categoryId]();
      delete subcollectionUnsubscribes[categoryId];
    }

    const subcollectionRef = collection(db, `meniu/${categoryId}/${categoryName}`);
    const subcollectionSnapshot = await getDocs(subcollectionRef);
    const batch = writeBatch(db);
    subcollectionSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    await deleteDoc(doc(db, 'meniu', categoryId));
  } catch (error) {
    console.error('Error removing category: ', error);
  }
};

// Funcția pentru adăugarea unui nou articol într-o categorie
const addItem = async (categoryId, categoryName, newItem) => {
  try {
    await addDoc(collection(db, `meniu/${categoryId}/${categoryName}`), {
      name: newItem.name,
      details: newItem.details,
      price: parseFloat(newItem.price)
    });
    console.log('New item added:', newItem);
  } catch (error) {
    console.error('Error adding new item: ', error);
  }
};

// Funcția pentru ștergerea unui articol dintr-o categorie
const removeItem = async (categoryId, categoryName, itemId) => {
  try {
    await deleteDoc(doc(db, `meniu/${categoryId}/${categoryName}`, itemId));
    console.log('Item removed with ID: ', itemId);
  } catch (error) {
    console.error('Error removing item: ', error);
  }
};

// Funcție toggle pentru modul de editare al unei categorii
const toggleEditCategory = (index) => {
  menuData = menuData.map((category, i) => {
    if (i === index) {
      return {
        ...category,
        editing: !category.editing
      };
    } else {
      return category;
    }
  });
  
  const category = menuData[index];
  if (category.editing) {
    fetchSubcollectionData(category.id, category.category);
  } else {
    if (subcollectionUnsubscribes[category.id]) {
      subcollectionUnsubscribes[category.id]();
      delete subcollectionUnsubscribes[category.id];
    }
  }
};

// Funcția care se execută la montarea componentei
onMount(() => {
  fetchMenuData(); // Preluarea inițială a datelor meniului
  onAuthStateChanged(auth, (user) => {
    isLoggedIn = !!user; // Actualizarea stării de autentificare a utilizatorului
  });
});

// Funcția care se execută la distrugerea componentei
onDestroy(() => {
  if (unsubscribe) unsubscribe(); // Dezabonarea de la actualizările meniului
  Object.values(subcollectionUnsubscribes).forEach(unsub => unsub()); // Dezabonarea de la subcolecțiile meniului
});

</script>

<!-- Componenta pentru gestionarea meniului -->
<div>
   <!-- Verificare dacă utilizatorul este autentificat -->
  {#if isLoggedIn}
    <!-- Formular pentru adăugarea unei noi categorii -->
    <div class="add-category-form">
      <h3>Add New Category</h3>
      <form on:submit|preventDefault={addCategory}>
        <label for="category-title">Category Title:</label>
        <input type="text" bind:value={newCategory.title} required />

        <label for="category-name">Category Name:</label>
        <input type="text" bind:value={newCategory.category} required />

        <button type="submit">Add Category</button>
      </form>
    </div>
  {/if}

  <!-- Containerul meniului -->
  <div class="menu-container">
    <!-- Iterarea prin fiecare categorie din meniu -->
    {#each menuData as category, index (index)}
      <div class="menu-card">
        <h2>
          {category.title}
          {#if isLoggedIn}
          <!-- Buton pentru ștergerea categoriei (doar pentru utilizatorii autentificați) -->
          <button 
            class="delete-button" 
            on:click={() => removeCategory(category.id, category.category)}
          >
            x
          </button>
          {/if}
        </h2>
        <!-- Containerul pentru subcategoriile și articolele din categoria curentă -->
        <div class="subcollections-container">
          <!-- Iterarea prin fiecare item din categoria curentă -->
          {#each category.items as item, itemIndex}
            <div class="menu-item" key={itemIndex}>
              <span class="item-name">
                {item.name}
                <!-- Afisarea detaliilor articolului, dacă există -->
                {#if item.details} ({item.details}){/if}
              </span>
              <span class="item-price">{item.price}lei</span>
              <!-- Buton pentru ștergerea articolului (doar pentru utilizatorii autentificați și dacă containerul este în starea de editare) -->
              {#if isLoggedIn && category.editing}
              <button 
                class="delete-item-button" 
                on:click={() => removeItem(category.id, category.category, item.id)}
              >
                x
              </button>
              {/if}
            </div>
          {/each}
          <!-- Formular pentru adăugarea unui nou articol în timpul editării -->
          {#if  category.editing}
            <div class="add-item-form">
              <input type="text" bind:value={category.newItem.name} placeholder="Nume"/>
              <input type="text" bind:value={category.newItem.details} placeholder="Detalii(opțional)"/>
              <input type="text" bind:value={category.newItem.price} placeholder="Preț" required/>
              <button on:click={() => addItem(category.id, category.category, category.newItem)}>Add Item</button>
            </div>
          {/if}
        </div>
        <!-- Buton pentru schimbare între modul de editare și modul normal (doar pentru utilizatorii autentificați) -->
        {#if isLoggedIn}
        <button 
          on:click={() => toggleEditCategory(index)}
        >
        {category.editing ? 'Exit Editing' : 'Edit'}
        </button>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  @import "src/lib/styles/menu.scss";
</style>