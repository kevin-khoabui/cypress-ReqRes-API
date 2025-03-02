class UsersAPI {
    constructor(){
        this.baseUrl = "https://reqres.in/api";
    }

    getUsers(page = 1){
        return `${this.baseUrl}/users?page=${page}`;
    }

    getUsersByID(userId){
        return `${this.baseUrl}/users/${userId}`;
    }

    createUser(){
        return `${this.baseUrl}/users`;
    }

    loginUser(){
        return `${this.baseUrl}/login`;
    }
    
    updateUser(userId){
        return `${this.baseUrl}/users/${userId}`;
    }

    deleteUser(userId){
        return `${this.baseUrl}/users/${userId}`;
    }
}

export default new UsersAPI();