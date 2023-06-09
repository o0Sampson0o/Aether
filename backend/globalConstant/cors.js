let allowedOriginProto = ["http://localhost:3000", "http://localhost:8080"];

//dup localhost to 127.0.0.1
allowedOriginProto = allowedOriginProto.map(x => {
    if (x.includes("localhost")) {
        return [x, x.replace("localhost", "127.0.0.1")]
    } else {
        return x;
    }
});

const allowedOrigin = Object.freeze(allowedOriginProto.flat());

module.exports = { allowedOrigin };
