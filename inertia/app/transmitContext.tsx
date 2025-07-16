import { Transmit } from "@adonisjs/transmit-client";
import React, {createContext, useContext } from "react";

const transmit = new Transmit({
    baseUrl: window.location.origin
});

const TransmitContext = createContext<Transmit | null>(null);


export const TransmitProvider: React.FC<{children: React.ReactNode}> = ({children})=> (
    <TransmitContext.Provider value={transmit}>
      {children}
    </TransmitContext.Provider>
)

export const useTransmit = () => {
 const context = useContext(TransmitContext)
 if (!context) {
    throw new Error('Missing context for transmitProvider');
 }
 return context;
}