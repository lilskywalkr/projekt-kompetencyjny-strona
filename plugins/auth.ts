export default defineNuxtPlugin(async (nuxtApp) => {
    const userStore = useUserStore();
  
    // Fetch the access token if it doesn't exist
    if (!userStore.getAccessToken()) {
      try {
        await userStore.setAccessToken();
      } catch (error) {
        console.error("Error fetching access token:", error);
      }
    }
  });
  