const path = require('path');
module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    configureWebpack: {
        resolve: {
            alias: {
                "@": path.resolve(__dirname, 'src/'),
                "@$": path.resolve(__dirname, 'public/')
            }
        }
    },
}