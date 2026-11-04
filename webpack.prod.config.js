import 'dotenv/config';
import webpack from 'webpack';

export default {
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.API_URL': JSON.stringify(process.env.DEP_API_URL),
            'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
        }),
    ],
};
