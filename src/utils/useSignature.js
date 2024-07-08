import { md5 } from "js-md5";

function useSignature({ 
    method = "GET", 
    url = "/books", 
    body = '', 
    userSecret = JSON.parse(sessionStorage.getItem('user'))?.secret 
}) {

    const concatenatedString = `${method}${url}${body}${userSecret}`;
    const md5Signature = md5(concatenatedString);

    return md5Signature;
}

export default useSignature;