export default defineNuxtRouteMiddleware(async (to, from) => {
    const userStore = useUserStore();

    // If the user is not logged in, redirect them to the login page
    if (!userStore.userLoggedIn) {
        return await navigateTo('/login');
    }
})
