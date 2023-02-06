module.exports = (config) => ({
    ...config,

    watch: true,

    watchOptions: {
        poll: 1000,
        aggregateTimeout: 1000,
        ignored: /node_modules/
    }
});
