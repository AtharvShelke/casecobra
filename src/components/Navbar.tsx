import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import NavbarClient from "./NavbarClient";

const Navbar = async () => {
    const session = await getServerSession(authOptions);
    const user = session?.user;
    const isAdmin = session?.user?.role === "ADMIN"; // Ensure this variable is set in .env

    return <NavbarClient user={user} isAdmin={isAdmin} />;
};

export default Navbar;
