module.exports = {
  apps: [
    {
      name: "qawasem",
      script: ".output/server/index.mjs",
      env: {
        NODE_ENV: "production",
        FAMILY_MEMBERS_API_BASE: process.env.FAMILY_MEMBERS_API_BASE
      }
    }
  ]
};