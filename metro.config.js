// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { wrapWithReanimatedMetroConfig } = require("react-native-reanimated/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver = {
  ...config.resolver,
  resolverMainFields: ["react-native", "browser", "main"],
  unstable_conditionNames: ["require", "default", "browser"],
};

// Bọc lại với reanimated
module.exports = wrapWithReanimatedMetroConfig(config);
