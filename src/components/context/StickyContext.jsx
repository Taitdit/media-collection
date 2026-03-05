// StickyContext.jsx
import { createContext, useContext, useMemo } from "react";
import { useInView } from "react-intersection-observer";

const StickyContext = createContext({ fixed: false });

export const useSticky = () => useContext(StickyContext);

export const StickyProvider = ({ children }) => {
  const { ref, inView } = useInView({
    threshold: 0
  });

  const fixed = !inView;

  const value = useMemo(() => ({ fixed }), [fixed]);

  return (
    <StickyContext.Provider value={value}>
      <span ref={ref}
              aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1,
          height: 1,
          pointerEvents: "none",
        }}
      ></span>
      {children}
    </StickyContext.Provider>
  );
};