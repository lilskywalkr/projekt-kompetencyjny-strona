<script setup>
    import { ref, onMounted, watch } from 'vue';

    // Prevent the user from accessing the dashboard page if they are not logged in
    definePageMeta({
        middleware: ['auth']    
    });

    const showUserInformation = ref(false); // Variable to show user information

    const useUser = useUserStore(); // Importing the useUserStore function from the store

    const message = ref('Loading...');  // This will be used to display message when fetching books

    const availableBooks = ref([]); // Available books
    const borrowedBooks = ref([]); // Borrowed books
    const availableGenres = ref([]); // Available genres

    const userPanel = ref(null);    // This will be used to toggle user panel
    const panelButton = ref(null);      // This will be used to toggle user panel

    const filteredBooks = ref([...availableBooks.value]);   // This will be used to display filtered books
    const searchValue = ref('');    // This will be used to store search value
    const selectValue = ref('all'); // This will be used to store selected genre

    // Function for toggling user panel
    const toggleUserPanel = () => {
        userPanel.value.classList.toggle('inactive-panel');
        panelButton.value.classList.toggle('inactive-panel');
        panelButton.value.innerText = panelButton.value.innerText === '←' ? '→' : '←';
    }

    const toggleUserInfo = () => {
        showUserInformation.value = !showUserInformation.value;
    }

    // Function for filtering books based on title/author and genre
    const filterBooks = (e) => {
        e.preventDefault();

        // Check if the search value is empty, if so, display all books, based on the selected genre
        if (!searchValue.value) {
            filteredBooks.value = availableBooks.value.filter(book => {
                if (selectValue.value === 'all') {
                    return book;
                } else {
                    return book.genre.toLowerCase() === selectValue.value;
                }
            });

            return;
        }

        filteredBooks.value = availableBooks.value.filter((book) => {
            // Check if the search value is included in the title or author
            const conditionOne = book.title.toLowerCase().includes(searchValue.value);
            const conditionTwo = book.authors.toLowerCase().includes(searchValue.value);

            if (conditionOne || conditionTwo) {
                return book;
            }
        });

    }

    // Function for getting genres from available books
    const getGenres = () => {
        const genres = new Set();
        availableBooks.value.forEach(book => genres.add(book.genre));

        return [...genres];
    }

    // Function for reading the book
    const readTheBook = async (bookId) => {
        if (useUser.userLoggedIn) {
            await navigateTo('/view/' + bookId, { replace: false});
        }
    }

    // Function for borrowing the book
    const borrowTheBook = async (bookId) => {
        if (useUser.getUserBorrowedBooks().length >= 3) {
            alert('You have reached the maximum number of books you can borrow');
            return;
        }

        if (useUser.getUserBorrowedBooks().find(book => book.itemId === bookId)) {
            alert('You have already borrowed this book');
            return;
        }

        await useUser.borrowBook(bookId);
        useUser.addUserBorrowedBook(availableBooks.value.find(book => book.bookId === bookId)); // zmienic na bookId gdy kuba zrobi zmiany
    }

    // Function for signing out
    const signOut = async () => {
        useUser.userLogoutAction();
        useRouter().go(0);
    }

    // watcher for available books
    watch(availableBooks, (newBooks, _) => {
        filteredBooks.value = newBooks;
        message.value = newBooks.length ? 'No books found' : '';
    });

    // watcher for borrowed books
    watch(borrowedBooks, (newBooks, _) => {
        borrowedBooks.value = newBooks;
    });

    onMounted(async () => {
        borrowedBooks.value = await useUser.getUserBorrowedBooks();     // Get user borrowed books
        availableBooks.value = await useUser.getAllAvailableBooks();    // Get all available books
        availableGenres.value = getGenres();    // Get all available genres from available books
    });
</script>

