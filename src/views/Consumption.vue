<template>
    <div class="tile is-gapless is-ancestor">
            <div class="tile is-vertical is-12">
                <div class="tile">
                    <article class="tile is-child notification ">
                        <p class="title">Past consumptions</p>
                    </article>
                    <article class="tile is-child notification ">
                        <p class="title">Daily nutrient intake</p>
                        <b-datepicker
                                v-model="selectedDate"
                                :events="getEvents(allConsumption)"
                                indicators="bars"
                                placeholder="Click to select..."
                                icon="calendar"
                                trap-focus
                                style="max-width: 30%">
                        </b-datepicker>
                    </article>
                </div>

                <div class="tile">
                    <div class="tile is-parent">
                        <article class="tile is-child notification ">
                            <div class="columns is-multiline is-mobile consumption" v-for="(consumption, index) in consumptions" v-bind:key="index">
                                <div class="column is-2 is-narrow">
                                    <strong>[{{consumption.date}}]</strong> <br>
                                    <figure class="image is-128x128">
                                        <a :href="getRecipeHref(consumption.recipe)" class="noLink">
                                            <img v-if="consumption.recipe.picture"
                                                 style="max-height: 128px"
                                                 v-bind:src="'data:image/png;base64,'+consumption.recipe.picture.picByte" />
                                            <img v-else
                                                 src="http://laczapeter95.web.elte.hu/kepek/recipe.png" />
                                        </a>
                                    </figure>
                                </div>
                                <div class="column is-narrow">
                                    <p class="title is-4" style="padding: 0px!important; margin: 0px!important;">
                                        <span class="recipeName"> {{ consumption.recipe.name }} </span>
                                        <i class="deleteIcon" @click="deleteConsumption(consumption)" style="font-weight: lighter;">(x)</i>
                                    </p>
                                    <div class="columns is-multiline is-mobile">
                                        <div class="column is-2 is-narrow"
                                             v-for="(nutri, index) in getTopNutrients(consumption.nutrientValues)"
                                             v-bind:key="index">
                                            {{ nutri.nutrient.name }} <br>
                                            <b-progress type="is-info"
                                                        size="is-medium"
                                                        :value="nutri.value"
                                                        :max="calcNutriRef(nutri.nutrient.code)"
                                                        show-value
                                                        format="percent"
                                                        class="progessBar">
                                                {{Math.round(nutri.value * 10) /10 }} / {{ calcNutriRef(nutri.nutrient.code) }}
                                                <span style=" text-transform: lowercase; font-weight: lighter">
                                                    {{ nutri.nutrient.unit.code }}
                                            </span>
                                            </b-progress>
                                        </div>
                                        <div class="column is-2">
                                            <b-button type="is-link is-outlined" @click="isComponentModalActive = true">Show all</b-button>
                                        </div>
                                    </div>
                                    <div class="rateRecipe">
                                        {{ rateText(consumption.recipe.id) }}
                                        {{ getRate(consumption.recipe.id, index) }}
                                        <b-rate spaced
                                                v-model="userRate[index]"
                                                value="userRate[index]"
                                                @change="setRate(index, consumption.recipe.id)"
                                                :disabled="alreadyRated(consumption.recipe.id)"
                                        > </b-rate>
                                    </div>
                                </div>
                                <b-modal :active.sync="isComponentModalActive"
                                         has-modal-card
                                         trap-focus
                                         :destroy-on-hide="false"
                                         aria-role="dialog"
                                         aria-modal>
                                    <consumption-modal :recipe="consumption.recipe"></consumption-modal>
                                </b-modal>
                            </div>
                            <div>
                                <b-button class="button is-success" icon-right="caret-down" @click="showMore">Show more</b-button>
                            </div>
                        </article>
                    </div>
                    <div class="tile is-parent">
                        <article class="tile is-child notification">
                            <div class="column is-11 ">
                                <DailyNutrients v-if="computedChartData.datasets.length>0" :chartdata="computedChartData" :options="chartOptions"/>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
    </div>
