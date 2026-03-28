import "dotenv/config";

export default {
  expo: {
    name: "I GUIDE U",
    slug: "iguideu",
    scheme: "iguideu",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "automatic",
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.auroragalactic.iguideu",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false
      }
    },
    android: {
      package: "com.auroragalactic.iguideu",
      usesCleartextTraffic: true
    },
    web: {
      bundler: "metro"
    },
    plugins: [
      [
        "@stripe/stripe-react-native",
        {
          merchantIdentifier: "merchant.com.auroragalactic.iguideu",
          enableGooglePay: true
        }
      ]
    ],
    extra: {
      stripePublishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
      stripeMode: process.env.EXPO_PUBLIC_STRIPE_MODE || "test",
      apiBase: process.env.EXPO_PUBLIC_API_BASE || "",
      eas: {
        projectId: "2778ee41-357b-4816-80f0-73b958f93746"
      }
    }
  }
};