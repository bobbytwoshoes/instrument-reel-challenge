
import { ElementType, HTMLAttributes } from "react";
import { Instrument } from "./InstrumentReelStore";

type InstrumentLogoProps = {
  path: string
  alt: string
};

const InstrumentLogo = ({ path, alt }: InstrumentLogoProps) => (<img className="instrument-logo" src={path} alt={alt} />);

interface InstrumentDisplayProps extends Instrument, HTMLAttributes<HTMLOrSVGElement> {
  className?: string
  elementType?: ElementType
};

const InstrumentDisplay = ({ 
  category, 
  name, 
  lastQuote, 
  percentageChange = 0.000, 
  code, 
  className,
  pair,
  elementType: Element = 'div',
}: InstrumentDisplayProps) => {

  let instrumentStyles = `instrument ${className ? className : ''}`;
  let percentagePrefix = ' ';

  if (percentageChange > 0) {
    instrumentStyles += ' price-increase';
    percentagePrefix = '+';

  } else if(percentageChange < 0) {
    instrumentStyles += ' price-decrease';
  }
  
  let imageComponent = <InstrumentLogo path={`/${category}/${code}.svg`} alt={`${name} logo`}/>

  if (category === 'forex') {
    imageComponent = ( 
      <div className="instrument-logo-group">
          {pair.map(pairCode => <InstrumentLogo key={pairCode} path={`/public/${category}/${pairCode}.svg`} alt={`${pairCode} logo`}/> )}
      </div>
    );
  }

  return (
    <Element className={instrumentStyles}> 
      {imageComponent}
      <span className="instrument-name">{name}</span>
      <span className="instrument-quote">{lastQuote}</span>
      <span className="instrument-percentage">{`${percentagePrefix}${percentageChange.toFixed(3)}%`}</span>
    </Element>
  );
};

export default InstrumentDisplay;
