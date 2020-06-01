import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import VueAxios from "vue-axios";

Vue.use(Vuex, VueAxios, axios);

const serverUrl = "http://localhost:9090";

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
        searchResult:null,
        remainingNumber:null
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
        },
        remainingNumber(state){
            return state.remainingNumber;
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
            console.log("Sikeres regisztráció :"+JSON.stringify(user))
        },
        registrationError(state){
            state.registrationError = true;
        },
        deleteConsumption(response){
            console.log("Sikeres törlés! "+response);
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
            console.log("Response: "+response);
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
        },
        setRemainingNumber(state, remainingNumber){
            state.remainingNumber = remainingNumber;
        }
    },
    actions: {
        getMainCategories({commit}) {
            axios
                .get(serverUrl+"/browse")
                .then(response => commit("getMainCategories", response));
        },
        getSubCategories({commit}, mainCategoryCode) {
            axios
                .get(serverUrl+`/browse/${encodeURIComponent(mainCategoryCode)}`)
                .then(response => commit("getSubCategories", response));
        },
        getSubCategoriesWithParams({commit}, obj) {
            const params = new URLSearchParams();
            for (let diet in obj.dietList) {
                params.append('diet', obj.dietList[diet]);
            }
            axios
                .get(serverUrl+`/browse/${encodeURIComponent(obj.mainCategoryCode)}`, {params})
                .then(response => commit("getSubCategoriesWithParams", response));
            commit("setParamList", params);
        },
        getRecipesBySubCategory({commit}, subCategoryCode) {
            axios
                .get(serverUrl+`/browse/${encodeURIComponent(subCategoryCode)}/recipes`)
                .then(response => commit("getRecipesBySubCategory", response.data));
        },
        getCategoryWinner({commit}, subCategoryCode){
            axios
                .get(serverUrl+'/browse/categorywinner',{params: {"subCategoryCode":subCategoryCode}})
                .then(response => commit("setCategoryWinner", response.data));

        },
        getConsumptions({commit}) {
            axios
                .get(serverUrl+'/consumption/consumptions')
                .then(response => commit("setConsumptions", response.data))
        },
        getNutrientReference({commit}) {
            axios
                .get(serverUrl+'/reference/getReference')
                .then(response => commit("setNutrientReference", response.data))
        },
        getTodayNutrientValues({commit}, date){
            axios
                .get(serverUrl+'/consumption/nutrients',{params: {"date":date}})
                .then(response => commit("setTodayNutrientValues", response.data))
        },
        getRecommendation({commit}) {
            axios
                .get(serverUrl+'/recommend')
                .then(response => commit("setRecommendedRecipes", response.data))
        },
        getUserRecipes({commit}, username){
            axios
                .get(serverUrl+'/recipes', {params: {"userName": username}})
                .then(response => commit("setUserRecipes", response.data));
        },
        deleteConsumption({commit}, id){
            axios
                .delete(serverUrl+'/consumption/consumption', {params: {"id":id}})
                .then(response => commit("deleteConsumption", response.data));
        },
        rateRecipe({commit}, obj){
            const params = new URLSearchParams();
            params.append('rateValue', obj.rateValue)
            params.append('recipeId', obj.recipeId);
            axios
                .post(serverUrl+'/consumption/rate', params)
                .then(commit("rateSuccessful"));
            },
        setActUser({commit}, actUser){
            commit("setActUser", actUser);
        },
        consumeRecipe({commit}, consumption){
            axios
                .post(serverUrl+'/consumption/add', consumption)
                .then(response => commit("response", response.data))
        },
        register( {commit}, user){
            axios
                .post(serverUrl+'/auth/register', user)
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
            axios
                .get(serverUrl+'/user', {params: {"userName":userName}})
                .then(response => commit("setUserProfile", response.data));
        },
        followUser ({commit}, userName ){
            var params = new URLSearchParams();
            params.append('userName', userName);

            axios
              .post(serverUrl+'/user/follow', params)
              .then(commit("followUser",userName));
        },
        unfollow({commit}, userName){
            var params = new URLSearchParams();
            params.append('userName', userName);

            axios
                .post(serverUrl+'/user/unfollow', params)
                .then(commit("unfollow"));
        },
        getFollowings({commit}){
            axios
                .get(serverUrl+'/user/followings')
                .then(response => commit("setFollowings", response.data));
        },
        getFollowers({commit}, username){
            axios
                .get(serverUrl+'/user/followers', {params: {"userName":username}})
                .then(response => commit("setFollowers", response.data));
        },
        addFavourite({commit}, recipeId){
            const params = new URLSearchParams();
            params.append('recipeId', recipeId);
            axios
                .post(serverUrl+'/recipes/favourite', params)
                .then(response => commit("addFavourite", response.data));
        },
        getFavourites({commit}, username){
            axios
                .get(serverUrl+'/recipes/favourites', {params: {"userName":username}})
                .then(response => commit("setUserFavourites", response.data));
        },
        getActRecipe({commit}, recipeId){
            axios
                .get(serverUrl+'/recipes/recipe', {params: {"id":recipeId}})
                .then(response => commit("setActRecipe", response.data));
        },
        async addRecipe({commit}, recipe){
            await axios
                .post(serverUrl+'/recipes/upload', recipe);
            commit("unfollow");
        },
        addRecipeImg({commit}, picture){
            axios
                .post(serverUrl+'/recipes/addImage', picture);
            commit("unfollow");
        },
        addUserImage({commit}, picture){
            axios
                .post(serverUrl+'/user/addImage', picture);
            commit("unfollow");
        },
        getFoods({commit}){
            axios
                .get(serverUrl+'/recipes/foods')
                .then(response => commit("setFoodList", response.data));
        },
        getCategoryTypes({commit}){
            axios
                .get(serverUrl+'/browse/categoryTypes')
                .then(response => commit("setCategoryTypes", response.data));
        },
        getCategoryValues({commit}, categoryType){
            axios
                .get(serverUrl+'/browse/valuesbytype', {params:{"categoryType" : categoryType}})
                .then(response => commit("setCategoryValues", response.data));
        },
        deleteRecipe({commit}, recipeId){
            axios
                .delete(serverUrl+'/recipes/delete', {params:{"recipeId" : recipeId}})
                .then(commit("unfollow"));
        },
        removeFavourite({commit}, recipeId){
            axios
                .delete(serverUrl+'/recipes/favourite', {params:{"recipeId" : recipeId}})
                .then(commit("unfollow"));

        },
        getLatests({commit}){
            axios
                .get(serverUrl+'/recipes/latest')
                .then(response => commit("setLatest", response.data));
        },
        recommendUsers({commit}){
            axios
                .get(serverUrl+'/recipes/recommendUsers')
                .then(response => commit("setRecommendedUsers", response.data));
        },
        getSearchResults( {commit}, searchValue){
            let requestUrl = serverUrl+"/recipes/find?search=(name:'*"+searchValue+"*')";
            axios
                .get(requestUrl)
                .then(response => commit("setSearchResult", response.data));
        },
        clearSearchHistory({commit}){
            commit("clearSearchHistory")
        },
        getRemainingNumber({commit}){
            axios
                .get(serverUrl+'/recommend/reamining')
                .then(response => commit("setRemainingNumber", response.data));
        }
    }
    });
