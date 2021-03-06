import { authHeader } from './auth_header';
import { store } from "../store/index";

export const userService = {
    login,
    logout,
    getAll,
    store
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: {'Authorization': 'Basic ' + window.btoa(username + ':' + password)}
    };

    return fetch(`https://chaleurback.herokuapp.com/auth/login`, requestOptions)
        .then(handleResponse)
        .then(user => {
            if (user) {
                user.authdata = window.btoa(username + ':' + password);
                localStorage.setItem('user', JSON.stringify(user));
                this.store.dispatch("setActUser", user);
            }
            return user;
        });
}

function logout() {
    localStorage.removeItem('user');
    localStorage.clear();
}

function getAll() {
    const requestOptions = {
        method: 'POST',
        headers: authHeader()
    };

    return fetch(`https://chaleurback.herokuapp.com/auth/login`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                logout();
                location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}
