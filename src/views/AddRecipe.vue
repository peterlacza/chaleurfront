<template>
    <div class="container">
        <b-loading :is-full-page="true" :active.sync="isLoading" :can-cancel="true">
            <b-icon
                    pack="fas"
                    icon="sync-alt"
                    size="is-large"
                    custom-class="fa-spin">
            </b-icon>
        </b-loading>

        <div class="content">
            <p class="title"> Add new recipe </p>
            <hr>
            <div class="columns is-mobile is-multiline">
                <div class="column">
                    <b-field label="Name">
                        <b-input v-model="recipeName" placeholder="Recipe name"></b-input>
                    </b-field>
                </div>
                <div class="column is-narrow">
                    <b-field label="Image">
                        <b-upload v-model="file" accept='image/*'>
                            <a :class="!file ? 'button is-dark is-outlined' : 'button is-success is-outlined'">
                                <b-icon v-if="!file" icon="upload"></b-icon>
                                <b-icon v-else icon="image"></b-icon>
                                <span v-if="!file">Select image</span>
                                <span v-else>Image OK</span>
                            </a>
                        </b-upload>
                    </b-field>
                </div>
            </div>

            <b-field label="Description">
                <b-input v-model="recipeDescription" maxlength="200" placeholder="Recipe description" type="textarea"></b-input>
            </b-field>

            <div class="ingredients">
                <div class="label">
                    <span class="labelSub"> Ingredients </span>
                    <b-button size="is-small"
                              type="is-text"
                              @click="ingredientNum>1 ? ingredientNum-- : ingredientNum"
                              icon-left="minus-circle">
                    </b-button>
                    <b-button type="is-text"
                              size="is-small"
                              @click="ingredientNum<12 ? ingredientNum++ : ingredientNum"
                              icon-left="plus-circle">
                    </b-button>
                </div>
                <b-field v-for="index in ingredientNum" v-bind:key="index">
                    <b-autocomplete
                            @focus="setIngredientIndex(index) "
                            class="ingredientSelect"
                            v-if="foods"
                            v-model="selectedIngredients[index]"
                            rounded
                            :data="filteredDataObj"
                            field="name"
                            placeholder="e.g. tomato"
                            icon="search"
                            clearable
                            @select="option => selected[index] = option">
                        <template slot="empty">No results found</template>
                    </b-autocomplete>
                    <b-numberinput @input="setIngredientAmount" class="ingredientSelect" min=1 max=100 type="is-dark"></b-numberinput>
                    <b-select @input="setIngredientUnit" v-if="selected[index]" placeholder="Select unit">
                        <option
                                v-for="unit in selected[index].foodUnits"
                                :value="unit.unit"
                                :key="unit.unit.code">
                            {{ unit.unit.name }} ({{ unit.mass }}g)
                        </option>
                    </b-select>
                </b-field>
            </div>

            <div class="category">
                <p class="label">Category</p>
                <div class="columns">
                    <div class="column is-4">
                        <b-field label="Main category"
                                 label-position="on-border">
                            <b-select @input="getSubCategories"
                                      v-model=mainCategoryCode
                                      label="Main category" placeholder="Select MAIN category">
                                <option
                                        v-for="(mainCategory, index) in mainCategories"
                                        :value="mainCategory.mainCategoryCode"
                                        :key="index">
                                    {{ mainCategory.mainCategoryDescription }}
                                </option>
                            </b-select>
                        </b-field>
                    </div>
                    <div v-if="subCategories.length > 0" class="column is-4">
                        <b-field label="Subcategory"
                                 label-position="on-border">
                            <b-select v-model="subCategoryCode"
                                      placeholder="Select SUB category">
                                <option
                                        v-for="(sub, index) in subCategories"
                                        :value="sub.subCategoryCode"
                                        :key="index">
                                    {{ sub.subCategoryDescription }}
                                </option>
                            </b-select>
                        </b-field>
                    </div>
                </div>
            </div>

            <div class="recipeTags">
                <p class="label">Recipe tags</p>

            </div>
                <div class="columns" v-for="index in recipeTagNum" :key="index">
                    <div v-if="categoryTypes" class="column is-4">
                        <b-field label="Tag type" label-position="on-border">
                            <b-select @input="getValues"
                                      placeholder="Tag type"
                                      v-model="actCategoryType">
                                <option v-for="(categType, index) in categoryTypes" :key="index">
                                    {{ categType }}
                                </option>
                            </b-select>
                        </b-field>
                    </div>
                    <div v-if="categoryTypes" class="column">
                        <b-taginput
                                @input="setCategoryType"
                                v-model="tags"
                                :data="filteredTags"
                                autocomplete
                                :allow-new=false
                                open-on-focus
                                field="description"
                                icon="tag"
                                placeholder="Add a tag"
                                @typing="getFilteredTags">
                        </b-taginput>
                    </div>
                </div>


            <div class="button" @click="submitRecipe">
                Küldés
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return{
                file: null,
                recipeName: '',
                recipeDescription:'',
                selected: [],
                isLoading: true,
                ingredientNum : 1,
                recipeTagNum : 1,
                actCategoryType: null,
                selectedIngredients:['','','','','','','','','','','','',],
                ingredIndex: 0,
                mainCategoryCode:'',
                subCategoryCode:'',
                tags:[],
                filteredTags:this.categoryValues,
            }
        },
        watch:{
            foods(){
                this.isLoading = false;
            },
            categoryValues() {
                this.filteredTags = this.categoryValues;
            }
        },
        computed:{
            foods(){
                return this.$store.getters.foods
            },
            filteredDataObj() {
                    return this.foods.filter((option) => {
                        return option.name
                            .toString()
                            .toLowerCase()
                            .indexOf(this.selectedIngredients[this.ingredIndex].toLowerCase()) >= 0
                    })
            },
            categoryTypes(){
                return this.$store.getters.categoryTypes;
            },
            categoryValues(){
                return this.$store.getters.categoryValues;
            },
            mainCategories(){
                return this.$store.getters.mainCategories;
            },
            subCategories(){
                return this.$store.getters.subCategories;
            }
        },
        methods:{
            submitRecipe(){
                if(this.recipeName && this.selected.length > 0 && this.mainCategoryCode !== '' &&  this.subCategoryCode !== ''){
                    let formData = new FormData();

                    //create categories list
                    let categories = [];
                    for(let cat in this.tags){
                        let category = {
                            "categoryType":this.tags[cat].categoryType,
                            "categoryValue":this.tags[cat].code
                        };
                        categories.push(category);
                    }

                    let mainCategory = {
                        "categoryType":"MAINCATEGORY",
                        "categoryValue":this.mainCategoryCode
                    };

                    let subCategory = {
                        "categoryType":"SUBCATEGORY",
                        "categoryValue":this.subCategoryCode
                    };
                    categories.push(mainCategory);
                    categories.push(subCategory);


                    //create ingredients list
                    let ingredients = [];
                    let ingredient=null
                    for(let ingr in this.selected){
                        if(ingr){
                            let food = {
                                "id":this.selected[ingr].id,
                                "name":this.selected[ingr].name,
                                "foodUnits":this.selected[ingr].foodUnits};
                            ingredient = {
                                "food":food,
                                "unit":this.selected[ingr].unit,
                                "amount":this.selected[ingr].amount,
                            };
                        }
                        ingredients.push(ingredient);
                    }

                    formData.append('picture', this.file);
                    formData.append('recipeName', this.recipeName);

                    let recipe = {
                        "name": this.recipeName,
                        "description": this.recipeDescription,
                        "categories": categories,
                        "ingredients": ingredients
                    };

                    this.$store.dispatch("addRecipe", recipe);
                    this.$store.dispatch("addRecipeImg", formData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        });
                    this.$router.go();
                } else{
                    this.addRecipeError();
                }
            },
            addRecipeError(){
                this.$buefy.notification.open({
                    duration: 3500,
                    message: `Please fill all the required fields!`,
                    position: 'is-bottom-right',
                    type: 'is-danger',
                    hasIcon: true
                })
            },
            setIngredientIndex: function (index) {
                this.ingredIndex = index;
            },
            getValues(categoryType){
                this.$store.dispatch("getCategoryValues", categoryType);
            },
            getSubCategories(mainCategoryCode){
                this.$store.dispatch("getSubCategories", mainCategoryCode);
            },
            setIngredientAmount(amount){
                this.selected[this.ingredIndex]['amount'] = amount;
            },
            setIngredientUnit(unit){
                this.selected[this.ingredIndex]['unit'] = unit;
            },
            getFilteredTags(text) {
                this.filteredTags = this.categoryValues.filter((option) => {
                    return option.description
                        .toString()
                        .toLowerCase()
                        .indexOf(text.toLowerCase()) >= 0
                })
            },
            setCategoryType(){
                this.tags[this.tags.length-1]['categoryType'] = this.actCategoryType;
            }

        },
        mounted(){
            this.$store.dispatch("getFoods");
            this.$store.dispatch("getCategoryTypes");
            this.$store.dispatch("getMainCategories");
        }
    }
</script>

<style scoped>
    span.labelSub{
        vertical-align: middle;
    }
    p.title{
        text-align: center;
    }
    .category, .ingredients, .recipeTags{
        margin-bottom: 20px;
    }

    .ingredientSelect{
        padding-right: 10px;
    }

    .container{
        background-color: rgba(213, 224, 224, 0.6);
        border-radius: 5px;
        max-width: 50%;
    }
    .content{
        padding: 20px;
        max-width: 80%;
        margin: 20px auto;
    }

</style>