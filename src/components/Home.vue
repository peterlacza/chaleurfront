<template>
    <div class="container ">
        <div class="recommends">
            <p class="title rec"> Your daily recommends </p>
            <b-carousel-list v-if="recommendedRecipes" :data="recommendedRecipes" :items-to-show="1">
                <template slot="item" slot-scope="props">
                    <div class="card">
                        <div class="card-image">
                            <figure class="image is-16by9 is-fluid">
                                <a :href="getRecipeHref(props.list)">
                                    <img v-if="props.list.picture" v-bind:src="'data:image/png;base64,'+props.list.picture.picByte" />
                                    <img v-else src="http://laczapeter95.web.elte.hu/kepek/recipe.png" />
                                </a>

                            </figure>
                        </div>
                        <div class="card-content">
                            <a :href="getRecipeHref(props.list)"> <p class="title is-3 recipeName">{{ props.list.name }}</p> </a>
                            <p>
                                <strong><a :href="'#/user/'+props.list.owner.username"> @{{ props.list.owner.username }}</a></strong>
                                <small> {{ getRecipeDate(props.list.createdAt) }} </small>
                            </p>
                            <br>
                            <div class="columns">
                                <div class="column is-2" v-for="(nutri, index) in getTopNutrients(props.list)" :key="index">
                                    {{ nutri.nutrient.code }}
                                    <b-progress
                                            type="is-info"
                                            :value="calcNutri(nutri.value, props.list)"
                                            :max="calcNutriRef(nutri.nutrient.code)"
                                            show-value format="percent">
                                        {{calcNutri(nutri.value, props.list)}} / {{ calcNutriRef(nutri.nutrient.code) }}
                                        <span style=" text-transform: lowercase; font-weight: lighter">
                                            {{ nutri.nutrient.unit.code }}
                                        </span>
                                    </b-progress>
                                </div>
                                <div class="column is-2 showAll">
                                    <b-button type="is-link is-outlined" @click="isComponentModalActive = true">Show all</b-button>
                                </div>
                            </div>
                            <div class="columns">
                                <div class="column is-1" >
                                    <b-rate :value="calculateRate(props.list.ratings)" show-score disabled/>
                                </div>
                                <div class="column is-1 is-offset-8">
                                    <p class="control" style="margin-left: auto">
                                        <b-button @click="getClickHref(props.list)" icon-left="external-link-alt" type="is-dark">Check recipe</b-button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <b-modal :active.sync="isComponentModalActive"
                             trap-focus
                             :destroy-on-hide="false"
                             aria-role="dialog"
                             aria-modal>
                        <consumption-modal :recipe="props.list"></consumption-modal>
                    </b-modal>
                </template>
            </b-carousel-list>
            <div v-else>
                <p class="error"> There is not enough data, to recommend recipes. </p>
            </div>
            </div>

        <hr class="divider">

        <div class="latestContainer">
            <p class="title"> Latest recipes </p>
            <div class="columns latestColumns" v-if="latestRecipes && latestRecipes.length > 0">
                <div v-for="(recipe, index) in latestRecipes" :key="index" class="column is-3">
                    <div class="card latest">
                        <div class="card-image">
                            <a :href="getRecipeHref(recipe)">
                                <figure class="image is-4by3">
                                    <img v-if="recipe.picture" v-bind:src="'data:image/png;base64,'+recipe.picture.picByte" />
                                    <img v-else src="http://laczapeter95.web.elte.hu/kepek/recipe.png" />
                                </figure>

                            <p class="subtitle recipeName">
                                {{ recipe.name }}
                            </p>
                            </a>
                            <p>
                                <strong>
                                    <a :href="'#/user/'+recipe.owner.username"> @{{ recipe.owner.username }}</a>
                                </strong>
                                <small> {{ getRecipeDate(recipe.createdAt) }} </small>
                            </p>
                        </div>

                        <div class="card-content">
                            <div class="media-content">
                                <p> {{ descriptionCut(recipe.description) }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <p class="error"> You are not following anyone, so we cannot show the users latest recipes. Click follow under. </p>
            </div>

        </div>

        <hr class="divider">

        <div class="followingsContainer">
            <p class="title followingTitle"> Explore trending users </p>
            <div class="followings">
                <div class="columns has-text-centered">
                    <div class="column is-narrow user" v-for="(user, index) in recommendedUsers" :key="index">
                        <figure class="image is-128x128 userImage">
                            <a :href="'#/user/'+user.username" class="noLink">
                                <img class="is-rounded" style="max-height: 128px" v-if="user.avatar" v-bind:src="'data:image/png;base64,'+user.avatar.picByte" />
                                <img class="is-rounded" v-else src="http://laczapeter95.web.elte.hu/kepek/userAvatar.png" />
                            </a>
                        </figure>
                        <a :href="'#/user/'+user.username" class="noLink"> @{{ user.username }} </a>
                        <br>
                        <b-button @click="followUser(user.username)" class="is-success is-outlined"> Follow </b-button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import ConsumptionModal from "@/components/ConsumptionModal";

    export default {
        name: "Home",
        components:{
            ConsumptionModal
        },
        watch:{
            latestRecipes() {
                this.getUserRecommendation();
            }
        },
        data() {
            return{
                recipeModel : 0,
                noRecommend : null,
                isComponentModalActive: false,
            }
        },
        computed: {
            recommendedRecipes() {
                return this.$store.getters.recommendedRecipes;
            },
            actUser(){
                return this.$store.getters.actUser;
            },
            latestRecipes(){
                return this.$store.getters.latestRecipes;
            },
            recommendedUsers() {
                return this.$store.getters.recommendedUsers;
            },
            nutrientReference(){
                return this.$store.getters.nutrientReference;
            },
            nutrientValues(){
                return this.$store.getters.todayNutrientValues;
            }
        },
        methods: {
            calculateRate(ratings){
                if(ratings.length>0){
                    let sumOfRate = 0;
                    ratings.forEach(element => sumOfRate += element.rate);
                    return (sumOfRate / ratings.length);
                } else{
                    return 0;
                }
            },
            consumeRecipe(id){
                console.log("A user megeszi ezt: "+id);
            },
            descriptionCut(description){
                return description.substr(0,120).concat('...');
            },
            getUserRecommendation(){
                if(this.latestRecipes.length < 5){
                    this.$store.dispatch("recommendUsers");
                }
            },
            followUser(userName){
                this.$store.dispatch("followUser", userName);
                this.$router.go();
            },
            getRecipeDate(recipeDate){
                let returnDate = new Date(recipeDate);
                return returnDate.toLocaleDateString();
            },
            getRecipeHref(recipe){
                let subcategoryCode = this.getSubCategoryCode(recipe);
                return "#/recipe/"+subcategoryCode+"/"+recipe.id;
            },
            getClickHref(recipe){
                let subcategoryCode = this.getSubCategoryCode(recipe);
                let toGo = "/recipe/"+subcategoryCode+"/"+recipe.id;
                this.$router.push(toGo)
            },
            getSubCategoryCode(recipe){
                for(let c in recipe.categories){
                    if(recipe.categories[c].categoryType === "SUBCATEGORY"){
                        return recipe.categories[c].categoryValue;
                    }
                }
            },
            getTopNutrients(recipe){
                let nutrientToShow = []
                for(let nutri in recipe.nutrientValues){
                    if(recipe.nutrientValues[nutri].nutrient.topSelect){
                        nutrientToShow.push(recipe.nutrientValues[nutri]);
                    }
                }
                return nutrientToShow;
            },
            calcNutriRef(nutrientCode){
                let myNutri = this.nutrientReference.find(nutrient => nutrient.nutrientCode === nutrientCode);
                if(myNutri){
                    //console.log("Nutri code: ["+nutrientCode+"] | Nutri value: ["+myNutri.dailyRecommend+"]");
                    return myNutri.dailyRecommend;
                } else{
                    //console.log("Nutri code: ["+nutrientCode+"] | Nutri value: ["+myNutri+"]");
                    return 100;
                }
            },
            calcNutri(nutriValue, recipe){
                let multiply = 0;
                for(let unit in recipe.recipeUnits){
                    if(recipe.recipeUnits[unit].unit.code === "PORTM"){
                        multiply = recipe.recipeUnits[unit].mass / 100;
                        break;
                    }
                }
                return Math.round(multiply * nutriValue * 10) / 10;
            }
        },
        mounted() {
            this.$store.dispatch('getRecommendation');
            this.$store.dispatch("getNutrientReference")
            this.$store.dispatch("getLatests");
            this.$store.dispatch("getTodayNutrientValues", new Date().toLocaleDateString());
        },
    }
</script>

<style lang="scss" scoped>
    .container{
        background-color: rgba(213, 224, 224, 0.6);
    }

    .recommends{
        width: 50%;
        object-fit: scale-down;
        margin: 0 auto;
    }

    .card{
        background-color: rgba(213, 224, 224, 0);
        border: none;
        border-radius: 5px;
    }

    hr.divider{
        border: 1px solid rgba(85, 81, 81, 0.50);
        max-width: 75%;
        margin: 30px auto;
    }

    .latestContainer{
        margin-left: 30px;
    }
    .latestColumns{
        margin: 0 auto;
    }
    .latest{
        border-radius: 5px;
    }
    .latest:hover{
        background-color: rgba(99, 99, 99, 0.30);
    }

    .followings{
        margin-left: 30px;
        min-height: 250px;
        overflow-x: auto;
        //background-color: rgba(99, 99, 99, 0.2);
        border-radius: 5px;
    }
    p.followingTitle{
        margin-left: 30px;
        margin-bottom: 50px;
    }

    .userImage{
        margin:0 auto;
    }

    .user:hover{
        background-color: rgba(99, 99, 99, 0.30);
        border-radius: 5px;
    }

    p.username{
        text-align: center;
    }

    p.title.rec{
        padding-top: 10px;
        text-align: center;
    }

    p.subtitle.recipeName{
        text-transform: lowercase;
        font-weight: bold;
    }

    .subtitle.recipeName::first-letter{
        text-transform: capitalize;
    }

    p.title.recipeName{
        text-transform: lowercase;
        font-weight: bold;
    }

    .title.recipeName::first-letter{
        text-transform: capitalize;
    }

    .noLink{
        color: black;
    }
    .error{
        font-size: large;
        font-weight: lighter;
        color: red;
    }

</style>