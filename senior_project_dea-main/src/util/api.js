import GetConfig from '../Config.js';

/** 
 * A wrapper for fetch to reach the backend api.
 * This wrapper prepends GetConfig().SERVER_ADDRESS to the endpoint and sets the following default values for any request:
 * 
 * {
 * 
 *  method: "GET"
 * 
 *  crossDomain: true
 * 
 *  headers: {
 * 
 *      "Authorization": "Bearer <the current access token>"
 *
 *      "Content-Type": "application/json",
 * 
 *      "Accept": "application/json",
 * 
 *      "Access-Control-Allow-Origin": GetConfig().SERVER_ADDRESS,
 *  }
 * 
 * }
 * 
 * Any request made using with this function can omit these parameters in the request.
 * To override any of the values simply provide them in the req argument.
 * @param {string} endpoint the endpoint of the controller you are requesting
 * @param {RequestInit} req a request object. Providing this will override the defaults above for the fields 
*/
export default async function apiRequest(endpoint, req={}) {
    return fetch(GetConfig().SERVER_ADDRESS + endpoint,{...{
        method: "GET",
        crossDomain:true,
        headers: {
            "Authorization": "Bearer " + window.localStorage.getItem("token"),
            "Content-Type":"application/json",
            Accept:"application/json",
            "Access-Control-Allow-Origin":GetConfig().SERVER_ADDRESS,
        }
    },
    ...req
    })
}