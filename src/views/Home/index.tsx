import dockerLogo from '@assets/Docker.svg';
import reactLogo from '@assets/react.svg';
import { useUserStore } from '@store/user';
import { Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';

import HomeStyle from './index.module.scss';

const publicPath = import.meta.env.VITE_PUBLIC_PATH;
function Home() {
  const [messageApi, contextHolder] = message.useMessage();
  const { num, changeNum } = useUserStore();
  const navigate = useNavigate();
  const goAboutPage = () => {
    navigate('/about');
  };
  const Toast = () => {
    messageApi.info(num);
  };

  return (
    <div className={HomeStyle.home}>
      {contextHolder}
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={publicPath + '/vite.svg'} className={HomeStyle.logo} alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank" rel="noreferrer">
          <img
            src={reactLogo}
            className={`${HomeStyle.logo} ${HomeStyle.react}`}
            alt="React logo"
          />
        </a>
        <a href="https://forums.docker.com/" target="_blank" rel="noreferrer">
          <img src={dockerLogo} className={HomeStyle.logo} alt="Docker logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className={HomeStyle.card}>
        <button onClick={changeNum}>{`UserStore's count is ${num}`}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <Button type="primary" onClick={Toast}>
        Button
      </Button>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
      <button onClick={goAboutPage}>点击跳转到about页面</button>
    </div>
  );
}

export default Home;
