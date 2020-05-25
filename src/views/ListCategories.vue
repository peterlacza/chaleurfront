<template>
    <div class="container is-fluid">
        <div class="categoryContent">
            <p class="title is-1"> Select main category </p>
            <hr class="divider">

            <div class="columns is-multiline ">
                <div class="column is-2" v-for="(category, index) in categories" v-bind:key="index">
                    <figure class="image is-3by2yy">
                        <router-link :to="'/browse/'+category.mainCategoryCode"> <CategoryBox :pic-name="category.mainCategoryDescription" :pic-code="category.mainCategoryCode" > </CategoryBox> </router-link>
                    </figure>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import CategoryBox from "@/components/CategoryBox";
    export default {
        name: "ListCategories",
        components: {CategoryBox},
        computed: {
            categories() {
                return this.$store.getters.mainCategories;
            }
        },
        mounted() {
            this.$store.dispatch("getMainCategories");
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

    p.title{
        text-align: center;
    }

    hr.divider{
        border: 1px solid rgba(85, 81, 81, 0.50);
        max-width: 75%;
        margin: 30px auto;
    }

</style>