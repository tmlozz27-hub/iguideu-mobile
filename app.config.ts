import "dotenv/config";

export default {
  expo: {
    owner: "auroragalactic",
    name: "I GUIDE U",
    slug: "iguideu",
    scheme: "iguideu",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "automatic",

    icon: "./assets/adaptive-icon.png",

    splash: {
      backgroundColor: "#020617"
    },

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
      usesCleartextTraffic: true,

      splash: {
        backgroundColor: "#020617"
      },

      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#020617"
      },

      permissions: ["ACCESS_FINE_LOCATION"],

      config: {
        googleMaps: {
          apiKey: "AIzaSyC-qFKhmFTQC1b1p7kd7CBLeDIYlrM1cAk"
        }
      }
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
      ],
      [
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme:
            "com.googleusercontent.apps.661263042735-677bo9vuvgkds5g80h2phrn683rv3d88"
        }
      ]
    ],

    extra: {
      stripePublishableKey:
        process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
      stripeMode:
        process.env.EXPO_PUBLIC_STRIPE_MODE || "live",
      apiBase:
        process.env.EXPO_PUBLIC_API_BASE || "",
      eas: {
        projectId: "eb86ee2e-b0b4-47f8-b384-31ee5594ea8a"
      }
    }
  }
};