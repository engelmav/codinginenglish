module.exports = {
    async redirects() {
      return [
        {
          source: '/es',
          destination: '/',
          permanent: true,
        },
      ]
    },
  }