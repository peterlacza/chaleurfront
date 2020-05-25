<template>
    <div class="box">
        <figure class="image">
            <img :src="'http://laczapeter95.web.elte.hu/kepek/' + picCode + '.jpg'"
                 :width="picWidth"
                 @error="alternativeUrl"/>
            <div class="middle">
                <p class="text">{{ picName }}</p>
            </div>
        </figure>
    </div>
</template>

<script>
    export default {
        name: "CategoryBox",
        data: function(){
            return{
                picWidth : "230px"
            }
        },
        methods:{
            alternativeUrl(event){
                event.target.src = "http://laczapeter95.web.elte.hu/kepek/recipe.png";
            }
        },
        props:{
            picName:String,
            picCode: String
        },
    }
</script>

<style scoped>
    /* Innentől nem tudom mit csinálon  */
    .box{
        border-radius: 5px;
        padding: 0;
    }
    .image {
        opacity: 1;
        display: block;
        width: 100%;
        height: auto;
        transition: 0.5s ease;
        backface-visibility: hidden;
 }

 .middle {
     transition: 0.5s ease;
     opacity:1;
     left: 0;
     position:absolute;
     text-align:center;
     top: 0;
     width: 100%;
     filter: none;
 }

 .box:hover .image {
     filter: none
 }

 .box:hover .middle {
     top: -10px;
     opacity: 1;
     filter:none;
     background-color: rgb(116, 7, 7);
 }

 .text {
     font-family: Palatino,Palatino Linotype,Palatino LT STD,Book Antiqua,Georgia,serif;
     font-weight: bold;
     text-transform: lowercase;
     background-color: rgba(24, 24, 23, 0.7);
     color: white;

 }
    .text::first-letter{
        text-transform: uppercase;
    }
</style>