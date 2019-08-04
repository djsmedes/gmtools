class CustomFilterPlugin {
  constructor({ exclude }) {
    this.exclude = exclude;
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tap("CustomFilterPlugin", compilation => {
      compilation.warnings = compilation.warnings.filter(
        warning => !this.exclude.test(warning.message)
      );
    });
  }
}

module.exports = {
  assetsDir: "static",

  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        ws: true,
      },
      "/ws": {
        target: "ws://localhost:8000",
        secure: false,
        ws: true,
      },
      "/graphql": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },

  configureWebpack: {
    plugins: [
      new CustomFilterPlugin({
        exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
      }),
    ],

    optimization: {
      splitChunks: {
        minSize: 30000,
        cacheGroups: {
          vendor: {
            chunks: "all",
            name: "vuetify",
            test: /[\\/]node_modules[\\/]vuetify[\\/]/,
          },
        },
      },
    },
    resolve: {
      alias: {
        "@": __dirname + "/_src",
      },
    },
    entry: {
      app: "./_src/main.js",
    },
  },
};
