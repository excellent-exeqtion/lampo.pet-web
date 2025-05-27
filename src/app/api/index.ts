import { ApiParams } from "@/types/lib";
import { Strings } from "@/utils/index";

export async function getFetch(url: string, params: ApiParams | undefined = undefined) {
    return await methodFetch("GET", url, params);
}

export async function putFetch(url: string, params: ApiParams | undefined = undefined, payload: object | undefined = undefined) {
    return await methodFetch("PUT", url, params, payload);
}

export async function postFetch(url: string, params: ApiParams | undefined = undefined, payload: object | undefined = undefined) {
    return await methodFetch("POST", url, params, payload);
}

export async function patchFetch(url: string, params: ApiParams | undefined = undefined, payload: object | undefined = undefined) {
    return await methodFetch("PATCH", url, params, payload);
}

export async function deleteFetch(url: string, params: ApiParams | undefined = undefined, payload: object | undefined = undefined) {
    return await methodFetch("DELETE", url, params, payload);
}

async function methodFetch(method: string, url: string, params: ApiParams | undefined = undefined, payload: object | undefined = undefined) {
    let parameters = "";
    if (params) {
        parameters = Strings.fromParams(params);
    }
    let body = undefined;
    if (payload) {
        body = JSON.stringify(payload);
    }
    return await fetch(`${process.env.PROTOCOL}://${process.env.VERCEL_URL}${url}${parameters}`, {
        method: method,
        headers: method == "GET" ? undefined : { 'Content-Type': 'application/json' },
        body: body
    })
}