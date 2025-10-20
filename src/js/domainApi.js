import axios from "axios";

export function sendDomain(selecetedDomain){
    return http.post("/api/domain", {selecetedDomain});
}