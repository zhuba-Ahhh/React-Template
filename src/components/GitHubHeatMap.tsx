// https://github-contributions.vercel.app/api/v1/zhuba-Ahhh
import { FC, Fragment, ReactNode, useEffect, useMemo, useState } from 'react';

interface contribution {
  date: string;
  count: number;
  color: string;
  intensity: string;
}

const levelColors: { [key: string]: string } = {
  '0': '#ebedf0',
  '1': '#9be9a8',
  '2': '#40c463',
  '3': '#30a14e',
  '4': '#40c463'
};

const getColor = (level?: number): string => {
  if (level === undefined) {
    return '#ebedf0';
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

const useFetchData = (userName: string, start: number, end: number) => {
  const [data, setData] = useState<contribution[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/github-contributions/${userName}`);
        const jsonData = await response.json();
        setData(jsonData.contributions);
      } catch (error) {
        console.log('fetch data failed', error);
      }
    };

    fetchData();
  }, [userName, start, end]);

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
  userName: string;
  showDesc?: boolean;
  boxSize?: number;
}

const YuQueHeatmap: FC<Props> = ({ years = 1, userName, showDesc = true, boxSize = 14 }: Props) => {
  const [start, end] = useMemo(() => {
    const currentTime = new Date();
    const timestamp = currentTime.setFullYear(currentTime.getFullYear() - (years || 1));
    return [timestamp - 7 * 24 * 3600, Date.now()];
  }, [years]);

  const data = useFetchData(userName, start, end);

  const memoizedGetItem = useMemo(
    () => (list: contribution[], dt: string) => list.find((item) => item.date === dt),
    []
  );

  const renderExhibitionDesc = () => {
    return (
      <div className="descWrap">
        <div className="left"></div>
        <div className="right">
          <span className="rightSpan">Less</span>
          <div className="row">
            {Array.from({ length: 5 }).map((_, index) => {
              return <Fragment key={index}>{renderBox(getColor(index))}</Fragment>;
            })}
          </div>
          <span className="rightSpan">More</span>
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

  const renderFutureBox = useCallback(() => {
    return <div className="box futureBox" style={{ height: boxSize, width: boxSize }}></div>;
  }, []);

  const renderGrid = (data: contribution[]) => {
    const weekCount = 53;
    const weekDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
    const gridData = [];
    const today = getTime(new Date());

    for (let day = 0; day < weekDay.length; day++) {
      const rowData = [];
      for (let week = 0; week < weekCount; week++) {
        const offsetDate = getTime(
          new Date(start + 24 * 3600 * 1000 * day + 7 * 24 * 3600 * 1000 * week)
        );
        const dt = formatDateString(offsetDate);
        const item = memoizedGetItem(data, dt);

        rowData.push({
          color: item?.color || '#ebedf0',
          date: dt,
          content: `Date: ${dt} ${weekDay[day]} Update Count: ${item?.count || 0}`,
          isFuture: offsetDate <= today
        });
      }
      gridData.push(rowData);
    }

    return (
      <div className="grid">
        {showDesc && renderExhibitionDesc()}
        {gridData.map((rowData, rowIndex) => (
          <div key={rowIndex} className="row">
            {rowData.map(({ date, color, content, isFuture }) => (
              <Tooltip key={date} content={content}>
                {isFuture ? renderBox(color) : renderFutureBox()}
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
.futureBox {
  border: 1px solid #f5f5f5;
}
`;
