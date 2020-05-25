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

    return fetch(`http://localhost:9090/auth/login`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // login successful if there's a user in the response
            if (user) {
                // store user details and basic auth credentials in local storage
                // to keep user logged in between page refreshes
                user.authdata = window.btoa(username + ':' + password);
                localStorage.setItem('user', JSON.stringify(user));
                this.store.dispatch("setActUser", user);
            }
            return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function getAll() {
    const requestOptions = {
        method: 'POST',
        headers: authHeader()
    };

    return fetch(`http://localhost:9090/auth/login`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}
