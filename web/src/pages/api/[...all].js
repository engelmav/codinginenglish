import httpProxyMiddleware from "next-http-proxy-middleware";
import settings from "../../settings";
const proxy = (req, res) => {
  console.log("returning httpProxyMiddleware with proxy target", settings.cieApiUrl)
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
