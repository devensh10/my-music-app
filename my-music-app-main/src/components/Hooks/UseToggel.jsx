import { useState } from "react";

const useToggle = (initialState = false) => {
    const [isToggled, setIsToggled] = useState(initialState);

    return {
        isToggled,
        toggle() {
            setIsToggled(!isToggled);
        },
    };
};

export default useToggle;
