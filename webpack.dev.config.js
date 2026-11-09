import DotenvWebpackPlugin from 'dotenv-webpack';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new DotenvWebpackPlugin({
      systemvars: true,
    }),
  ],
  devServer: {
    static: path.resolve(__dirname, './dist'),
  },
};
