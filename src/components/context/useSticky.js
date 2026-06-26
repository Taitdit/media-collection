import { useContext } from "react";
import { StickyContext } from "./StickyContext";

export const useSticky = () => useContext(StickyContext);