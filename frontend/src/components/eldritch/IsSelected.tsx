import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function IsSelected({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const [childrenForward, setChildrenForward] = useState<React.ReactNode>(null);

    const stored = localStorage.getItem('playerData');

    useEffect(() => {
        if (!stored) {
            navigate('/', { replace: true });
        } else {
            setChildrenForward(children);
        }
    }, [navigate]);

    return <>{childrenForward}</>;
}
