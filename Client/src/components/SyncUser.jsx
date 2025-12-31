import { useUser, useAuth } from "@clerk/clerk-react";
import { useEffect, useRef } from "react";

const SyncUser = () => {
    const { user, isLoaded, isSignedIn } = useUser();
    const { getToken } = useAuth();
    const hasSynced = useRef(false);

    useEffect(() => {
        const syncToDB = async () => {
            // It will prevent multiple syncs because it will check the hasSynced.current value
            if (!isLoaded || !isSignedIn || hasSynced.current) return;
            hasSynced.current = true;

            const token = await getToken();

            try {
                // FIXED: Fetching internal API to sync user
                await fetch(`${import.meta.env.VITE_BACKEND_URI}/syncUser`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        clerkId: user.id,
                        email: user.primaryEmailAddress.emailAddress,
                        name: user.fullName,
                        role: user.publicMetadata.role || "user",
                    })
                });
            } catch (e) {
                console.error("Sync failed", e);
                hasSynced.current = false;
            }
        };
        syncToDB();
    }, [isLoaded, isSignedIn, user]);
    return null;
}

export default SyncUser;