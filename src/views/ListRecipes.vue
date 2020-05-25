<template>
    <div class="container is-fluid">
        <div class="categoryContent">
            <div class="column is-full filterGroup">
            <div class="columns is-gapless" id="filter">
                <div class="column is-6">
                    <p class="title" > Selected category: <strong style="color: red"> {{ getDesc(this.mainCategoryCode) }} </strong></p>
                </div>
                <div class="columns is-gapless is-multiline">
                    <div class="column is-12">
                        <p class="subtitle" style="margin-right: 20px; margin-bottom: 10px; color: whitesmoke">Set your diet filters</p>
                    </div>
                    <div class="column is-12">
                        <b-checkbox-button v-model="selectedDiets"
                                           native-value="VEGAN"
                                           type="is-success">
                            <b-icon icon="seedling"></b-icon>
                            <p>Vegan </p>
                        </b-checkbox-button>
                    </div>
                    <div class="column">
                        <b-checkbox-button v-model="selectedDiets"
                                           native-value="EGGFREE"
                                           type="is-danger">
                            <b-icon icon="egg"></b-icon>
                            <p>Egg <strong>free</strong> </p>
                        </b-checkbox-button>
                    </div>
                    <div class="column">
                        <b-checkbox-button v-model="selectedDiets"
                                           native-value="GLUTFREE"
                                           type="is-danger">
                            <b-icon icon="bread-slice"></b-icon>
                            <p>Gluten <strong>free</strong> </p>
                        </b-checkbox-button>
                    </div>
                    <div class="column">
                        <b-checkbox-button v-model="selectedDiets"
                                           native-value="MILKFREE"
                                           type="is-danger">
                            <b-icon icon="coffee"></b-icon>
                            <p>Milk <strong>free</strong> </p>
                        </b-checkbox-button>
                    </div>
                    <div class="column">
                        <b-checkbox-button v-model="selectedDiets"
                                           native-value="SUCSFREE"
                                           type="is-danger">
                            <b-icon icon="candy-cane"></b-icon>

                            <p>Sugar <strong>free</strong> </p>
                        </b-checkbox-button>
                    </div>

                </div>
            </div>

        </div>

            <div class="recipes">
                <div v-if="categories.length > 0" class="columns is-multiline">
                    <div class="column is-3" v-for="(category, index) in categories" v-bind:key="index">
                        <figure class="image is-3by2yy">
                            <router-link
                                    :to="{name:'recipe', params: {subCategoryCode: category.subCategoryCode, selected: selectedDiets}}">
                                <CategoryBox :pic-name="category.subCategoryDescription" :pic-code="category.subCategoryCode" > </CategoryBox>
                            </router-link>
                        </figure>
                    </div>
                </div>
                <div v-else>
                    <p class="title is-1" style="color:black; margin:0;padding: 0;text-align: center">
                        There is no result.
                    </p>
                    <p style="text-align: center">
                        <b-icon
                                pack="fas"
                                icon="frown-open"
                                size="is-large"
                                >
                        </b-icon>
                    </p>

                </div>
            </div>
    </div>
    </div>

</template>

<script>
    import CategoryBox from "@/components/CategoryBox";
    export default {
        name: "ListRecipes",
        components: {CategoryBox},
        data: function(){
            return{
                selectedDiets: []
            }
        },
        watch: {
            selectedDiets: {
                deep: true,
                handler: function (dietList) {
                    this.$store.dispatch("getSubCategoriesWithParams", {mainCategoryCode: this.mainCategoryCode, dietList: dietList});
                }
            }
        },
        computed: {
            categories() {
                return this.$store.getters.subCategories;
            },
            mainCategories(){
                return this.$store.getters.mainCategories
            }
        },
        methods: {
            getDesc(code){
                for(let c in this.mainCategories){
                    if(this.mainCategories[c].mainCategoryCode === code){
                        return this.mainCategories[c].mainCategoryDescription;
                    }
                }
                return code;
            }
        },
        mounted() {
            this.$store.dispatch("getSubCategories", this.mainCategoryCode);
        },
        props:{
            mainCategoryCode : String
        }
    };
</script>

<style scoped>
    .container{
        min-height: 850px;
        border-radius: 5px;
        padding: 50px;
        background-color: rgba(213, 224, 224, 0.6);
    }

    .categoryContent{
        max-width: 75%;
        margin: 0 auto;
    }

    .recipes{
        max-width: 80%;
        margin: 0 auto;
    }

    p.title{
        color: whitesmoke;
    }

    .filterGroup{
        background-color: rgba(27, 29, 29, 0.68);
        border-radius: 10px;
        margin-top: 20px;
        margin-bottom: 20px;
    }

    #filter{
        padding: 30px;
    }

</style>