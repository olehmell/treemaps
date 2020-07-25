import React, { useContext, createContext, useState } from 'react';

type MerasurementType = {
  isTwoWindowsType: boolean,
  toggleMerasurementType: () => void,
}

export const MerasurementTypeContext = createContext<MerasurementType>({ isTwoWindowsType: false, toggleMerasurementType: {} as any });

export const useMerasurementTypeContext = () =>
  useContext(MerasurementTypeContext)

export const MerasurementTypeProvider = (props: React.PropsWithChildren<{}>) => {
  const [ isTwoWindowsType, setIsTwoWindowsType  ] = useState(false)
  console.log(isTwoWindowsType)
  return <MerasurementTypeContext.Provider value={{ isTwoWindowsType, toggleMerasurementType: () => setIsTwoWindowsType(!isTwoWindowsType) }}>
    {props.children}
  </MerasurementTypeContext.Provider>
}