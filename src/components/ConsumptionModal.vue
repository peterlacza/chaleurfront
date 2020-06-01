<template>
    <section>
        <div class="modal-card" style="width: auto">
            <header class="modal-card-head">
                <p class="modal-card-title">Nutrients</p>
            </header>
            <section class="modal-card-body">
                <p class="title"> {{recipe.name}} </p>
                <img v-if="recipe.picture" v-bind:src="'data:image/png;base64,'+recipe.picture.picByte" />
                <img v-else src="http://laczapeter95.web.elte.hu/kepek/dish2.png" />
                <div class="column is-mobile is-6">
                    <div v-for="(nutrient, index) in recipe.nutrientValues" v-bind:key="index">
                        <p class="nutrientName">{{ nutrient.nutrient.name }}</p>
                        <p class="nutrientValue">
                            <b-progress  type="is-info" :value="calcNutri(recipe.nutrientValues[index].value, recipe)" :max="calcNutriRef(recipe.nutrientValues[index].nutrient.code)" show-value format="percent">
                                {{calcNutri(recipe.nutrientValues[index].value, recipe)}} / {{ calcNutriRef(recipe.nutrientValues[index].nutrient.code) }} <span style="text-transform: lowercase; font-weight: lighter">{{ recipe.nutrientValues[index].nutrient.unit.code }}</span>
                            </b-progress>
                        </p>
                    </div>
                </div>
            </section>
            <footer class="modal-card-foot">
                <button class="button" type="button" @click="$parent.close()">Close</button>
            </footer>
        </div>

    </section>
</template>

<script>
    export default {
        name: "ConsumptionModal",
        props: {
            recipe : null
        },
        computed:{
            nutrientReference(){
                return this.$store.getters.nutrientReference;
            },
        },
        methods: {
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
            }
        },
    }
</script>

<style scoped>

</style>