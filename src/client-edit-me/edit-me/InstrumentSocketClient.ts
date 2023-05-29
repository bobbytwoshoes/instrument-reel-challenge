/**
 * ☑️ You can edit MOST of this file to add your own styles.
 */

/**
 * ✅ You can add/edit these imports
 */
import {
  Instrument,
  InstrumentSymbol,
  WebSocketClientMessageJson,
  WebSocketMessage,
  WebSocketReadyState,
  WebSocketServerMessageJson,
} from "../../common-leave-me";

/**
 * Notes:
 * 
 * To subscribe or unsubscribe to/from instrument(s), send a message to the server with the following format:
 * 
 * export type WebSocketClientMessageJson =
  | {
      type: "subscribe";
      instrumentSymbols: InstrumentSymbol[];
    }
  | {
      type: "unsubscribe";
      instrumentSymbols: InstrumentSymbol[];
    };
  *
  * The server will start responding with a message with the following format:
  * 
  * export type WebSocketServerMessageJson = {
      type: "update";
      instruments: Instrument[];
    };
 */
    export type WebSocketMessageCallback = (data: WebSocketServerMessageJson) => void;

    type Subscriber = {
      callback: WebSocketMessageCallback,
      id: string
    }

/**
 * ❌ Please do not edit this class name
 */
export class InstrumentSocketClient {
  /**
   * ❌ Please do not edit this private property name
   */
  private _socket: WebSocket;

  /**
   * ✅ You can add more properties for the class here (if you want) 👇
   */

  public socketReadyIntervalTime: number
  public subscribers?: Subscriber[]

  constructor() {
    /**
     * ❌ Please do not edit this private property assignment
     */
    this._socket = new WebSocket("ws://localhost:3000/ws");

    /**
     * ✅ You can edit from here down 👇
     */

    this.subscribers =  [];
    this.socketReadyIntervalTime = 200;
  
    this._socket.onmessage = (event) => {      
      if(!this.subscribers?.length) {
        return;
      }

      this.subscribers.forEach(({ callback}) => {
        if (typeof(callback) === 'function') {
          const { data } = event;

          try {
            const parsedData = JSON.parse(data);

            if (parsedData){
              callback(parsedData);
            }

          } catch (error) {
            // Log error in parsing JSON
            callback({
              type: 'update', // Could be sending back an error here, but type in file marked not to edit
              instruments: []
            });
            return;
          }       
        }
      });
    };
  };
  
  waitForSocketReady(): Promise<void> {
    return new Promise((resolve)  => {
      if (this._socket.readyState === this._socket.OPEN) {
        resolve();
        return;
      }
      const interval = setInterval(() => {
        if (this._socket.readyState === this._socket.OPEN) {
            clearInterval(interval);
            resolve();
        }
    }, this.socketReadyIntervalTime)  
  });
}

  send(message:any) {
    this._socket.send(JSON.stringify(message));
  }

  async subscribe(symbols:InstrumentSymbol[], callback:WebSocketMessageCallback) {
    await this.waitForSocketReady();
      
    this.send({
      type: "subscribe",
      instrumentSymbols:symbols,
    });
    
    this.subscribers?.push({
      id: symbols.toString(),
      callback,
    });
  }

  async unSubscribe(symbols:InstrumentSymbol[]) {
    await this.waitForSocketReady();

    this.send({
      type: "unsubscribe",
      instrumentSymbols: symbols,
    });

    if (!this.subscribers) {
      return;
    }
    
    this.subscribers = this.subscribers.filter(({id}) => id !== symbols.toString()) ;
  }
}
