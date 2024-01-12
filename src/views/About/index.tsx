import { useUserStore } from '@store/user';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

import YuQueHotMap from '../../components/YuQueHotMap';

function About() {
  const [pageTitle] = useState('Ywj-关于页面');
  const { num, changeNum } = useUserStore();
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <h1>{pageTitle}</h1>
      <Button onClick={goBack}>返回</Button>
      <h2>userSore.num:{num}</h2>
      <button onClick={changeNum}>点击使用zustand提供的store改变数字</button>
      <YuQueHotMap userId={27625077} />
    </div>
  );
}

export default About;
