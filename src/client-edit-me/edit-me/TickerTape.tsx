import { useEffect, useRef, useState, ReactNode } from 'react';
import './TickerTape.css';

type TickerTapeProps = {
    children: ReactNode,
    tickerSpeed: number
}

const TickerTape = ({ children, tickerSpeed }: TickerTapeProps) => {
  const track = useRef<HTMLDivElement>(null);
  const initialGroup = useRef<HTMLDivElement>(null);
  const [clones, setClones] = useState<ReactNode[]>([]);
  const [speed, setTickerSpeed] = useState(tickerSpeed);

  useEffect(() => {
    if (!children || !initialGroup.current || !track.current) {
      return;
    }

    const groupWidth = initialGroup.current.offsetWidth;
    const trackWidth = track.current.offsetWidth;
    const cloneTotal = Math.ceil(trackWidth / groupWidth);
    const tickerGroups: ReactNode[] = [];

    for (let i = 0; i <= cloneTotal; i += 1) {
      tickerGroups.push((
        <div key={`clone-${i}`} className="ticker-tape-group" >
          {children}
        </div >
      ));
    };
    setTickerSpeed(groupWidth / tickerSpeed );
    setClones(tickerGroups);
  }, []);

  if (!children) {
    return null;
  }

  const tickerStyles = { "--tickerSpeed": `${speed}s` } as React.CSSProperties;

  return (
    <div className="ticker-tape" ref={track} style={tickerStyles}>
      <div className="ticker-tape-group" ref={initialGroup}>
        {children}
      </div>
      {clones}
    </div>
  );
};

export default TickerTape;