<template>
    <main>
        <UserInfo v-if="showUserInformation" @close="toggleUserInfo" />

        <div class="search-panel">
            <form action="">
                <input placeholder="Title or author" v-model="searchValue" type="search" name="book-search" id="book-search">
                <button @click="filterBooks" >Search</button>
                <select v-model="selectValue" @change="filterBooks">
                    <option selected value="all">All</option>
                    <option v-for="genre in availableGenres" :value="genre.toLowerCase()">{{ genre }}</option>
                </select>
                <button :style="{background: '#B23B3B'}" @click="signOut">
                    <span>Sign out</span>
                    <Icon name="ic:baseline-logout" />
                </button>
            </form>

            <div class="search-content">
                <div v-if="filteredBooks.length" class="availabe-book" v-for="book in filteredBooks">
                    <div class="availabe-book-info">
                        <div>
                            <h3 class="book-title">{{ book?.title }}</h3>
                            <p class="book-author">{{ book?.authors }}</p>
                            <p class="book-desc">{{ book?.Description }}</p>
                            <input class="book-borrow" type="button" value="Borrow" @click="async () => {await borrowTheBook(book?.bookId)}">
                        </div>
                    </div>
                    <img class="availabe-book-cover" :src="`data:image/jpen;base64,${book?.cover}`" :alt="book.title">
                </div>
                <div v-else>
                    <h2>{{ message }}</h2>
                </div>
            </div>
        </div>

        <div class="user-panel" ref="userPanel">
            <div class="user-info" @click="toggleUserInfo">
                <img :src="`${useRequestURL().origin}//public/webp/male_avatar.webp`" alt="user avatar">
                <p>{{ useUser.getUserEmail() }}</p>
            </div>

            <button ref="panelButton" @click="toggleUserPanel">&rarr;</button>

            <div class="borrowed-books">
                <div class="borrowed-book" v-if="borrowedBooks.length" v-for="book in borrowedBooks">
                    <div class="borrowed-book-info">
                        <div>
                            <h3 class="book-title">{{ book?.title }}</h3>

                            <template v-if="Array.isArray(book?.authors)">
                                <p class="book-author" v-for="author in book?.authors">{{ author }}</p>
                            </template>
                            <template v-else>
                                <p class="book-author">{{ book?.authors }}</p>
                            </template>

                            <p :style="{color: '#B23B3B'}"><b>{{ book?.dateDue }}</b></p>
                            <input class="book-read" type="button" value="Read" @click="async () => {readTheBook((book?.itemId ? book.itemId : book.bookId))}">
                        </div>
                    </div>
                    <img :src="`data:image/png;base64,${book.cover}`" :alt="book.title">
                </div>
                <div v-else>
                    <h3>No borrowed books</h3>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped lang="scss">
    main {
        width: 100vw;
        height: 100vh;
        display: flex;

        .search-panel {
            padding: 1em;
            width: 100%;

            form {
                display: flex;
                gap: 1em;
                flex-flow: row wrap;

                input[type=search] {
                    width: calc(20vw + 10em);
                    border: none;
                    font-size: 1em;
                    border-radius: 0.6em;
                    border: 1px solid var(--b-gray);
                    padding: 0.5em;
                }
  

                button {
                    border: none;
                    background: var(--b-black);
                    color: var(--b-white);
                    font-size: 1em;
                    border-radius: 0.5em;
                    padding: 0.5em 1em;
                    cursor: pointer;
                    display: flex;
                    place-items: center;
                    gap: 0.5em;

                    &:active {
                        background-color: var(--b-blackish);
                    }
                }

                select {
                    width: 7em;
                    font-size: 1em;
                    text-align: center;
                }
            }

            .search-content {
                width: 100%;
                overflow-y: scroll;
                height: calc(100vh - 5.5em);
                background: var(--b-white-gray);
                border-radius: 1em;
                margin-top: 1em;
                display: flex;
                flex-flow: row wrap;
                justify-content: center;
                padding: 2em;
                gap: 3vw;

                .availabe-book {
                    overflow: hidden;
                    position: relative;
                    width: 20em;
                    height: 30em;

                    @media screen and (max-width: 768px) {
                        width: 13em;
                        height: 20em;
                        
                    }

                    &:hover .availabe-book-info {
                        display: grid;
                    }

                    &-info {
                        width: 100%;
                        height: 100%;
                        background: rgba($color: #141618, $alpha: 0.8);
                        position: absolute;
                        top: 0;
                        left: 0;
                        color: var(--b-white);
                        place-items: center;
                        text-align: center;
                        padding: 0 1em;
                        line-height: 1.5;
                        display: none;

                        .book-title {
                            font-size: 1.5em;
                            font-weight: 600;

                            @media screen and (max-width: 768px){
                                font-size: 1.3em;
                            }
                        }

                        .book-author {
                            font-size: 1em;
                            font-weight: 400;

                            @media screen and (max-width: 768px){
                                font-size: 0.8em;
                            }
                        }

                        .book-desc {
                            font-size: 0.9em;
                            font-weight: 300;
                            padding: 2em;

                            @media screen and (max-width: 768px){
                                font-size: 0.5em;
                            }
                        }

                        .book-borrow {
                            cursor: pointer;
                            background: transparent;
                            font-size: 1em;
                            border: 0.1em solid var(--b-white);
                            padding: 0.5em 1em;
                            border-radius: 0.4em;
                            color: var(--b-white);

                            &:hover {
                                background: var(--b-white);
                                color: var(--b-black);
                            }
                        }
                    }
                    
                    &-cover {
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }

        // User panel
        .user-panel {
            width: 18em;
            background: var(--b-white);
            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
            padding: 1em;
            overflow: hidden;

            // Class for hiding user panel
            &.inactive-panel {
                width: 0 !important;
                padding: 0 !important;
            }

            @media screen and (max-width: 768px) {
                width: 13em;
                position: fixed;
                right: 0;
                top: 0;
                overflow: visible;
            }

            .user-info {
                border-radius: 0.5em;
                background:  var(--b-white-gray);
                height: 4em;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                gap: 0.5em;
                padding-left: 1vw;
                cursor: pointer;
                user-select: none;

                &:hover {
                    background: var(--b-gray);
                }

                img {
                    width: 2em;
                }

                p {
                    font-size: 0.9em;
                    font-weight: 300;

                    @media screen and (max-width: 768px) {
                        font-size: 0.75em;
                    }
                }
            }

            button {
                position: absolute;
                width: 2em;
                height: 3em;
                border: none;
                border-radius: 4em;
                font-weight: 400;
                top: 50%;
                right: calc(3vw + 7.5em);
                transform: translateY(-50%);
                background: var(--b-black);
                color: var(--b-white);
                font-size: 1.5em;
                cursor: pointer;

                // Class for changing position of the button
                &.inactive-panel {
                    right: 0.25em !important;
                }
            }
            
            .borrowed-books {
                height: 90vh;
                margin: 1em 0;
                overflow-y: scroll;
                position: relative;
                text-align: center;

                .borrowed-book {
                    width: calc(3vw + 9em);
                    margin: 0 auto 1em auto;
                    position: relative;
                    text-align: center;

                    @media screen and (max-width: 768px){
                        width: 10.5em;
                    }

                    &:hover .borrowed-book-info {
                        display: grid;
                    }

                    &-info {
                        width: 100%;
                        height: 100%;
                        background: rgba($color: #141618, $alpha: 0.8);
                        position: absolute;
                        top: 0;
                        left: 0;
                        color: var(--b-white);
                        place-items: center;
                        text-align: center;
                        padding: 0 1em;
                        line-height: 1.5;
                        display: none;

                        .book-title {
                            font-size: 1.3em;
                            font-weight: 600;
                            padding-bottom: 1em;
                        }

                        .book-author {
                            font-size: 0.8em;
                            font-weight: 400;
                        }

                        .book-read {
                            cursor: pointer;
                            background: transparent;
                            font-size: 1em;
                            border: 0.1em solid var(--b-white);
                            padding: 0.5em 1em;
                            border-radius: 0.4em;
                            margin-top: 1em;
                            color: var(--b-white);

                            &:hover {
                                background: var(--b-white);
                                color: var(--b-black);
                            }
                        }
                    }

                    img {
                        width: 100%;
                        height: auto;
                    }
                }
            }
        }
    }
</style>