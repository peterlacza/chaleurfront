<template>
    <div class="container">
        <template v-if="recipeId ? recipe=actRecipe : recipe=categoryWinner">
            <div class="tile is-gapless is-ancestor">
                <div class="tile is-vertical is-12">
                    <div class="tile">
                            <article class="tile is-child notification">
                                <p class="title">{{ recipe.name }}
                                    <b-icon v-if="recipe.id===categoryWinner.id" type="is-warning" icon="trophy"></b-icon>
                                        <b-button
                                                v-if="recipeId && recipe.id !== categoryWinner.id"
                                                icon-left="external-link-alt"
                                                type="is-dark"
                                                @click="hrefToWinner(subCategoryCode)">
                                            Jump to category No.1
                                        </b-button>
                                </p>
                                <p class="rate">
                                    {{getRecipeRate(0, recipe.id)}}
                                    <b-rate v-model="recipeRate[0]"
                                            disabled>
                                    </b-rate>
                                </p>
                            </article>
                    </div>

                    <div class="tile">
                        <div class="tile is-parent">
                            <article class="tile is-child notification ">
                                <figure class="image is-4by3">
                                    <img v-if="recipe.picture" v-bind:src="'data:image/png;base64,'+recipe.picture.picByte" />
                                    <img v-else src="http://laczapeter95.web.elte.hu/kepek/recipe.png" />
                                </figure>
                                <br>
                                <div class="columns">
                                    <div class="column is-2" v-for="(nutri, index) in getTopNutrients(recipe)" :key="index">
                                        {{ nutri.nutrient.code }}
                                        <b-progress
                                                type="is-info"
                                                :value="calcNutri(nutri.value, recipe)"
                                                :max="calcNutriRef(nutri.nutrient.code)"
                                                show-value format="percent">
                                            {{calcNutri(nutri.value, recipe)}} / {{ calcNutriRef(nutri.nutrient.code) }}
                                            <span style=" text-transform: lowercase; font-weight: lighter">
                                                    {{ nutri.nutrient.unit.code }}
                                                </span>
                                        </b-progress>
                                    </div>
                                    <div class="column is-2 showAll">
                                        <b-button type="is-link is-outlined" @click="isComponentModalActive = true">Show all</b-button>
                                    </div>
                                </div>

                            </article>
                        </div>
                        <div class="tile is-parent is-vertical">
                            <article class="tile is-child notification ">
                                <p class="title">Recipe ingredients</p>
                                <li v-for="(ingredient, ingredientIndex) in recipe.ingredients"  v-bind:key="ingredientIndex">
                                    {{ ingredient.food.name}} <strong> {{ ingredient.amount }} {{ ingredient.unit.name }}</strong>
                                </li>
                                <b-button @click="addFavourite(recipe)" type="is-danger" style="margin-top: 10px" icon-left="heart" :disabled="isBtnDisabled(recipe)">Add to favourites</b-button>
                            </article>

                            <article class="tile is-child notification ">
                                <b-collapse :open="true"  aria-id="contentIdForA11y1">

                                    <b-button
                                            icon-left="utensil-spoon"
                                            class="button is-dark"
                                            slot="trigger"
                                            aria-controls="contentIdForA11y1">Eat this</b-button>

                                    <div class="notification">
                                        <b-field label="Amount" label-position="on-border">
                                            <b-input  v-model="amount" type="number" min="1" max="10" class="amountInput" placeholder="Amount"></b-input>
                                        </b-field>
                                        <b-field label="Unit" label-position="on-border">
                                            <b-select @input="setSelectedUnit(selectedUnit)" v-model="selectedUnit" class="amountInput" placeholder="Unit" icon="filter">
                                                <option v-for="(recipeUnit, index) in recipe.recipeUnits" :key="index" :value="recipeUnit"> {{ recipeUnit.unit.name }} ({{ recipeUnit.mass }}g) </option>
                                            </b-select>
                                        </b-field>
                                        <button @click="consumeRecipe(recipe, amount, unit)" class="button is-dark is-outlined">
                                            <strong>Add to consumptions</strong>
                                        </button>
                                    </div>
                                </b-collapse>
                            </article>
                        </div>
                    </div>
                    <div class="tile is-parent">
                        <article class="tile is-child notification ">
                            <p class="subtitle"> {{ recipe.description }}</p>
                        </article>
                    </div>

                </div>
            </div>
            <div class="tile is-gapless is-ancestor">
                <div class="tile is-vertical is-12">
                    <div class="tile">
                        <div class="tile is-parent is-vertical">
                            <article class="tile is-child notification is-warning">
                                <p @click="scrollToDown" class="title">Recipe variations</p>
                            </article>
                            <article class="tile is-child notification is-warning">
                                <div class="recipeVariations">
                                    <div class="recipe" v-for="(recipe, recipeIndex) in filteredRecipes" v-bind:key="recipeIndex">
                                        <div class="columns" v-if="recipeId ? recipeId != recipe.id : !recipe.isCategoryWinner">
                                            <div class="column is-2">
                                                <a :href="getRecipeHref(recipe.id)" style="text-decoration:none">
                                                    <img v-if="recipe.picture" v-bind:src="'data:image/png;base64,'+recipe.picture.picByte" />
                                                    <img v-else src="http://laczapeter95.web.elte.hu/kepek/recipe.png" />
                                                </a>
                                                <div class="rate">
                                                    {{getRecipeRate(recipeIndex, recipe.id)}}
                                                    <b-rate v-model="recipeRate[recipeIndex]"
                                                            disabled>
                                                    </b-rate>
                                                </div>
                                            </div>
                                            <div class="columns is-mobile is-multiline is-centered">
                                                <div class="column is-narrow recipeDetails">
                                                    <a style="text-decoration:none" @click="scrollToTop()" :href="getRecipeHref(recipe.id)" class="subtitle">
                                                        {{ recipe.name }}
                                                        <b-icon v-if="recipe.id===categoryWinner.id" type="is-warning" icon="trophy"></b-icon>
                                                    </a> <br>
                                                    <a style="text-decoration:none" :href="getUserHref(recipe.owner)" v-if="recipe.owner" class="is-small">@{{ recipe.owner.username }}</a><br>
                                                    <i v-for="(actFile, index) in getDiets(recipeIndex)" :key="index">
                                                        <img v-if="generateSrc(actFile)" :src="generateSrc(actFile, recipeIndex)" style="width: 64px"/>
                                                    </i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </article>
                        </div>
                    </div>
                </div>
            </div>

            <b-modal :active.sync="isComponentModalActive"
                     trap-focus
                     :destroy-on-hide="false"
                     aria-role="dialog"
                     aria-modal>
                <consumption-modal :recipe="recipe"></consumption-modal>
            </b-modal>
        </template>
    </div>
