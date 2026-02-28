import { useEffect, useState } from "react";

const useFilmotheque = () => {
  const [library, setLibrary] = useState([]);
  useEffect(() => {
    fetch("../filmotheque.json")
        .then((r) => r.json())
        .then(setLibrary)
        .catch(console.error);
    }, []);
    return library
}

export default useFilmotheque;