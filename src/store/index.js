import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import VueAxios from "vue-axios";

Vue.use(Vuex, VueAxios, axios);

// Add a request interceptor
axios.interceptors.request.use(function (config) {
    let user = JSON.parse(localStorage.getItem('user'));

    if(user){
        let token = {'Authorization': 'Basic ' + user.authdata};
        config.headers.Authorization =  token.Authorization;
    }
    return config;
});


export const store = new Vuex.Store({
    state: {
        mainCategories: [],
        subCategories: [],
        paramList: null,
        consumptions: [],
        nutrientReference: [],
        recipesBySubCategory: [],
        recommendedRecipes: [],
        actUser: null,
        registrationError: false,
        todayNutrientValues: [],
        userRecipes: [],
        userProfile: null,
        followings:null,
        followers:null,
        userFavourites: null,
        actRecipe: null,
        categoryWinner: null,
        foods:null,
        categoryTypes:null,
        categoryValues:null,
        latestRecipes:null,
        recommendedUsers:null,
        rateSuccessful:false,
        searchResult:null
    },
    getters: {
        mainCategories(state) {
            return state.mainCategories;
        },
        subCategories(state) {
            return state.subCategories;
        },
        paramList(state) {
            return state.paramList;
        },
        consumptions(state) {
            return state.consumptions;
        },
        nutrientReference(state) {
            return state.nutrientReference;
        },
        todayNutrientValues(state){
            return state.todayNutrientValues;
        },
        recipesBySubCategory(state) {
            return state.recipesBySubCategory;
        },
        recommendedRecipes(state) {
            return state.recommendedRecipes;
        },
        categoryWinner(state){
            return state.categoryWinner;
        },
        actUser(state){
            //return JSON.parse(localStorage.getItem("user"));
            return state.actUser;
        },
        registrationError(state){
            return state.registrationError;
        },
        userRecipes(state){
            return state.userRecipes;
        },
        userProfile(state){
            return state.userProfile;
        },
        followings(state){
            return state.followings;
        },
        followers(state){
            return state.followers;
        },
        userFavourites(state){
            return state.userFavourites;
        },
        actRecipe(state){
            return state.actRecipe;
        },
        foods(state){
            return state.foods;
        },
        categoryTypes(state){
            return state.categoryTypes;
        },
        categoryValues(state){
            return state.categoryValues;
        },
        latestRecipes(state){
            return state.latestRecipes;
        },
        recommendedUsers(state){
            return state.recommendedUsers;
        },
        rateSuccessful(state){
            return state.rateSuccessful;
        },
        searchResult(state){
            return state.searchResult;
        }
    },
    mutations: {
        getMainCategories(state, response) {
            state.mainCategories = response.data;
        },
        getSubCategories(state, response) {
            state.subCategories = response.data;
        },
        getSubCategoriesWithParams(state, response) {
            state.subCategories = response.data;
        },
        setCategoryWinner(state, recipe){
            state.categoryWinner = recipe;
        },
        setParamList(state, paramList) {
            state.paramList = paramList;
        },
        setConsumptions(state, consumptions) {
            state.consumptions = consumptions;
        },
        setNutrientReference(state, nutrientReference) {
            state.nutrientReference = nutrientReference;
        },
        getRecipesBySubCategory(state, recipes) {
            state.recipesBySubCategory = recipes;
        },
        setRecommendedRecipes(state, recipes) {
            state.recommendedRecipes = recipes;
        },
        setTodayNutrientValues(state, todayNutrientValues){
            state.todayNutrientValues = todayNutrientValues;
        },
        setActUser(state, actUser){
            state.actUser = actUser;
        },
        setUserRecipes(state, recipes){
            state.userRecipes = recipes;
        },
        setUserProfile(state, user){
            state.userProfile = user;
        },
        response(response){
            console.log("Response: "+response);
        },
        register(state, user){
            state.registrationError = false;
            console.log("Jó les,z :"+JSON.stringify(user))
        },
        registrationError(state){
            console.log("ERRORBA LÉPEK")
            state.registrationError = true;
        },
        deleteConsumption(response){
            console.log("sikerült kitörölni! "+response);
        },
        rateSuccessful(state){
            state.rateSuccessful = true;
        },
        followUser(){
            console.log("Sikeres követés!");
        },
        unfollow(){
            console.log("Sikeres kikövetés");
        },
        setFollowings(state, followings){
            state.followings = followings;
        },
        setFollowers(state, followers){
            state.followers =  followers;
        },
        addFavourite(response){
            console.log("Válasz: "+response);
        },
        setUserFavourites(state, favourites){
            state.userFavourites = favourites;
        },
        setActRecipe(state, recipe){
            state.actRecipe = recipe;
        },
        setFoodList(state, foods){
            state.foods = foods;
        },
        setCategoryTypes(state, categoryTypes){
            state.categoryTypes = categoryTypes;
        },
        setCategoryValues(state, categoryValues){
            state.categoryValues = categoryValues;
        },
        setLatest(state, recipes){
            state.latestRecipes = recipes;
        },
        setRecommendedUsers(state, users){
            state.recommendedUsers = users;
        },
        setSearchResult(state, searchResult){
            state.searchResult = searchResult;
        },
        clearSearchHistory(state){
            state.searchResult = null
        }
    },
    actions: {
        getMainCategories({commit}) {
            axios
                .get("http://localhost:9090/browse")
                .then(response => commit("getMainCategories", response));
        },
        getSubCategories({commit}, mainCategoryCode) {
            axios
                .get(`http://localhost:9090/browse/${encodeURIComponent(mainCategoryCode)}`)
                .then(response => commit("getSubCategories", response));
        },
        getSubCategoriesWithParams({commit}, obj) {
            const params = new URLSearchParams();
            for (let diet in obj.dietList) {
                params.append('diet', obj.dietList[diet]);
            }
            axios
                .get(`http://localhost:9090/browse/${encodeURIComponent(obj.mainCategoryCode)}`, {params})
                .then(response => commit("getSubCategoriesWithParams", response));
            commit("setParamList", params);
        },
        getRecipesBySubCategory({commit}, subCategoryCode) {
            axios
                .get(`http://localhost:9090/browse/${encodeURIComponent(subCategoryCode)}/recipes`)
                .then(response => commit("getRecipesBySubCategory", response.data));
        },
        getCategoryWinner({commit}, subCategoryCode){
            axios
                .get('http://localhost:9090/browse/categorywinner',{params: {"subCategoryCode":subCategoryCode}})
                .then(response => commit("setCategoryWinner", response.data));

        },
        getConsumptions({commit}) {
            axios
                .get('http://localhost:9090/eat/consumptions')
                .then(response => commit("setConsumptions", response.data))
        },
        getNutrientReference({commit}) {
            axios
                .get('http://localhost:9090/reference/getReference')
                .then(response => commit("setNutrientReference", response.data))
        },
        getTodayNutrientValues({commit}, date){
            axios
                .get('http://localhost:9090/eat/nutrients',{params: {"date":date}})
                .then(response => commit("setTodayNutrientValues", response.data))
        },
        getRecommendation({commit}) {
            axios
                .get('http://localhost:9090/recommend')
                .then(response => commit("setRecommendedRecipes", response.data))
        },
        getUserRecipes({commit}, username){
            axios
                .get('http://localhost:9090/recipes', {params: {"userName": username}})
                .then(response => commit("setUserRecipes", response.data));
        },
        deleteConsumption({commit}, id){
            axios
                .delete('http://localhost:9090/eat/consumption', {params: {"id":id}})
                .then(response => commit("deleteConsumption", response.data));
        },
        rateRecipe({commit}, obj){
            const params = new URLSearchParams();
            params.append('rateValue', obj.rateValue)
            params.append('recipeId', obj.recipeId);
            axios
                .post('http://localhost:9090/eat/rate', params)
                .then(commit("rateSuccessful"));
            },
        setActUser({commit}, actUser){
            commit("setActUser", actUser);
        },
        consumeRecipe({commit}, consumption){
            axios
                .post('http://localhost:9090/eat/consumption', consumption)
                .then(response => commit("response", response.data))
        },
        register( {commit}, user){
            axios
                .post('http://localhost:9090/auth/register', user)
                .then(function (response) {
                    if (response.status === 200) {
                        commit("register", response.data)
                    }})
                .catch(function (error) {
                    console.log("error: "+error);
                    commit("registrationError");
                });
        },
        getUserProfile( {commit}, userName){
            console.log("username: "+userName);
            axios
                .get('http://localhost:9090/user', {params: {"userName":userName}})
                .then(response => commit("setUserProfile", response.data));
        },
        followUser ({commit}, userName ){
            var params = new URLSearchParams();
            params.append('userName', userName);

            axios
              .post('http://localhost:9090/user/follow', params)
              .then(commit("followUser",userName));
        },
        unfollow({commit}, userName){
            var params = new URLSearchParams();
            params.append('userName', userName);

            axios
                .post('http://localhost:9090/user/unfollow', params)
                .then(commit("unfollow"));
        },
        getFollowings({commit}){
            axios
                .get('http://localhost:9090/user/followings')
                .then(response => commit("setFollowings", response.data));
        },
        getFollowers({commit}, username){
            axios
                .get('http://localhost:9090/user/followers', {params: {"userName":username}})
                .then(response => commit("setFollowers", response.data));
        },
        addFavourite({commit}, recipeId){
            const params = new URLSearchParams();
            params.append('recipeId', recipeId);
            axios
                .post('http://localhost:9090/recipes/favourite', params)
                .then(response => commit("addFavourite", response.data));
        },
        getFavourites({commit}, username){
            axios
                .get('http://localhost:9090/recipes/favourites', {params: {"userName":username}})
                .then(response => commit("setUserFavourites", response.data));
        },
        getActRecipe({commit}, recipeId){
            axios
                .get('http://localhost:9090/recipes/recipe', {params: {"id":recipeId}})
                .then(response => commit("setActRecipe", response.data));
        },
        async addRecipe({commit}, recipe){
            await axios
                .post('http://localhost:9090/recipes/upload', recipe);
            commit("unfollow");
        },
        addRecipeImg({commit}, picture){
            axios
                .post('http://localhost:9090/recipes/addImage', picture);
            commit("unfollow");
        },
        addUserImage({commit}, picture){
            axios
                .post('http://localhost:9090/user/addImage', picture);
            commit("unfollow");
        },
        getFoods({commit}){
            axios
                .get('http://localhost:9090/recipes/foods')
                .then(response => commit("setFoodList", response.data));
        },
        getCategoryTypes({commit}){
            axios
                .get('http://localhost:9090/browse/categoryTypes')
                .then(response => commit("setCategoryTypes", response.data));
        },
        getCategoryValues({commit}, categoryType){
            axios
                .get('http://localhost:9090/browse/typevalue', {params:{"categoryType" : categoryType}})
                .then(response => commit("setCategoryValues", response.data));
        },
        deleteRecipe({commit}, recipeId){
            axios
                .delete('http://localhost:9090/recipes/delete', {params:{"recipeId" : recipeId}})
                .then(commit("unfollow"));
        },
        removeFavourite({commit}, recipeId){
            axios
                .delete('http://localhost:9090/recipes/favourite', {params:{"recipeId" : recipeId}})
                .then(commit("unfollow"));

        },
        getLatests({commit}){
            axios
                .get('http://localhost:9090/recipes/latest')
                .then(response => commit("setLatest", response.data));
        },
        recommendUsers({commit}){
            axios
                .get('http://localhost:9090/recipes/recommendUsers')
                .then(response => commit("setRecommendedUsers", response.data));
        },
        getSearchResults( {commit}, searchValue){
            let requestUrl = "http://localhost:9090/recipes/find?search=(name:'*"+searchValue+"*')";
            axios
                .get(requestUrl)
                .then(response => commit("setSearchResult", response.data));
        },
        clearSearchHistory({commit}){
            commit("clearSearchHistory")
        }
    }
    });
