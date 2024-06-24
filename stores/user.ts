import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {

  const expiryDate = new Date();
  expiryDate.setTime(expiryDate.getTime() + (2 * 60 * 60 * 1000)); // This is the expiry date for the access token

  const accessToken = useCookie('TOKEN', {expires: expiryDate})  // This is the access token

  const userHash = useCookie('HASH'); // This is the user hash
  const userLoggedIn = useCookie('IS_LOGGED_IN');  // This is the user logged in status
  const userEmail = useCookie('EMAIL');  // This is the user email
  const userBorrowedBooks = ref(localStorage);  // This is the user borrowed books

  const clientId = import.meta.env.VITE_SALSEFORCE_CLIENT_ID; // This is the client id
  const clientSecret = import.meta.env.VITE_SALSEFORCE_CLIENT_SECRET; // This is the client secret

  // This sets the user logged in status
  const setUserHash = (hash: string) => { userHash.value = hash; }

  // This is the user login action
  const userLoginAction = async (hash: string, email: string) => {
    try {
      const response: Response = await $fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken.value}`,
        },
        body: JSON.stringify({
          hash: hash,
        }),
        server: true,
      });
      
      if (response) {
        const text = await response.text();
        const json = JSON.parse(text);

        userLoggedIn.value = JSON.stringify(true);
        userHash.value = hash;
        userEmail.value = email;

        console.log(json);
        
        userBorrowedBooks.value.setItem('borrowedBooks', JSON.stringify(json));
      } else {
        throw new Error('Failed to login');
      }
    } catch (error) {
      console.error(error);
    }
  }

  // This is the user logout action
  const userLogoutAction = () => {
    userLoggedIn.value = null;
    userHash.value = null;
    userEmail.value = null;
    userBorrowedBooks.value.removeItem('borrowedBooks');
  }

  // Function to borrow a book from the library
  async function borrowBook(bookId: string) {
    console.log("Book ID: " + bookId)

    const response = await $fetch('/api/borrow', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken.value}`,
        },
        body: JSON.stringify({
            Id: bookId,
            Hash: userHash.value,
        }),
        server: true,
    });

    console.log("Response: ", response);
  }

  // This is the user register action
  const userRegisterAction = async (firstName: string, lastName: string, email: string, hash: string) => {
    try {
      const response: Response = await $fetch('/api/register', {
        method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken.value}`,
          },
          body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            mail: email,
            hash: hash,
          }),

          server: true,
      });

      console.log(response);
    } catch (error) {
      console.error("An error occured: ", error);
    }
  }

  // This sets the access token
  const setAccessToken = async () => {
    try {
      const response = await $fetch("/api/auth", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials&client_id=' + clientId + '&client_secret=' + clientSecret,
        server: true,
      });
      
      if (response?.access_token) {
        accessToken.value = response.access_token;
      }
    } catch (error) {
      console.error(error);
    }
  }

  // This sets the user borrowed books
  const addUserBorrowedBook = (book: object) => {
    const books: object[] = getUserBorrowedBooks();

    books.push(book);

    userBorrowedBooks.value.setItem('borrowedBooks', JSON.stringify(books));
  }

  // This gets the PDF file from the server and returns the URL to the PDF
  async function getPdf(pdfId: string) {
    try {
      const response: Blob = await $fetch("/api/pdf", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken.value}`,
        },
        body: JSON.stringify({
          Id: pdfId,
        }),
        server: true,
      });

      if (response) {
        const text = await response.text();
        const json = JSON.parse(text);

        const pdfUrl = String('data:application/pdf;base64,' + json);

        return pdfUrl;

      } else {
        throw new Error('Failed to fetch the PDF');
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getUserInfo() {
    try {
      const response: Response = await $fetch('/api/info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken.value}`,
        },
        body: JSON.stringify({
          email: String(userEmail.value),
        }),
        server: true,
      });
  
      if (response) {
        const text = await response.text();
        const jsonData = JSON.parse(text);
  
        return jsonData;
      } else {
        throw new Error('Failed to fetch the user info');
      }
    } catch (error) {
      console.error("An error occured: ", error);
    }
  }

  // This gets all the available books
  async function getAllAvailableBooks() {
    try {
      const response: Blob = await $fetch('/api/books', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken.value}`,
        },
        server: true,
      });

      if (response) {
          const text = await response.text();
          const jsonData = JSON.parse(text);
          
          // console.log(jsonData);
          return jsonData;
      } else {
        throw new Error('Failed to fetch the books');
      }
    } catch (error) {
      console.error("An error occured: ", error);
    }
  }

  // This gets the access token
  const getAccessToken = () => {
    return accessToken.value;
  }

  // This gets the user hash
  const getUserHash = () => {
    return userHash.value;
  }

  const getUserEmail = () => {
    return userEmail.value;
  }

  // This gets the user borrowed books
  const getUserBorrowedBooks = () => {  
    const books = userBorrowedBooks.value.getItem('borrowedBooks');
    return (books ? JSON.parse(books) : []);
  }

  return {
    userLoggedIn,
    setUserHash,
    userLoginAction,
    userRegisterAction,
    setAccessToken,
    getAccessToken,
    getUserHash,
    getPdf,
    getAllAvailableBooks,
    getUserBorrowedBooks,
    getUserEmail,
    getUserInfo,
    borrowBook,
    userLogoutAction,
    addUserBorrowedBook,
  };
});
