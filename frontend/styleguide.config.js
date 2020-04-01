var webpackBase = require('./config/webpack.config.js');

module.exports = {
    ignore: ['src/history.js',
        'src/index.js',
        'src/**/*.test.js',
        'src/**/*.config.*',
        'src/jsconfig.js',
        'src/serviceWorker.js',
        'src/**/Auth.js',
        'src/**/RequiresAuth.js'
    ],
    components: 'src/**/*.js',
    template: {
        head: {
            links: [
                {
                    rel: 'stylesheet',
                    href: 'https://fonts.googleapis.com/css?family=Roboto'
                }
            ]
        }
    },
    webpackConfig: webpackBase
}