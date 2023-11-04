import httpProxyMiddleware from "next-http-proxy-middleware";
import settings from "../../settings";
const proxy = (req, res) => {
  return httpProxyMiddleware(req, res, {
    // You can use the `http-proxy` option
    pathRewrite: {
      "/api": "/api",
    },
    target: settings.cieApiUrl,
    logLevel: "debug",
  });
}

export default proxy;
