var production = {
    domain: "https://voico.online",
    webSocketURL: "ws://voico.online"
};
var dev = {
    domain: "https://localhost",
    webSocketURL: "ws://localhost"
};
// Change the development environment from here
// uncomment 2nd line if env is production and vice versa
var CURRENT_ENVIRONMENT = "DEV";
// const CURRENT_ENVIRONMENT: ENV = "PRODUCTION";
function getEnv(env) {
    return env == "DEV" ? dev : production;
}
export default getEnv(CURRENT_ENVIRONMENT);
