/**
 * ☑️ You can edit MOST of this file to add your own styles.
 */

/**
 * ✅ You can add/edit these imports
 */
import { useEffect } from "react";
import { InstrumentSymbol, Instrument } from "../../common-leave-me";
import { InstrumentSocketClient, WebSocketMessageCallback } from "./InstrumentSocketClient";
import InstrumentDisplay from "./InstrumentDisplay";
import TickerTape from "./TickerTape";
import useInstrumentReducer from "./InstrumentReelStore";
import "./InstrumentReel.css";

/**
 * ❌ Please do not edit this
 */
const client = new InstrumentSocketClient();

/**
 * ❌ Please do not edit this hook name & args
 */
function useInstruments(instrumentSymbols: InstrumentSymbol[]) {
  /**
   * ✅ You can edit inside the body of this hook
   */

  const [{ instruments } , dispatch] = useInstrumentReducer({ instruments: [] });

  useEffect(() => {
    const subscribeCallback: WebSocketMessageCallback = (data) => {
      if (!data.type) {
        return;
      }

      const filteredData = data?.instruments.filter(({ code }) => instrumentSymbols.includes(code));
      dispatch({
        type: data.type,
        payload: {
          instruments: filteredData
        }
      });
    };

    client.subscribe(instrumentSymbols, subscribeCallback);

    return ()=> {
      client.unSubscribe(instrumentSymbols);  
    };
  }, [instrumentSymbols]);

  return instruments;
}

export interface InstrumentReelProps {
  instrumentSymbols: InstrumentSymbol[];
}

function InstrumentReel({ instrumentSymbols } : InstrumentReelProps) {
  /**
   * ❌ Please do not edit this
   */
  const instruments = useInstruments(instrumentSymbols);
  /**
   * ✅ You can edit from here down in this component.
   * Please feel free to add more components to this file or other files if you want to.
   */
  return (
    <div className="instrument-reel">

      {!instruments.length && (
        <div className="loading">Loading Instruments&hellip;</div>
      )}
  
      {instruments.length ? (
        <TickerTape tickerSpeed={60} >
          <ul>{instruments.map((instrument:Instrument) => {
            return (
              <InstrumentDisplay 
                {...instrument} 
                elementType="li" 
                key={instrument.code} 
              />
            );
          })}
          </ul>
        </TickerTape>
      ): null}
    </div>
  );
}

export default InstrumentReel;
