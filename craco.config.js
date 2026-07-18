const path = require('path');

module.exports = {
  jest: {
    configure: {
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
    },
  },
  webpack: {
    configure: (webpackConfig) => {
      // Path alias: @/ → src/
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        '@': path.resolve(__dirname, 'src'),
      };

      // CRA 5 sets config:false on postcss-loader, so postcss.config.js is never read.
      // Inject Tailwind v4 directly into every postcss-loader instance.
      const injectTailwind = (rules) => {
        rules.forEach((rule) => {
          if (rule.oneOf) {
            injectTailwind(rule.oneOf);
          } else if (Array.isArray(rule.use)) {
            rule.use.forEach((loader) => {
              if (
                typeof loader === 'object' &&
                loader.loader &&
                loader.loader.includes('postcss-loader') &&
                loader.options &&
                loader.options.postcssOptions
              ) {
                loader.options.postcssOptions.plugins = [
                  require('@tailwindcss/postcss'),
                  ...loader.options.postcssOptions.plugins,
                ];
              }
            });
          }
        });
      };

      injectTailwind(webpackConfig.module.rules);
      return webpackConfig;
    },
  },
};
