class AuthenticationService {

    setToken(token){
        localStorage.setItem('token', token);
    }

    setUserRoles(roles){
        localStorage.setItem('roles', JSON.stringify(roles));
    }

    setUsername(username){
        localStorage.setItem('username',username);
    }

    setExpiration(date){
        localStorage.setItem('expiration',date);
    }

    logout(){
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload(false);
    }

    isUserLoggedIn(){
        const token = localStorage.getItem('token');
        if(token === null){
            return false;
        }
        return true;
    }

    getToken(){
        const token = localStorage.getItem('token');
        return token;
    }

    getUserRoles(){
        const roles = localStorage.getItem('roles');
        if(roles.trim()===null){
            return [];
        }
        const rolesArray = JSON.parse(roles);
        return rolesArray;
    }

    getUsername(){
        const username = localStorage.getItem('username');
        return username;
    }

    getExpiration(){
        const date = localStorage.getItem('expiration');
        return date;
    }
}

export default new AuthenticationService();