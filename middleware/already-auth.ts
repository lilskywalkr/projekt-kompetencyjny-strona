export default defineNuxtRouteMiddleware(async (to, from) => {
    const userStore = useUserStore();

    // If the user is already logged in, redirect them to the dashboard
    if (userStore.userLoggedIn) {
        return await navigateTo('/dashboard');
    }
})
