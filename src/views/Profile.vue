<template>
    <section>
        <div class="container has-text-centered">
            <div class="profilePic">
                <figure class="image is-128x128">
                    <img class="is-rounded" v-if="actProfile.username == actUser.username && actUser.avatar" v-bind:src="'data:image/png;base64,'+actUser.avatar.picByte" />
                    <img class="is-rounded" v-else src="http://laczapeter95.web.elte.hu/kepek/userAvatar.png" />
                </figure>
            </div>

            <p class="subtitle"> @{{actProfile.username}}</p>
            <div v-if="actProfile.username !== actUser.username">
                <div v-if="showFollow()">
                    <b-button @click="followUser" class="is-success is-outlined"> Follow </b-button>
                </div>
                <div v-else>
                    <b-button @click="unFollow" class="is-danger is-outlined"> Unfollow </b-button>
                </div>
            </div>
            <div class="introduction">
                {{ actProfile.introduction }}
            </div>

            <div class="detailTabs">
                <b-tabs position="is-centered" class="block">
                    <b-tab-item label="Recipes" icon="utensils">
                        <div class="columns" v-for="(recipe, index) in userRecipes" :key="index">
                            <div class="column">
                                <a :href="getRecipeHref(recipe)" >
                                    <figure class="image is-128x128">
                                        <img v-if="recipe.picture" v-bind:src="'data:image/png;base64,'+recipe.picture.picByte" />
                                        <img v-else src="http://laczapeter95.web.elte.hu/kepek/recipe.png" />
                                    </figure>
                                </a>
                            </div>
                            <div class="column">
                                <a :href="getRecipeHref(recipe)" class="subtitle is-5"> {{ recipe.name }} </a>
                                <i v-if="actProfile.username == actUser.username" class="subtitle is-5 deleteIcon" @click="deleteRecipe(recipe.id)">(x)</i>
                            </div>
                            <div v-if="recipe.description" class="column description">
                                {{ descriptionCut(recipe.description) }}
                            </div>
                        </div>
                    </b-tab-item>
                    <b-tab-item label="Followers" icon="thumbs-up">
                        <div v-for="(user, index) in followers" :key="index" class="columns is-gapless is-mobile">
                            <div class="column is-6">
                                <figure class="image is-32x32 ">
                                    <img v-if="user.avatar" v-bind:src="'data:image/png;base64,'+user.avatar.picByte" />
                                    <img v-else src="http://laczapeter95.web.elte.hu/kepek/userAvatar.png" />
                                </figure>
                            </div>
                            <div class="column is-6 has-text-left">
                                <a :href="getUserHref(user.username)" class="subtitle is-4"> @{{ user.username }}</a>
                            </div>
                        </div>
                    </b-tab-item>
                    <b-tab-item label="Favourites" icon="heart">
                        <div class="columns" v-for="(recipe, index) in userFavourites" :key="index">
                            <div class="column">
                                <figure class="image is-128x128">
                                    <img src="http://laczapeter95.web.elte.hu/kepek/recipe.png" />
                                </figure>
                            </div>
                            <div class="column">
                                {{ recipe.name }}
                                <br>
                                <div @click="removeFavourite(recipe.id)" style="padding-top: 15px" >
                                    <b-button icon-left="trash-alt" type="is-danger is-outlined"> remove </b-button>
                                </div>
                            </div>
                            <div class="column description">
                                {{ descriptionCut(recipe.description) }}
                            </div>
                        </div>
                    </b-tab-item>
                </b-tabs>
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        name: "User",
        watch: {
            userName: function() {
                this.$router.go();
            }
        },
        computed:{
            actUser(){
                return this.$store.getters.actUser;
            },
            actProfile(){
                return this.$store.getters.userProfile;
            },
            userRecipes(){
                return this.$store.getters.userRecipes;
            },
            followings(){
                return this.$store.getters.followings;
            },
            followers(){
                return this.$store.getters.followers;
            },
            userFavourites(){
                return this.$store.getters.userFavourites;
            }
        },
        methods:{
            descriptionCut(description){
                return description.substr(0,120).concat('...');
            },
            followUser(){
                this.$store.dispatch("followUser", this.userName);
                this.$router.go();
            },
            unFollow(){
                this.$store.dispatch("unfollow", this.userName);
                this.$router.go();
            },
            showFollow(){
                for(let f in this.followings){
                    if(this.followings[f].username === this.userName){
                        return false;
                    }
                }
                return true;
            },
            deleteRecipe(recipeId){
                this.$store.dispatch("deleteRecipe", recipeId);
                this.$router.go();
            },
            removeFavourite(recipeId){
                this.$store.dispatch("removeFavourite", recipeId);
                this.$router.go();
            },
            getUserHref(username){
                return "#/user/"+username;
            },
            getRecipeHref(recipe){
                return "#/recipe/"+this.getSubCategoryCode(recipe)+"/"+recipe.id;
            },
            getSubCategoryCode(recipe){
                for(let c in recipe.categories){
                    if(recipe.categories[c].categoryType === "SUBCATEGORY"){
                        return recipe.categories[c].categoryValue;
                    }
                }
            }
        },
        mounted() {
            this.$store.dispatch("getUserRecipes", this.userName);
            this.$store.dispatch("getUserProfile", this.userName);
            this.$store.dispatch("getFollowings");
            this.$store.dispatch("getFollowers", this.userName);
            this.$store.dispatch("getFavourites", this.userName);
        },
        props:{
            userName: String
        }
    }
</script>

<style scoped>
    .container{
        margin-top: 2rem;
        padding: 10px;
        width: 50%;
        background-color: rgba(213, 224, 224, 0.6);
        border-radius: 5px;
    }
    .columns{
        background-color: rgba(213, 224, 224, 0.3);
        margin-top: 1rem;
    }
    .image{
        margin: 0 auto;
    }
    .introduction{
        padding: 10px 10%;
    }
    i.deleteIcon{
        color: red;
    }

    .profilePic{
        height: 150px;
        width: 150px;
        margin: 0 auto 20px;
    }


</style>