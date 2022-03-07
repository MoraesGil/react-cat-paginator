const apiKey = '24be637f-e596-4847-b47a-1791feeea1bd'

export const getFetch = (url, params = {}) => {
    const queryString = Object.entries(params).map(param => `${param[0]}=${param[1]}`).join('&');

    return fetch(`${url}?${queryString}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'x-api-key': apiKey
        }
    });
}