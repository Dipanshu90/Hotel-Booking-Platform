import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

import useLoginModel from "./useLoginModel";
import { SafeUser } from "../types";

interface IUseFavorite {
    listingId: string;
    currentUser?: SafeUser | null;
}

const useFavorite = ({
    listingId,
    currentUser
}: IUseFavorite) => {
    const router = useRouter();
    const loginModel = useLoginModel();

    const hasFavorited = useMemo(() => {
        const list = currentUser?.favouriteIds || [];

        return list.includes(listingId);
    }, [listingId, currentUser]);

    const toggleFavorite = useCallback(async (
        e: React.MouseEvent<HTMLDivElement>
    ) => {
        e.stopPropagation()

        if(!currentUser) {
            return loginModel.onOpen();
        }

        try{
            let request;

            if(hasFavorited) {
                request = () => axios.delete(`/api/favorites/${listingId}`);
            }
            else {
                request = () => axios.post(`/api/favorites/${listingId}`);
            }

            await request();
            router.refresh();
            toast.success('Success');
        }
        catch (error: any) {
            toast.error('Something went wrong.')
        }
    }, [currentUser, hasFavorited, listingId, loginModel, router]);

    return {
        hasFavorited,
        toggleFavorite
    }
}

export default useFavorite;