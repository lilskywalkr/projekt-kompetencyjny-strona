<script setup>
    import { ref, onMounted } from 'vue';

    // prevent the user from accessing the login page if they are already logged in
    definePageMeta({
        middleware: ['already-auth']    
    });

    // Importing the useUserStore function from the store
    const useUser = useUserStore();

    const firstName = ref(null);
    const lastName = ref(null);
    const email = ref(null);
    const password = ref(null);
    const errorMessage = ref(null);

    // Function for login form validation
    function validateForm() {
        if (!firstName.value || !lastName.value || !email.value || !password.value) {
            errorMessage.value = 'Invalid or missing credentials. Please try again.';
            return false;
        }

        return true;
    }

    // Function to register the user
    async function register(e) {
        e.preventDefault();

        // If the form is not valid, return
        if (!validateForm()) {
            return;
        }

        const hashedPassword = await hashing(email.value + password.value);
        await useUser.userRegisterAction(firstName.value, lastName.value, email.value, hashedPassword);
    }

    onMounted(async () => {
        
    })
</script>

<template>
    <div class="container">
        <div class="panel">
            <div class="panel_image"></div>

            <div class="panel_credentials">
                <form action="">
                    <div class="form_block">
                        <h2>Sign up</h2>
                        <p>Enter credentials to sign up</p>
                    </div>

                    <div class="form_block">
                        <label>First Name*</label><br>
                        <input v-model="firstName" type="text" placeholder="Enter your first name">
                    </div>

                    <div class="form_block">
                        <label>Last Name*</label><br>
                        <input v-model="lastName" type="text" placeholder="Enter your last name">
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

                    <button @click="register">Sign up</button>

                    <div class="form_block">
                        <p class="sign_up">Already have an account? <NuxtLink to="/login">Sign in</NuxtLink></p>
                    </div>
                </form>
            </div>
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
            grid-template: 1fr / calc(1fr - 1fr / 8) calc(1fr + 1fr / 8);
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

                        .sign_up {
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