</template>

<script>
    import ConsumptionModal from "@/components/ConsumptionModal";

    export default {
        name: "Recipe",
        components:{
            ConsumptionModal
        },
        watch: {
            recipeId: function() {
                this.$store.dispatch("getRecipesBySubCategory", this.subCategoryCode);
                if (this.recipeId) {
                    this.$store.dispatch("getActRecipe", this.recipeId);
                }
            }
        },
        data() {
            return {
                isComponentModalActive: false,
                expanded: false,
                size: null,
                type: null,
                amount:1,
                selectedUnit:null,
                error:null,
                badRequest:false,
                recipeRate:[]
            }
        },
        computed: {
            params() {
                return this.$store.getters.paramList;
            },

            filteredRecipes() {
                let recipes = this.$store.getters.recipesBySubCategory;
                if(this.selected && this.selected.length > 0){

                    let recipesOut = [];
                    for(let r in recipes){
                        let okay = false;
                        for(let s in this.selected){
                            okay = false;
                            for(let c in recipes[r].categories){
                                if(recipes[r].categories[c].categoryType === "DIET"){
                                    if(recipes[r].categories[c].categoryValue === this.selected[s]){
                                        okay = true;
                                        break;
                                    }
                                }
                            }
                            if(!okay){
                                break;
                            }
                        }
                        if(okay){
                            recipesOut.push(recipes[r])
                        }
                    }
                    return recipesOut;
                }
                else{
                    return recipes;
                }
            },
            actRecipe(){
                return this.$store.getters.actRecipe;
            },
            categoryWinner(){
                return this.$store.getters.categoryWinner;
            },
            nutrientReference(){
                return this.$store.getters.nutrientReference;
            },
        },
        methods: {
            consumeRecipe(recipe){
                if(this.selectedUnit){
                    if(localStorage.getItem("user")){
                        let obj = {
                            recipe: recipe,
                            amount: this.amount,
                            recipeUnit: this.selectedUnit
                        };
                        this.$store.dispatch("consumeRecipe", obj);
                        this.$router.push("/consumptions")
                    } else{
                        this.$router.push("/login");
                    }
                } else{
                    this.consumeError();
                }
            },
            getDiets(index){
                let categories = this.filteredRecipes[index].categories;
                let diets = [];
                for(let cat in categories){
                    if(categories[cat].categoryType === "DIET"){
                        diets.push(categories[cat].categoryValue);
                    }
                }
                return diets;
            },
            generateSrc(fileName){
                let src = null;
                let dietsWithPic = ["EGGFREE","GLUTFREE","MILKFREE","SUCSFREE","VEGAN"];
                for(let d in dietsWithPic){
                    if(dietsWithPic[d] === fileName){
                        let path = "http://laczapeter95.web.elte.hu/kepek/diets/";
                        let fileType = ".svg";
                        src = path+fileName+fileType;
                    }
                }
                return src;
            },
            setSelectedUnit(selectedUnit){
                this.selectedUnit = selectedUnit;
            },
            consumeError() {
                this.$buefy.notification.open({
                    duration: 3500,
                    message: `If you logged in, select a unit`,
                    position: 'is-bottom-right',
                    type: 'is-danger',
                    hasIcon: true
                })
            },
            favError() {
                this.$buefy.notification.open({
                    duration: 3500,
                    message: `Please login before!`,
                    position: 'is-bottom-right',
                    type: 'is-danger',
                    hasIcon: true
                })
            },
            addFavourite(recipe){
                if(localStorage.getItem("user")){
                    this.$store.dispatch("addFavourite", recipe.id);
                    this.$router.go()
                } else{
                    this.favError();
                }

            },
            getRecipeHref(recipeId){
                return "#/recipe/"+this.subCategoryCode+"/"+recipeId;
            },
            getUserHref(user){
                if(user){
                    return "#/user/"+user.username;
                }
            },
            hrefToWinner(subCategoryCode){
                let toGo = "/recipe/"+subCategoryCode;
                this.$router.push(toGo)
            },
            scrollToTop(){
                window.scrollTo(0,0);
            },
            scrollToDown(){
                window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
            },
            getRecipeRate(index, recipeId){
                let rateValue = 0;

                for(let r in this.recipesBySubCategory){
                    if(this.recipesBySubCategory[r].id === recipeId){
                        for(let rate in this.recipesBySubCategory[r].ratings){
                            rateValue += this.recipesBySubCategory[r].ratings[rate].rate;
                            break;
                        }
                        rateValue = rateValue / this.recipesBySubCategory[r].ratings.length;
                        break;
                    }
                }
                this.recipeRate[index] = rateValue;
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
                    return myNutri.dailyRecommend;
                } else{
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
            },
            isBtnDisabled(recipe){
                let favourites = this.$store.getters.userFavourites;
                for(let f in favourites){
                    if(favourites[f].id === recipe.id){
                        return true;
                    }
                }
                return false;
            }
        },
        mounted() {
            this.$store.dispatch("getRecipesBySubCategory", this.subCategoryCode);
            this.$store.dispatch("getCategoryWinner", this.subCategoryCode);
            this.$store.dispatch("getNutrientReference");
            this.$store.dispatch("getFavourites", this.$store.getters.actUser.username);

            if(this.recipeId){
                this.$store.dispatch("getActRecipe", this.recipeId);
            }
        },
        props:{
            subCategoryCode : String,
            recipeId: String,
            selected: Array
        }
    }
</script>

<style lang="scss" scoped>

    .tile.is-gapless {
        .tile.is-parent {
            padding: 0;
        }
        .tile.is-vertical>.tile.is-child {
            margin-bottom: 0 !important;
        }
        .notification {
            border-radius: 0;
            background-color: rgba(213, 224, 224, 0.6);
        }
    }

    p.rate{
        max-width: 150px;
        border-radius: 5px;
    }

    .recipeVariations{
        max-height: 350px;
        overflow-y: scroll;
        overflow-x: hidden;
        padding-top: 20px;
    }

    .recipe:hover{
        background-color: rgba(105, 105, 105, 0.22);
    }
    .recipeDetails{
        padding: 20px;
    }

    .content{
        padding: 3rem;
    }

    .amountInput{
        width: 8rem;
    }

</style>