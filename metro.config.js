// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver = {
  ...config.resolver,
  resolverMainFields: ["react-native", "browser", "main"],
};

config.resolver.unstable_conditionNames = ["require", "default", "browser"];

module.exports = config;
