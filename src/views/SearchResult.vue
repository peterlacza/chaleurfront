<template>
    <div class="container">
        <p class="title is-1"> Results of <strong style="color:red">{{ searchValue }}</strong></p>
        <hr class="divider">
        <div class="content">
            <div class="columns is-multiline" v-if="searchResult && searchResult.length > 0">
                <div class="column is-2" v-for="(recipe, index) in searchResult" :key="index">
                    <div class="card latest">
                        <div class="card-image">
                            <a :href="getRecipeHref(recipe)">
                                <img v-if="recipe.picture" v-bind:src="'data:image/png;base64,'+recipe.picture.picByte" />
                                <img v-else src="http://laczapeter95.web.elte.hu/kepek/dish4.png" />
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
                <p class="error"> No result </p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SearchResult",
        watch: {
            searchValue(){
                this.getSearchResult();
            }
        },
        data(){
            return{
                isLoading:true,
            }
        },
        computed:{
            searchResult(){
                return this.$store.getters.searchResult;
            }
        },
        methods:{
            getRecipeHref(recipe){
                let subcategoryCode = this.getSubCategoryCode(recipe);
                return "#/recipe/"+subcategoryCode+"/"+recipe.id;
            },
            getSubCategoryCode(recipe){
                for(let c in recipe.categories){
                    if(recipe.categories[c].categoryType === "SUBCATEGORY"){
                        return recipe.categories[c].categoryValue;
                    }
                }
            },
            getRecipeDate(recipeDate){
                let returnDate = new Date(recipeDate);
                return returnDate.toLocaleDateString();
            },
            descriptionCut(description){
                return description.substr(0,60).concat('...');
            },
            getSearchResult(){
                if(this.searchValue.length > 3){
                    this.$store.dispatch("clearSearchHistory");
                    this.$store.dispatch("getSearchResults", this.searchValue);
                }
            }
        },
        props:{
            searchValue : String
        },
        mounted(){
            this.getSearchResult();
        }
    }
</script>

<style langs="scss" scoped>
    .container{
        background-color: rgba(213, 224, 224, 0.6);
    }

    .content{
        max-height: 750px;
        overflow-y: scroll;
        overflow-x: hidden;
        padding: 50px;
        margin-top: 50px;
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

    .latest{
        border-radius: 5px;
    }
    .latest:hover{
        background-color: rgba(99, 99, 99, 0.30);
    }

    p.title{
        padding-left: 50px;
    }

    p.subtitle.recipeName{
        text-transform: lowercase;
        white-space: nowrap;
        overflow: hidden;
    }

    .error{
        text-align: center;
        font-size: xx-large;
        color: red;
    }
</style>