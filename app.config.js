// app.config.js
// Lee tu app.json (incluyendo icon/splash existentes) y SOLO agrega cleartext en Android.

module.exports = ({ config }) => {
  return {
    ...config,
    android: {
      ...(config.android || {}),
      cleartextTrafficPermitted: true
    }
  };
};
