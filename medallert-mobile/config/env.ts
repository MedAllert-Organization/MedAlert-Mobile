import Constants from "expo-constants";

type Env = Record<string, string | undefined>;

const env: Env = Constants.expoConfig?.extra || {};

export default env;
