<script setup>
    import { ref, onMounted, watch } from 'vue';
    
    // Importing the useUserStore function from the store
    const useUser = useUserStore();

    // Define props for user information
    const props = defineProps(['userName', 'userEmail', 'userPassword']);
    const emits = defineEmits(['close']);

    const visiblePassword = ref(false); // Variable to show the password

    // Function to show the password
    const showPassword = () => {
        visiblePassword.value = !visiblePassword.value;
    }


    onMounted(async () => {
       
    });
</script>

<template>
    <div class="container">
        <div class="content">
            <Icon @click="$emit('close')" class="close" name="ic:baseline-close" />

            <div class="block">
                <label>Name:</label>
                <input type="text" name="userName" id="userName" :value="userName" disabled>
            </div>

            <div class="block">
                <label>Email:</label>
                <input type="email" name="userEmail" id="userEmail" :value="userEmail" disabled>
            </div>

            <div class="block">
                <label>Password:</label>
                <input :type="visiblePassword ? 'text' : 'password'" name="userPassword" id="userPassword" :value="userPassword" readonly @click="showPassword">
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .container {
        width: 100vw;
        height: 100vh;
        display: grid;
        place-items: center;
        background: rgba(20, 22, 24, 0.8);
        position: absolute;
        z-index: 2;

        .content {
            width: 45em;
            height: auto;
            border-radius: 1em;
            box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
            padding: 3em;
            background: var(--b-white);
            position: relative;

            @media screen and (max-width: 768px){
                width: 90%;
                height: auto;
                padding: 3vw;
            }

            .close {
                position: absolute;
                right: 1em;
                top: 1em;
                cursor: pointer;

                @media screen and (max-width: 768px){
                    right: 3vw;
                    top: 3vw;
                }
            }

            .block {
                margin: 1em 0;
                display: flex;
                justify-content: space-between;

                @media screen and (max-width: 768px) {
                    margin: 5vw;
                }

                label {
                    font-size: 1em;
                    font-weight: 600;

                    @media screen and (max-width: 768px) {
                        font-size: 3vw;
                        margin-right: 2vw;
                    }
                }

                input {
                    width: 70%;
                    font-size: 1em;
                    border-radius: 0.6em;
                    border: 1px solid var(--b-gray);
                    padding: 0.5em;
                    margin-left: 1em;

                    &#userPassword {
                        cursor: pointer;
                    }

                    @media screen and (max-width: 768px) {
                        font-size: 3vw;
                        border: 0.5vw solid var(--b-gray);
                        padding: 1vw;
                        margin-left: 2vw;
                    }
                }
            }
        }
    }
</style>