<script setup>
    import { ref, onMounted, watch } from 'vue';

    // prevent the user from accessing the login page if they are already logged in
    definePageMeta({
        middleware: ['already-auth']    
    });
    
    // Importing the useUserStore function from the store
    const useUser = useUserStore();

    const email = ref(null);
    const password = ref(null);
    const errorMessage = ref(null);

    // Function for login form validation
    function validateForm() {
        if (!email.value || !password.value) {
            errorMessage.value = 'Invalid or missing credentials. Please try again.';
            return false;
        }

        return true;
    }

    // Function to login the user
    async function login(e) {
        e.preventDefault();

        // If the form is not valid, return
        if (!validateForm()) {
            return;
        }
        
        const hashedPassword = await hashing(email.value + password.value);
        const response = await useUser.userLoginAction(hashedPassword, email.value);

        // If the response is null (the user is not logged in), return
        if (!response) {
            errorMessage.value = 'Invalid or missing credentials. Please try again.';
            return;
        }

        // If the user is logged in, redirect to the dashboard
        if (useUser.userLoggedIn) {
            await navigateTo('/dashboard', { replace: true });
        }
    }

    onMounted(async () => {
       
    });
</script>

<template>
    <div class="container">
        <div class="panel">
            
            <div class="panel_credentials">
                <form action="">
                    <div class="form_block">
                        <h2>Sign in</h2>
                        <p>Enter your credential to login into system</p>
                    </div>

                    <div class="form_block">
                        <label>Email*</label><br>
                        <input v-model="email" type="email" placeholder="Enter your email">
                    </div>

                    <div class="form_block">
                        <label>Password*</label><br>
                        <input v-model="password" type="password" placeholder="Enter your password">
                    </div>

                    <div class="form_block" v-if="errorMessage">
                        <p class="error_message">{{ errorMessage }}</p>
                    </div>

                    <button @click="login">Log in</button>

                    <div class="form_block">
                        <p class="sign_in">Don't have an account? <NuxtLink to="/register">Sign up</NuxtLink></p>
                    </div>

                </form>
            </div>

            <div class="panel_image"></div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .container {
        width: 100vw;
        height: 100vh;

        .panel {
            width: 100%;
            height: 100%;
            display: grid;
            grid-template: 1fr / calc(1fr + 1fr / 8) calc(1fr - 1fr / 8);
            background: var(--b-white);
            overflow: hidden;
            position: relative;

            @media screen and (max-width: 768px) {
                grid-template: 1fr / 1fr;
            }

            &_credentials {
                display: grid;
                place-items: center;

                @media screen and (max-width: 768px) {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%) scale(0.8);
                }

                form {
                    @media screen and (max-width: 768px) {
                        color: var(--b-white);
                    }

                    .form_block {
                        margin: 15px 0;

                        h2 {
                            font-size: 40px;
                        }

                        p, label{
                            font-size: 18px;
                            padding: 10px 0;
                            font-weight: 300;
                        }

                        input {
                            width: 350px;
                            padding: 10px;
                            font-size: 17px;
                            background: var(--b-white);
                            border: 1px solid var(--b-gray);
                            margin: 10px 0;
                            border-radius: 6px;
                        }

                        .error_message {
                            color: var(--b-red);
                            font-size: 17px;
                            font-weight: 700;
                        }

                        .sign_in {
                            font-weight: 400;
                            color: var(--b-gray);
                            text-align: center;

                            a {
                                @media screen and (max-width: 768px) {
                                    color: var(--b-white);
                                }
                            }
                        }
                    }

                    button {
                        width: 350px;
                        padding: 10px 0;
                        border: none;
                        font-size: 17px;
                        color: var(--b-white);
                        background: var(--b-black);
                        border-radius: 6px;
                        cursor: pointer;

                        &:active {
                            background: var(--b-blackish);
                        }
                    }
                }
            }

            &_image {
                background-image: url(./../public/webp/books.webp);
                background-size: cover;
                background-position: center;
            }
        }
    }
</style>
