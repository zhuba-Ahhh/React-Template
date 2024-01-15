import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import type { ConfigEnv } from 'vite';
import { defineConfig, loadEnv } from 'vite';
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv) => {
  const currentEnv = loadEnv(mode, process.cwd());
  console.log('当前模式', command);
  console.log('当前环境配置', currentEnv); //loadEnv即加载根目录下.env.[mode]环境配置文件
  return defineConfig({
    plugins: [
      react(),
      AutoImport({
        imports: ['react', 'react-router-dom'],
        dts: './src/auto-imports.d.ts',
        dirs: ['src/store'],
        eslintrc: {
          enabled: true, // Default `false`
          filepath: './.eslintrc-auto-import.json' // Default `./.eslintrc-auto-import.json`
        }
      }),
      chunkSplitPlugin({
        strategy: 'single-vendor',
        customChunk: (args) => {
          // files into pages directory is export in single files
          let { file } = args;
          if (file.startsWith('src/views/')) {
            file = file.substring(4);
            file = file.replace(/\.[^.$]+$/, '');
            return file;
          }
          return null;
        },
        customSplitting: {
          utils: [/src\/tools/]
        }
      })
    ],
    //项目部署的基础路径,
    base: currentEnv.VITE_PUBLIC_PATH,
    mode: mode,
    resolve: {
      //别名
      alias: {
        '@': resolve(__dirname, './src'),
        '@components': resolve(__dirname, './src/components'),
        '@store': resolve(__dirname, './src/store'),
        '@views': resolve(__dirname, './src/views'),
        '@assets': resolve(__dirname, './src/assets'),
        '@hooks': resolve(__dirname, './src/hooks')
      }
    },
    //服务
    server: {
      //自定义代理---解决跨域
      proxy: {
        // 选项写法
        '/api/yuque': {
          target: 'https://www.yuque.com/api/users',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/yuque/, '')
        },
        '/api/github-contributions': {
          target: 'https://github-contributions.vercel.app',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/github-contributions/, '/api/v1')
        }
      }
    },
    css: {
      // css预处理器
      preprocessorOptions: {
        sass: {
          javascriptEnabled: true
        }
      }
    },
    //构建
    build: {
      outDir: mode === 'docker' ? 'dist' : 'dist', //输出路径
      chunkSizeWarningLimit: 1000,
      //构建后是否生成 source map 文件
      sourcemap: mode != 'production',
      //打包去掉打印信息 保留debugger vite3需要单独安装terser才行
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: false
        }
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          }
        }
      }
    }
  });
};
