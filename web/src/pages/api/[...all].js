import httpProxyMiddleware from "next-http-proxy-middleware";
export default (req, res) =>
  httpProxyMiddleware(req, res, {
    // You can use the `http-proxy` option
    pathRewrite: {
      "/api": "/api",
    },
    target: "http://localhost:5000",
    logLevel: "debug",
  });
