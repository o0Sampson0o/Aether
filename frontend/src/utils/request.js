async function postReq(url, json) {
    return await fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json)
    })
        .then(res => res.text())
        .then(text => JSON.parse(text))
        .catch(err => {
            console.error(err);
            return {};
        });
}

async function getReq(url) {
    return await fetch(url, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "include"
    })
        .then(res => res.text())
        .then(text => JSON.parse(text))
        .catch(err => {
            console.error(err);
            return {};
        });
}

export { postReq, getReq };
