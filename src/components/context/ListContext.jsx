import React, { createContext, useState, useEffect } from 'react';

export const ListContext = createContext();

export const ListProvider = ({ children }) => {
  const [list, setList] = useState(() => {
    const storedList = localStorage.getItem('list');
    return storedList ? JSON.parse(storedList) : false;
  });


  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list));
  }, [list]);

  const toggleList = () => {
    setList(prev => !prev);
  };
  
  return (
    <ListContext.Provider value={{ list, toggleList }}>
    {children}
  </ListContext.Provider>
  )

} 