</template>

<script>

    import ConsumptionModal from "@/components/ConsumptionModal";
    import DailyNutrients from "../components/DailyNutrients.vue";

    export default {
        name: "Consumption",
        components:{
            DailyNutrients,
            ConsumptionModal
        },
        watch: {
            selectedDate(){
                this.$store.dispatch("getTodayNutrientValues", this.selectedDate.toLocaleDateString());
            },
            userRate(){
                this.changedRate = true;
            },
            rateSuccessful() {
                console.log("Sikeres értékelés! ");
            },
            nutrientValues(){
                this.setChartData();
            },

        },
        data() {
            return {
                isComponentModalActive: false,
                nutrientsToShow: 5,
                showNumber: 0,
                selectedDate : null,
                userRate: [],
                recipeId: null,
                changedRate : false,
                chartData:{
                    labels:[],
                    datasets:[],
                },
                chartOptions:{
                    responsive: true,
                    maintainAspectRatio: false
                }
            }
        },
        computed:{
            allConsumption(){
                return this.$store.getters.consumptions
            },
            consumptions(){
                let consumptions = this.$store.getters.consumptions;
                let date = new Date();
                if(consumptions.length !== 0){
                    date = consumptions[0].date;
                    for(let cons in consumptions){
                        if(consumptions[cons].date > date){
                            date = consumptions[cons].date;
                        }
                    }
                }
                let consumptionToShow = [];
                let datesToShow = new Date(date);
                datesToShow.setDate(datesToShow.getDate()-this.showNumber);
                for(let cons in consumptions){
                    let consumptionDate = new Date(consumptions[cons].date);
                    if(consumptionDate >= datesToShow){
                        consumptionToShow.push(consumptions[cons]);
                    }
                }

                consumptionToShow.sort(this.compare);
                return consumptionToShow;
            },
            nutrientReference(){
                return this.$store.getters.nutrientReference;
            },
            nutrientValues(){
                return this.$store.getters.todayNutrientValues;
            },
            computedChartData(){
                return this.chartData;
            }
        },
        mounted() {
            this.$store.dispatch("getConsumptions");
            this.$store.dispatch("getNutrientReference");
            this.$store.dispatch("getTodayNutrientValues", new Date().toLocaleDateString());
        },
        methods: {
            setChartData(){
                this.chartData = {
                    labels:[],
                    datasets:[],
                };
                let myDataset = {
                    label: "Nutrient value (%)",
                    backgroundColor: [],
                    data: []
                }
                for(let nutri in this.nutrientValues){
                    this.chartData.labels.push(this.nutrientValues[nutri].nutrient.name);
                    let percentage =
                        (this.nutrientValues[nutri].value / this.calcNutriRef(this.nutrientValues[nutri].nutrient.code))*100;
                    myDataset.data.push((Math.round(percentage*10)/10));
                    if(percentage < 30){
                        myDataset.backgroundColor.push( "rgba(206,6,6,0.67)" );
                    } else if(percentage >= 30 && percentage < 75){
                        myDataset.backgroundColor.push( "rgba(27,51,179,0.67)" );
                    } else if(percentage >= 75 && percentage < 150){
                        myDataset.backgroundColor.push( "rgba(68,172,9,0.67)" );
                    } else{
                        myDataset.backgroundColor.push( "rgba(206,6,6,0.67)" );
                    }
                }
                this.chartData.datasets.push(myDataset);
            },
            calcNutriRef(nutrientCode){
                let myNutri = this.nutrientReference.find(nutrient => nutrient.nutrientCode === nutrientCode);
                if(myNutri){
                    return myNutri.dailyRecommend;
                } else{
                    return 100;
                }
            },
            getTopNutrients(nutrientValues){
                let nutrientToShow = []
                for(let nutri in nutrientValues){
                    if(nutrientValues[nutri].nutrient.topSelect){
                        nutrientToShow.push(nutrientValues[nutri]);
                    }
                }
                return nutrientToShow;
            },
            getType(value, max){
                if(value/max*100 < 35){
                    return 'is-warning';
                } else if(35 <= value/max*100 && value/max*100 < 100){
                    return 'is-success'
                } else{
                    return 'is-danger';
                }
            },
            showMore(){
                this.showNumber++;
            },
            compare( a, b ) {
                if ( a.date > b.date ){
                    return -1;
                }
                if ( a.date < b.date ){
                    return 1;
                }
                return 0;
            },
            getEvents(allConsumption){
                let events=[];
                for(let c in allConsumption){
                    events.push(new Date(allConsumption[c].date));
                }
                return events;
            },
            deleteConsumption(consumption){
                this.$store.dispatch("deleteConsumption", consumption.id);
                this.$router.go(0);
            },
            alreadyRated(recipeId){
                for(let c in this.consumptions){
                    if(this.consumptions[c].recipe.id === recipeId){
                        for(let rate in this.consumptions[c].recipe.ratings){
                            if(this.consumptions[c].recipe.ratings[rate].user.id === JSON.parse(localStorage.getItem("user")).id){
                                return true;
                            }
                        }
                    }
                }
                return false;
            },
            getRate(recipeId, index){
                if(this.alreadyRated(recipeId)){
                    let rateValue = 0;
                    for(let c in this.consumptions){
                        if(this.consumptions[c].recipe.id === recipeId){
                            for(let rate in this.consumptions[c].recipe.ratings){
                                rateValue += this.consumptions[c].recipe.ratings[rate].rate;
                            }
                            rateValue = rateValue / this.consumptions[c].recipe.ratings.length;
                            break;
                        }
                    }
                    this.userRate[index] = rateValue;
                } else{
                    if(this.userRate[index] && this.changedRate){
                        this.changedRate = false;
                        this.setRate(this.userRate[index], recipeId);
                    }
                }
            },
            rateText(recipeId){
                if(this.alreadyRated(recipeId)){
                    return "Thanks for your rating!";
                } else{
                    return "Please rate this recipe!";
                }
            },
            setRate(rateValue, recipeId){
                if(rateValue != 0){
                    let obj = {
                        "rateValue":rateValue,
                        "recipeId":recipeId
                    }
                    this.$store.dispatch("rateRecipe", obj);
                    this.$router.go();
                }
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
            },
        },
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
    .recipeName{
        text-transform: lowercase;
    }

    .progessBar{
        min-width: 80px;
    }


    .consumption:hover{
        background-color: rgba(213, 224, 224, 0.6);
    }

    .nutrientValuess{
        background-color: rgba(213, 224, 224, 0.6);
        border-radius: 5px;
        padding-left: 10px;
    }
    .consumptions{
        background-color: rgba(213, 224, 224, 0.6);
        border-radius: 5px;
        padding-left: 10px;
    }
    .box{
        background-color: darkgray;
        padding: 0;
        box-shadow: none
    }

    i.deleteIcon{
        color: red;
    }

    p.title{
        white-space: nowrap;
        overflow: hidden;
        width: 100%;
    }
    p.nutrientName{
        white-space: nowrap;
        overflow: hidden;
        width: 100%;
    }
    .showMore{
        padding: 0.5rem;
        width: 200px;
    }
    .showFullNutrient{
        margin: 0 auto;
    }
    .nutrientValuess{
        background-color: rgba(213, 224, 224, 0.6);
        border-radius: 5px;
        padding-left: 10px;
    }
    .consumptions{
        background-color: rgba(213, 224, 224, 0.6);
        border-radius: 5px;
        padding-left: 10px;
    }
    .box{
        background-color: darkgray;
        padding: 0;
        box-shadow: none
    }


    p.title{
        white-space: nowrap;
        overflow: hidden;
        width: 100%;
    }
    p.nutrientName{
        white-space: nowrap;
        overflow: hidden;
        width: 100%;
    }
    p.nutrientValue{
        width: 100px;
    }
    .showFullNutrient{
        margin: 0 auto;
    }

</style>