module.exports = {
    ignore: ['src/history.js',
    'src/index.js',
    'src/**/*.test.js',
    'src/**/*.config.*',
    'src/jsconfig.js',
    'src/serviceWorker.js'
    ],
    components: 'src/**/*.js',
    webpackConfig: require('./config/webpack.config.js')
}