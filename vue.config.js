module.exports = {
  assetsDir: "static",

  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        ws: true
      }
    }
  },

  configureWebpack: config => {
    return {
      resolve: {
        alias: {
          "@": __dirname + "/_src"
        }
      },
      entry: {
        app: "./_src/main.js"
      }
    };
  }
};
