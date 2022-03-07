import { createContext, useState } from 'react';

export const CatContext = createContext()
const CatContextProvider = (props) => {
    const [currentCat, setCurrentCat] = useState(null);
    const [cats, setCats] = useState([]);

    return (
        <CatContext.Provider value={{ currentCat, setCurrentCat, cats, setCats }}>
            {props.children}
        </CatContext.Provider>
    )
}

export default CatContextProvider;