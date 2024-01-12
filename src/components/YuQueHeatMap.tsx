import { FC, Fragment, ReactNode, useEffect, useMemo, useState } from 'react';

import dataJson from './yuque.json';

interface hotmapItem {
  biz_date: string;
  update_doc_count?: number;
  update_note_count?: number;
  comment_count?: number;
  level?: number;
  _serializer: string;
}

const levelColors: { [key: string]: string } = {
  '-1': '#f5f5f5',
  '0': '#f4f5f5',
  '1': '#daf6ea',
  '2': '#c7f0df',
  '3': '#82edc0',
  '4': '#00b96b',
  '5': '#00663b'
};

const getColor = (level?: number): string => {
  if (level === undefined) {
    return '#f5f5f5';
  }

  return levelColors[level?.toString()] || levelColors['-1'];
};

const formatDateString = (str: string): string => {
  return `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6)}`;
};

const getTime = (datetime: Date): string => {
  const year = datetime.getFullYear();
  const month = (datetime.getMonth() + 1).toString().padStart(2, '0');
  const date = datetime.getDate().toString().padStart(2, '0');
  return `${year}${month}${date}`;
};

const useDebounce = (callback: () => void, delay = 200) => {
  const debounceCallback = useMemo(() => {
    let timer: NodeJS.Timeout | null = null;
    return (...args: Parameters<typeof callback>) => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  }, [callback, delay]);

  return (...args: Parameters<typeof callback>) => debounceCallback(...args);
};

const useFetchData = (userId: string | number, start: number, end: number) => {
  const [data, setData] = useState<hotmapItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://www.yuque.com/api/users/${userId}/hotmap?end_date=${end}&start_date=${start}`
        );
        const jsonData = await response.json();
        setData(jsonData.data.hotmap);
      } catch (error) {
        console.log('fetch data failed', error);
      }
    };

    fetchData();
  }, [userId, start, end]);

  return data;
};

interface TooltipProps {
  children: ReactNode;
  content: string;
}

const Tooltip: FC<TooltipProps> = ({ content, children }: TooltipProps) => {
  const [visible, setVisible] = useState(false);

  const handleMouseEnter = useDebounce(() => setVisible(true));
  const handleMouseLeave = useDebounce(() => setVisible(false));

  return (
    <div
      className="tooltip-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <span className={`tooltip ${visible ? 'visible' : ''}`}>{content}</span>
    </div>
  );
};

interface Props {
  years?: number;
  userId: number | string;
  showDesc?: boolean;
  boxSize?: number;
}

const YuQueHeatmap: FC<Props> = ({ years = 1, userId, showDesc = true, boxSize = 14 }: Props) => {
  const [start, end] = useMemo(() => {
    const currentTime = new Date();
    const timestamp = currentTime.setFullYear(currentTime.getFullYear() - (years || 1));
    return [timestamp - 7 * 24 * 3600, Date.now()];
  }, [years]);

  const data = dataJson.data.hotmap;
  useFetchData(userId, start, end);

  const memoizedGetItem = useMemo(
    () => (list: hotmapItem[], dt: string) => list.find((item) => item.biz_date === dt),
    []
  );

  const renderExhibitionDesc = () => {
    return (
      <div className="descWrap">
        <div className="left">
          <span>创作指数</span>
        </div>
        <div className="right">
          <span className="rightSpan">不活跃</span>
          <div className="row">
            {Array.from({ length: 7 }).map((_, index) => {
              return <Fragment key={index}>{renderBox(getColor(index - 1))}</Fragment>;
            })}
          </div>
          <span className="rightSpan">活跃</span>
        </div>
      </div>
    );
  };

  const renderBox = useCallback((bgColor: string) => {
    return (
      <div
        className="box"
        style={{ backgroundColor: bgColor, height: boxSize, width: boxSize }}
      ></div>
    );
  }, []);

  const renderGrid = (data: hotmapItem[]) => {
    const weekCount = 53;
    const weekDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
    const gridData = [];

    for (let day = 0; day < weekDay.length; day++) {
      const rowData = [];
      for (let week = 0; week < weekCount; week++) {
        const offsetDate = new Date(start + 24 * 3600 * 1000 * day + 7 * 24 * 3600 * 1000 * week);
        const dt = getTime(offsetDate);
        const item = memoizedGetItem(data, dt);

        rowData.push({
          level: item?.level || undefined,
          biz_date: dt,
          content: `Date: ${formatDateString(dt)} ${weekDay[day]} Update Count: ${
            item?.update_doc_count || 0
          }`
        });
      }
      gridData.push(rowData);
    }

    return (
      <div className="grid">
        {showDesc && renderExhibitionDesc()}
        {gridData.map((rowData, rowIndex) => (
          <div key={rowIndex} className="row">
            {rowData.map(({ biz_date, level, content }) => (
              <Tooltip key={biz_date} content={content}>
                {renderBox(getColor(level))}
              </Tooltip>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {renderGrid(data)}
      <style>{styles}</style>
    </>
  );
};

export default YuQueHeatmap;

const styles = `
.grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: fit-content;
  width: fit-content;
}
.descWrap {
  width: 100%;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
}
.right {
  display: flex;
  align-items: center;
}
.rightSpan {
  margin: 0 2px
}
.row {
  height: auto;
  width: auto;
  display: flex;
}
.tooltip-container {
  position: relative;
  display: inline-block;
}
.tooltip {
  position: absolute;
  background-color: #333;
  color: #fff;
  padding: 8px;
  border-radius: 4px;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 1;
  white-space: nowrap; /* 防止文字换行 */
  max-width: 320px; /* 固定最大宽度 */
}

.tooltip.visible {
  visibility: visible;
  opacity: 1;
}
.box {
  margin: 2px;
  border-radius: 2px;
}
`;
