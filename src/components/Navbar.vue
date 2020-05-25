<template>
    <b-navbar>
        <template slot="brand">
            <b-navbar-item tag="router-link" :to="{ path: '/' }">
                <img src="../assets/bulma-logo.png">
            </b-navbar-item>
        </template>
        <template slot="start">

            <b-navbar-item tag="router-link" :to="{ path: '/' }">
                Home
            </b-navbar-item>
            <b-navbar-item tag="router-link" :to="{ path: '/browse' }">
                Browse
            </b-navbar-item>
            <b-navbar-item tag="router-link" :to="{ path: '/add-recipe' }">
                Add recipe
            </b-navbar-item>


            <b-navbar-dropdown label="User stuff">
                <b-navbar-item tag="router-link" :to="{ path: '/consumptions' }">
                    Consumption
                </b-navbar-item>
                <b-navbar-item v-if="actUser" tag="router-link" :to="{ path: '/user/'+actUser.username }">
                    Profile
                </b-navbar-item>
            </b-navbar-dropdown>

            <b-navbar-item>
                <b-field grouped>
                    <b-input v-model="searchValue" placeholder="Search..." icon="search" minlength="4"></b-input>
                    <p class="control">
                        <button class="button is-primary" @click="searchRecipe">Search</button>
                    </p>
                </b-field>
            </b-navbar-item>


        </template>

        <template slot="end">
            <b-navbar-item tag="div">
                <div class="buttons">
                    <a v-if="!actUser" class="button is-primary" href ="#/register">
                        <strong>Sign up</strong>
                    </a>
                    <div v-if="actUser" class="button is-info">Hello {{ actUser.username }} </div>
                    <p v-if="actUser" class="button is-danger" @click="signOut()">Sign out  </p>
                    <a v-if="!actUser" class="button is-light" href ="#/login">
                        Log in
                    </a>
                </div>
            </b-navbar-item>
        </template>
    </b-navbar>

</template>



<script>

    import {userService} from "@/auth/user.service";

    export default {
        name: "Navbar",
        data(){
            return{
                searchValue:null
            }
        },
        computed: {
            actUser(){
                return this.$store.getters.actUser;
            }
        },
        methods: {
            signOut(){
                userService.logout();
                location.reload();
            },
            searchRecipe(){
                if(this.searchValue.length > 3){
                    this.$router.push("/search-result/"+this.searchValue);
                    this.searchValue = null;
                }
            }
        },
        mounted(){
            let user = JSON.parse(localStorage.getItem('user'));
            if(user){
                this.$store.dispatch("setActUser", user);
            }
        }
    }
</script>

<style>

</style>