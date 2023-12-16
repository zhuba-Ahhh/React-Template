import './Test.css';

import { Button, Modal } from 'antd';
import Markdown from 'markdown-to-jsx';
import { ReactNode, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { uuid } from 'zhuba-tools';

const MyComponent = () => {
  const title = '方舟更新啦~';
  const markdownContent = `
  ## 1.2.xx
  ### 2023-12-05
  ### 引擎版本更新到 v1.3.67；
  ![RUNOOB 图标](http://static.runoob.com/images/runoob-logo.png)\n
  变量监听方式改变，统一放置在变量卡片内；
  * 滚动条尺寸增加；
  * 大纲位置调整，转移至【#】
  * 导航位置调整，转移至【#】右侧
  * 其它场景可访问全局场景变量及FX等；
  * 其他体验、稳定性等优化
  ● 引擎版本更新到 v1.3.67；\n
  ● 变量监听方式改变，统一放置在变量卡片内；\n
  ● 滚动条尺寸增加；\n
  ● 大纲位置调整，转移至【#】;\n
  ● 导航位置调整，转移至【#】右侧；\n
  ● 其它场景可访问全局场景变量及FX等；\n
  ● 其他体验、稳定性等优化。\n
  ## 1.2.xx
  ### 2023-12-06
  `;

  const [open, setOpen] = useState(false);

  const CustomModal = ({ content }: { content: ReactNode }) => (
    <Modal
      title={title}
      open={open}
      onCancel={() => setOpen(false)}
      footer={
        <Button type="primary" onClick={() => setOpen(false)}>
          我知道啦
        </Button>
      }
    >
      {content}
    </Modal>
  );

  const openModel = (content: ReactNode) => {
    const cloneModel = () => Modal.destroyAll();
    Modal.info({
      title,
      icon: null,
      open,
      onCancel: () => cloneModel,
      footer: () => (
        <Button type="primary" onClick={cloneModel}>
          我知道啦
        </Button>
      ),
      content
    });
  };

  return (
    <>
      {uuid()}
      <Button onClick={() => setOpen(true)}>MarkDown</Button>
      <Button
        onClick={() =>
          openModel(
            <>
              <div className="toolbar">
                <span>更新日志</span>
                <a href="https://docs.qingque.cn/d/home/eZQBb2cS1SwmBWRtG4P3kaYsN?identityId=1zHGO2bBsPM">
                  查看更多
                </a>
              </div>
              <ReactMarkdown>{markdownContent}</ReactMarkdown>
              <Markdown>{markdownContent}</Markdown>
            </>
          )
        }
      >
        MarkDown
      </Button>
      <CustomModal
        content={
          <>
            <div className="toolbar">
              <span>更新日志</span>
              <a href="https://docs.qingque.cn/d/home/eZQBb2cS1SwmBWRtG4P3kaYsN?identityId=1zHGO2bBsPM">
                查看更多
              </a>
            </div>
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
          </>
        }
      />
    </>
  );
};

export default MyComponent;
