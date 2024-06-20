<script setup>
    import { ref, onMounted, watch } from 'vue';
    
    // Importing the useUserStore function from the store
    const useUser = useUserStore();
    const emits = defineEmits(['close']);   // Define emits for closing the modal

    const userInfo = ref(null); // Variable to store the user info

    onMounted(async () => {
        userInfo.value = await useUser.getUserInfo();   // Get the user info
    });
</script>

<template>
    <div class="container">
        <div class="content">
            <Icon @click="$emit('close')" class="close" name="ic:baseline-close" />

            <div class="block" v-if="userInfo">
                <label>Name:</label>
                <input type="text" name="userName" id="userName" :value="`${userInfo?.First_Name__c} ${userInfo?.Last_Name__c}`" disabled>
            </div>

            <div class="block" v-if="userInfo">
                <label>Email:</label>
                <input type="email" name="userEmail" id="userEmail" :value="userInfo?.Email__c" disabled>
            </div>

            <h4 v-if="!userInfo">Loading...</h4>
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