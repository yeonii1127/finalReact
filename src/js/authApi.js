import http from "./http";

export function signup({email, password,name,birth}){
    return http.post("/auth/signup",{email,password,name,birth});
}

export function login({email, password}){
    return http.post("/auth/login", {email, password});
}

export function logout(){
    return http.post("/auth/logout");
}

export function checkSession() {
    return http.get("/auth/check");
}

