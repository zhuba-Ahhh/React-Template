import { useVcosole } from '@hooks/useVconsole';

import MyComponent from './Test';
// 这个是全局的页面 还可以做一些其他的操作

export default function App() {
  useVcosole();
  return <MyComponent />;
}
