"use client";

import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface NavbarClientProps {
    user?: {
        email?: string | null;
    };
    isAdmin: boolean;
}

const NavbarClient: React.FC<NavbarClientProps> = ({ user, isAdmin }) => {
    const router = useRouter();
    useEffect(() => {
        router.refresh();
    }, [user]);
    return (
        <nav className="sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
            <div className="flex h-14 items-center justify-between border-b border-zinc-200 max-w-7xl mx-auto px-4">
                <Link href="/" className="flex z-40 font-semibold">
                    case<span className="text-green-600">cobra</span>
                </Link>
                <div className="h-full flex items-center space-x-4">
                    {user ? (
                        <>
                            <button
                                onClick={() => {
                                    signOut();
                                    router.push('/')
                                }}
                                className={buttonVariants({ size: "sm", variant: "ghost" })}
                            >
                                Sign Out
                            </button>
                            {isAdmin ? (
                                <Link
                                    href="/dashboard"
                                    className={buttonVariants({ size: "sm", variant: "ghost" })}
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href="/my-orders"
                                    className={buttonVariants({ size: "sm", variant: "ghost" })}
                                >
                                    My Orders
                                </Link>
                            )}
                            <Link
                                href="/configure/upload"
                                className={buttonVariants({
                                    size: "sm",
                                    className: "hidden sm:flex items-center gap-1",
                                })}
                            >
                                Create Case
                                <ArrowRight className="ml-1.5 h-5 w-5" />
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/auth"
                                className={buttonVariants({ size: "sm", variant: "ghost" })}
                            >
                                Register
                            </Link>
                            <Link
                                href="/auth"
                                className={buttonVariants({ size: "sm", variant: "ghost" })}
                            >
                                Login
                            </Link>
                            <div className="h-8 w-px bg-zinc-200 hidden sm:block" />
                            <Link
                                href="/configure/upload"
                                className={buttonVariants({
                                    size: "sm",
                                    className: "hidden sm:flex items-center gap-1",
                                })}
                            >
                                Create Case
                                <ArrowRight className="ml-1.5 h-5 w-5" />
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavbarClient;
