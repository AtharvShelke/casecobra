'use client';

import { useSession } from "next-auth/react";
import NavbarClient from "./NavbarClient";

const Navbar = () => {
    const { data: session, status } = useSession();
    const user = session?.user;
    const isAdmin = session?.user?.role === "ADMIN";

    // Show loading state while session is being fetched
    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return <NavbarClient user={user} isAdmin={isAdmin} />;
};

export default Navbar;
