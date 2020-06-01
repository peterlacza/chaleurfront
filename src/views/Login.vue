<template>
    <div class="content">
        <div class="hero-body">
            <div class="container has-text-centered">
                <div class="column is-4 is-offset-4">
                    <h3 class="title has-text-black">Login</h3>
                    <hr class="login-hr">
                    <p class="subtitle has-text-black">Please login to proceed.</p>
                    <div class="box">
                        <figure class="logo">
                            <img src="../assets/logos/profile.png">
                            <p class="title"> Chaleur </p>
                        </figure>
                        <form @submit.prevent="handleSubmit">
                            <div class="field">
                                <div class="control">
                                    <input class="input is-large" type="text" v-model="username" placeholder="Username" autofocus="" required>
                                </div>
                            </div>

                            <div class="field">
                                <div class="control">
                                    <input class="input is-large" type="password" v-model="password" placeholder="Password" password-reveal required>
                                </div>
                            </div>

                            <div class="form-group">
                                <img v-show="loading" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                            </div>
                            <div class="field">
                                <b-tag v-if="error" class="is-danger"> {{ error }} </b-tag>
                            </div>

                            <button class="button is-block is-info is-large is-fullwidth">Login <i class="fa fa-sign-in" aria-hidden="true"></i></button>
                        </form>
                    </div>
                    <p class="has-text-grey">
                        <a href="#/register">Sign Up</a> &nbsp;·&nbsp;
                        <a href="mailto:peterlacza@gmail.com">Need Help?</a>
                    </p>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import { router } from '../router';
    import { userService } from '@/auth/user.service';

    export default {
        data () {
            return {
                username: '',
                password: '',
                submitted: false,
                loading: false,
                returnUrl: '',
                error: ''
            }
        },
        created () {
            userService.logout();

            this.returnUrl = this.$route.query.returnUrl || '/';
        },
        methods: {
            handleSubmit (e) {
                this.submitted = true;
                const { username, password } = this;

                if (!(username && password)) {
                    return;
                }

                this.loading = true;
                userService.login(username, password)
                    .then(
                        user => {router.push(this.returnUrl), console.log("user: "+user)},
                        error => {
                            this.error = error;
                            this.loading = false;
                        }
                    );
                e.preventDefault();
            }
        }
    };
</script>

<style scoped>
    .container{
        background-color: rgba(213, 224, 224, 0.6);
        border-radius: 5px;
    }
    .hero-body{
        margin: 0;
    }
</style>