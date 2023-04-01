import { createContext, ReactNode, useContext } from "react";

export const contextStateFactory = <T, V>(useValue: (init: T) => V) => {
    const Context = createContext<V | undefined>(undefined);

    const ContextProvider = ({ initialValue, children }: { initialValue: T, children: ReactNode, }) => {
        return (
            <Context.Provider value={useValue(initialValue)}>
                {children}
            </Context.Provider>
        );
    }

    const useContextState = () => {
        const value = useContext(Context);
        if (value === undefined) {
            throw new Error("Provider missing");
        }
        return value;
    }

    return [ContextProvider, useContextState] as const;
}