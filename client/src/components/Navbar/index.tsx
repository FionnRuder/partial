import React from "react";
import { Menu, Moon, Search, Settings, Sun, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state";
import { useAuth } from "@/contexts/AuthContext";


const Navbar = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { signOut, user } = useAuth();
    const isSidebarCollapsed = useAppSelector(
        (state) => state.global.isSidebarCollapsed,
    );
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    // Get user initials from username or name
    const getUserInitials = () => {
        if (user?.name) {
            const names = user.name.split(' ');
            if (names.length >= 2) {
                return (names[0][0] + names[names.length - 1][0]).toUpperCase();
            }
            return user.name.substring(0, 2).toUpperCase();
        }
        if (user?.username) {
            return user.username.substring(0, 2).toUpperCase();
        }
        return '?';
    };

    const sanitizeProfilePictureUrl = (value?: string | null) => {
        if (!value) return "";
        const trimmed = value.trim();
        if (!trimmed) return "";
        const lower = trimmed.toLowerCase();
        if (lower.startsWith("http://") || lower.startsWith("https://")) {
            return "";
        }
        return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    };

    const safeProfilePictureUrl = sanitizeProfilePictureUrl(user?.profilePictureUrl);

    const handleLogout = async () => {
        try {
            await signOut();
            router.push("/onboarding");
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div className="flex items-center justify-between bg-white px-4 py-3 dark:bg-black">
            {/* Search Bar */}
            <div className="flex items-center gap-8">
                {!isSidebarCollapsed ? null : (
                <button
                    onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
                >
                    <Menu className="h-8 w-8 dark:text-white" />
                </button>
                )}
                <div className="relative flex h-min w-[200px]">
                    <Search className="absolute left-[4px] top-1/2 mr-2 h-5 w-5 -translate-y-1/2 transform cursor-pointer dark:text-white" />
                    <input
                        className="w-full rounded border-none bg-gray-100 p-2 pl-8 placeholder-gray-500 focus:border-transparent focus:outline-none dark:bg-gray-700 dark:text-white dark:placeholder-white"
                        type="search"
                        placeholder="Search..."
                    />
                </div>
            </div>

            {/* Icons */}
            <div className="flex items-center">
                <button
                    onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
                    className={
                        isDarkMode
                            ? `rounded p-2 dark:hover:bg-gray-700`
                            : `rounded p-2 hover:bg-gray-100`
                    }
                    title={isDarkMode ? "Toggle Light Mode" : "Toggle Dark Mode"}
                >
                    {isDarkMode ? (
                        <Sun className="h-6 w-6 cursor-pointer dark:text-white" />
                    ) : (
                        <Moon className="h-6 w-6 cursor-pointer dark:text-white" />
                    )}
                </button>
                <Link
                    href="/settings"
                    className={
                        isDarkMode
                            ? `h-min w-min rounded p-2 dark:hover:bg-gray-700`
                            : `h-min w-min rounded p-2 hover:bg-gray-100`
                    }
                    title="Settings"
                >
                    <Settings className="h-6 w-6 cursor-pointer dark:text-white" />
                </Link>
                
                <div className="ml-2 mr-4 hidden min-h-[2em] w-[0.1rem] bg-gray-200 md:inline-block"></div>
                
                {/* User Profile Picture/Initials */}
                {user?.userId && (
                    <Link
                        href={`/users/${user.userId}`}
                        className={
                            isDarkMode
                                ? `h-min w-min rounded-full dark:hover:bg-gray-700`
                                : `h-min w-min rounded-full hover:bg-gray-100`
                        }
                        title="View Profile"
                    >
                        {safeProfilePictureUrl ? (
                            <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                                <Image
                                    src={`https://partial-s3-images.s3.us-east-1.amazonaws.com/${safeProfilePictureUrl}`}
                                    alt={user.name || user.username}
                                    width={32}
                                    height={32}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-sm font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                {getUserInitials()}
                            </div>
                        )}
                    </Link>
                )}
                
                <button
                    onClick={handleLogout}
                    className={
                        isDarkMode
                            ? `ml-2 h-min w-min rounded p-2 dark:hover:bg-gray-700`
                            : `ml-2 h-min w-min rounded p-2 hover:bg-gray-100`
                    }
                    title="Logout"
                >
                    <LogOut className="h-6 w-6 cursor-pointer dark:text-white" />
                </button>
            </div>
        </div>
    );
};

export default Navbar;