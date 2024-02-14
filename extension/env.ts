// set up variables for dev and production
// Change from here and every other variable changes as well
interface IEnvironment {
  domain: string,

}

type ENV = "DEV" | "PRODUCTION";

const dev: IEnvironment = {
  domain: "https://voico.online"
}

const production: IEnvironment = {
  domain: "https://localhost"
}

// Change the development environment from here
// uncomment 2nd line if env is production and vice versa
const CURRENT_ENVIRONMENT: ENV = "DEV";
// const CURRENT_ENVIRONMENT: ENV = "PRODUCTION";

function getEnv(env: ENV) {
  return env == "DEV" ? dev : production;
}

export default getEnv(CURRENT_ENVIRONMENT);