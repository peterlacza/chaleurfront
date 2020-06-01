import Vue from "vue";
import VueRouter from "vue-router";
import ListCategories from "@/views/ListCategories";
import Home from "@/views/Home"
import ListRecipes from "@/views/ListRecipes";
import Recipe from "@/views/Recipe";
import Login from "@/views/Login";
import Consumption from "@/views/Consumption";
import Registration from "@/views/Registration";
import Profile from "@/views/Profile";
import AddRecipe from "@/views/AddRecipe";
import SearchResult from "@/views/SearchResult";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home
    },
    {
        path: "/browse",
        name: "browse",
        component: ListCategories,
        props: {isMainCategoryList: true}
    },
    {
        path: "/browse/:mainCategoryCode",
        name: "browseRecipes",
        component: ListRecipes,
        props: true,
    },

    {
        path: "/recipe/:subCategoryCode",
        name: "recipe",
        component: Recipe,
        props: true,
    },
    {
        path: "/recipe/:subCategoryCode/:recipeId",
        name: "recipe",
        component: Recipe,
        props: true,
    },
    {
        path: "/recipe",
        name: "recipe",
        component: Recipe,
        props: ($route) => ({
            ...$route.params
        }),
    },
    {
        path: "/search-result/:searchValue",
        name: "searchresult",
        component: SearchResult,
        props: true
    },
    {
        path: "/consumptions/",
        name: "consumptions",
        component: Consumption,
    },
    {
        path: "/login",
        name: "login",
        component: Login
    },
    {
        path: "/register",
        name: "register",
        component: Registration
    },
    {
        path: "/user/:userName",
        name: "profile",
        component: Profile,
        props: true,
    },
    {
        path: "/add-recipe",
        name: "add recipe",
        component: AddRecipe
    },
];

export const router = new VueRouter({
    routes
});

router.beforeEach((to, from, next) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const publicPages = ['login','browse','recipe', 'register'];
    const authRequired = !publicPages.includes(to.path.split('/')[1]);
    const loggedIn = localStorage.getItem('user');

    if (authRequired && !loggedIn) {
        return next({
            path: '/login',
            query: { returnUrl: to.path }
        });
    }

    next();
})


export default router;