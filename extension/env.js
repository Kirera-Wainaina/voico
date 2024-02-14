var dev = {
    domain: "https://voico.online"
};
var production = {
    domain: "https://localhost"
};
// Change the development environment from here
// uncomment 2nd line if env is production and vice versa
var CURRENT_ENVIRONMENT = "DEV";
// const CURRENT_ENVIRONMENT: ENV = "PRODUCTION";
function getEnv(env) {
    return env == "DEV" ? dev : production;
}
export default getEnv(CURRENT_ENVIRONMENT);
