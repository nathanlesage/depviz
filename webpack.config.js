const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './src/main.ts',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'node_modules/leader-line/leader-line.min.js', to: 'leader-line.min.js' },
        { from: 'node_modules/tippy.js/dist/tippy.css', to: 'tippy.css' },
        {
          from: 'public',
          to: '.',
          globOptions: {
            // Ignore the .env.example file (but not the .env file)
            ignore: [ '**/.env.example' ]
          }
        }
      ]
    })
  ]
};
