import type { StorybookConfig } from '@storybook/react-webpack5'
import { join, dirname } from 'path'
import invariant from 'tiny-invariant'

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): string {
  return dirname(
    require.resolve(join(value, 'package.json')),
  )
}

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-onboarding'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-styling-webpack'),
    {
      name: '@storybook/addon-styling-webpack',
      options: {
        rules: [
          {
            test: /\.(s[ac]ss|css)/,
            sideEffects: true,
            use: [
              require.resolve('style-loader'),
              {
                loader: require.resolve('css-loader'),
                options: {
                  modules: {
                    auto: true,
                    localIdentName:
                      '[local]--[hash:base64:5]',
                  },
                },
              },
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  postcssOptions: {
                    plugins: [['postcss-preset-env']],
                  },
                },
              },
              require.resolve('sass-loader'),
            ],
          },
        ],
      },
    },
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {
      builder: {
        useSWC: true,
      },
    },
  },
  swc: () => ({
    jsc: {
      transform: {
        react: {
          runtime: 'automatic',
        },
      },
    },
  }),
  docs: {
    autodocs: 'tag',
  },
  webpackFinal(config) {
    invariant(config.resolve)
    config.resolve.extensionAlias = {
      js: ['ts', 'tsx', 'js'],
    }
    return config
  },
}
export default config
