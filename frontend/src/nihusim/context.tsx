import React, { createContext, useContext, useState } from 'react';

const NihusStickerContext = createContext<{
    selected: number
    setSelected: (id?: number) => void
} | undefined>(undefined);

export const NihusStickerContextProvider: React.FC = ({ children }) => {
  const [selected, setSelected] = useState<number>();

  return (
    <NihusStickerContext.Provider value={{
        selected,
        setSelected,
    }}>
      {children}
    </NihusStickerContext.Provider>
  );
};

export const useNihusStickerContext = () => useContext(NihusStickerContext);

export const useSelectNihusView = () => {
    const {setSelected} = useNihusStickerContext()
    return setSelected
}