<template>
    <section>
        <div class="content">
                <div class="container">
                    <div class="notification">
                        <p class="title"> Sign up to <strong class="chaleur">Chaleur</strong></p>
                        <form @submit.prevent="register">
                            <b-field label="Name" label-position="on-border">
                                <b-input v-model="name" placeholder="Your name"></b-input>
                            </b-field>

                            <b-field class="uploadIcon">
                                <b-upload v-model="file" accept='image/*'>
                                    <a :class="!file ? 'button is-dark is-outlined' : 'button is-success is-outlined'">
                                        <b-icon v-if="!file" icon="upload"></b-icon>
                                        <b-icon v-else icon="image"></b-icon>
                                        <span v-if="!file">Select image</span>
                                        <span v-else>Image OK</span>
                                    </a>
                                </b-upload>
                            </b-field>

                            <b-field label="Email" label-position="on-border">
                                <b-input v-model="email"
                                         type="email"
                                         maxlength="30"
                                         icon="at"
                                         placeholder="Email"
                                         required>
                                </b-input>
                            </b-field>

                            <b-field label="Username" label-position="on-border">
                                <b-input v-model="username" placeholder="Username" maxlength="30" icon="user" required></b-input>
                            </b-field>

                            <b-field label="Password" label-position="on-border">
                                <b-input v-model="password"
                                         type="password"
                                         icon="lock"
                                         placeholder="Password"
                                         password-reveal
                                         required>
                                </b-input>
                            </b-field>

                            <b-field label="Introduction" label-position="on-border">
                                <b-input v-model="introduction" maxlength="200" type="textarea"></b-input>
                            </b-field>

                            <b-field>
                                <b-field label="Age" label-position="on-border">
                                    <b-input v-model="age" min=1 max=100 type="number"></b-input>
                                </b-field>
                                <b-field label="Gender" label-position="on-border" >
                                    <b-select v-model="gender">
                                        <option value="Male"> Male </option>
                                        <option value="Female"> Female </option>
                                    </b-select>

                                </b-field>
                                <b-field label="Acitvity" label-position="on-border">
                                    <b-select v-model="activity">
                                        <option value="1.4"> Light </option>
                                        <option value="1.6"> Moderate </option>
                                        <option value="1.8"> Active </option>
                                        <option value="2"> Very active </option>
                                    </b-select>
                                </b-field>
                            </b-field>

                            <b-button value="Register" @click="register(name, username, email, password, introduction, age, gender, activity)"> Register </b-button>

                        </form>
                    </div>
                </div>
            </div>
    </section>
</template>

<script>
    export default {
        name: "Registration",
        data () {
            return {
                file: null,
                name:null,
                username:null,
                email:null,
                password:null,
                introduction:null,
                age:null,
                gender:null,
                activity:null,
                error: null,
            }
        },
        computed:{
            registrationError(){
                return this.$store.getters.registrationError;
            }
        },
        methods:{
            async register(name, username, email, password, introduction, age, gender, activity){
                if(!username || !email || !password || !age || !gender || !activity){
                        this.$buefy.toast.open({
                            duration: 5000,
                            message: `Please fill all the required fields!`,
                            position: 'is-bottom',
                            type: 'is-danger'
                        });
                } else {
                    let user ={
                        fullName: name,
                        username: username,
                        email: email,
                        password: password,
                        introduction: introduction,
                        age: age,
                        gender: gender,
                        activity: activity
                    }

                    await this.$store.dispatch("register", user);
                    if(this.registrationError){
                        this.$buefy.toast.open({
                            duration: 3000,
                            message: `Username is taken!`,
                            position: 'is-bottom',
                            type: 'is-danger'
                        });
                    } else{
                        this.$buefy.toast.open({
                            duration: 4000,
                            message: `Registration was succesful! Please login!`,
                            position: 'is-top',
                            type: 'is-success'
                        });
                        let formData = new FormData();
                        formData.append('picture', this.file);
                        formData.append('userName', username);

                        this.$store.dispatch("addUserImage", formData,
                            {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            });

                        setTimeout(this.$router.push("/login"), 1000);
                    }
                }
            },

        },
    }
</script>

<style scoped>
    .content{
        background-color: rgba(213, 224, 224, 0.6);
        border-radius: 5px;
        width: 50%;
        margin: 50px auto;
        padding: 30px;
    }
    .container{
        padding-top: 2rem;
        width: 50%;
    }
    .title{
        text-align: center;
    }
    .chaleur{
        color: green;
    }


</style>