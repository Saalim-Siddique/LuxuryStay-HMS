import { createContext, useContext, useState, useCallback } from 'react';

const HotelContext = createContext(null);

export const HotelProvider = ({ children }) => {
  const [activeHotel, setActiveHotel] = useState(null); // { _id, name, slug, currency, taxRate }

  const selectHotel = useCallback((hotel) => {
    setActiveHotel(hotel);
    if (hotel) {
      localStorage.setItem('hms_active_hotel', JSON.stringify(hotel));
    } else {
      localStorage.removeItem('hms_active_hotel');
    }
  }, []);

  const clearHotel = useCallback(() => {
    setActiveHotel(null);
    localStorage.removeItem('hms_active_hotel');
  }, []);

  return (
    <HotelContext.Provider value={{ activeHotel, selectHotel, clearHotel }}>
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => {
  const ctx = useContext(HotelContext);
  if (!ctx) throw new Error('useHotel must be used within <HotelProvider>');
  return ctx;
};

export default HotelContext;

