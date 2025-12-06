module.exports = {
  apps: [
    {
      name: 'QAWASEM',
      port: '3050',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
    },
  ],
}
