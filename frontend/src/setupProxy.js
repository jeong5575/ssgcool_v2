const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
 
  app.use(

    createProxyMiddleware( "/flask",{
      target: "http://127.0.0.1:4000", // 플라스크 서버 주소와 포트
      changeOrigin: true,
    })
  );
  app.use(
    
    createProxyMiddleware("/api",{
      target: "http://127.0.0.1:5000", // 백엔드 서버의 주소와 포트
      changeOrigin: true,
    })
  );

};