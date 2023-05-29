import { useReducer } from 'react';
import { Instrument as InstrumentBase } from "../../common-leave-me";

export interface Instrument extends InstrumentBase{
  percentageChange?: number
};

type InstrumentReelState = { 
    instruments: Instrument[]
};

type InstrumentReelActions = { 
    type: 'update', 
    payload: {
        instruments: Instrument[]
    }
};

function calculateChange(currentInstruments: Instrument[], newInstruments: Instrument[]): Instrument[] {
    if (!currentInstruments?.length) {
        return newInstruments;
    }

    return newInstruments.map((instrument: InstrumentBase):Instrument => {
        const storedInstrument = currentInstruments.find(({code}) => code === instrument.code);
        let percentageChange = 0.000;

        if (storedInstrument) {    
            const difference = instrument.lastQuote  - storedInstrument?.lastQuote ;
            percentageChange = (difference  / storedInstrument?.lastQuote) * 100;
        }
    
        return {
            ...instrument,
            percentageChange,
        };
    });
};

const reducer = (state: InstrumentReelState, action: InstrumentReelActions): InstrumentReelState => {
	const {
		type,
		payload,
	} = action;

	switch (type) {
		case 'update':
			return {
				instruments: calculateChange(state.instruments, payload?.instruments),
			};
		default:
			console.error(`Unexpected message reducer action type - ${type}`);
			return state;
	}
}

const useInstrumentReelReducer = (initialState: InstrumentReelState) => useReducer(reducer, initialState);

export default useInstrumentReelReducer; 
