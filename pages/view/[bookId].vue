<script setup>
    import { ref, onMounted } from 'vue'

    const route = useRoute();

    // prevent the user from accessing the login page if they are already logged in
    definePageMeta({
        middleware: ['auth']
    });

    const pdfUrl = ref('');
    const useUser = useUserStore();
    const borrowedBookExists = ref(null);

    onMounted(async () => {
        pdfUrl.value = await useUser.getPdf(route.params?.bookId); 
        useUser.getUserBorrowedBooks().find(book => (book?.itemId ? book.itemId : book.bookId) === route.params?.bookId) ? borrowedBookExists.value = true : borrowedBookExists.value = false;
    });
</script>

<template>
    <div id="app">
        <WebViewer v-if="pdfUrl && borrowedBookExists === true" path="/webviewer" :url="pdfUrl" />
        <div v-else-if="borrowedBookExists === false">
            <p class="info">Book not found</p>
        </div>
    </div>
</template>

<style scoped lang="scss">
    #app {
        height: 100vh; /* Ensure the app takes full height */
        display: flex;
        justify-content: center;
        align-items: center;

        .info {
            font-size: 3vw;
        }
    }
</style>