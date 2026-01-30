import Link from "next/link";
import React from "react";

const SideNav = ({ current }) => {
    return (
        <div className="flex flex-col p-2 px-4 w-full">
            <Link
                className={`p-2 rounded-lg ${
                    current == "options" ? "bg-sky-500" : "hover:bg-slate-300"
                }`}
                href={`${current != "options" ? "./options" : "#"}`}
            >
                Options
            </Link>
            <Link
                className={`p-2 rounded-lg ${
                    current == "groups" ? "bg-sky-500" : "hover:bg-slate-300"
                }`}
                href={`${current != "groups" ? "./groups" : "#"}`}
            >
                Groups
            </Link>
            <Link
                className={`p-2 rounded-lg ${
                    current == "moderators"
                        ? "bg-sky-500"
                        : "hover:bg-slate-300"
                }`}
                href={`${current != "moderators" ? "./moderators" : "#"}`}
            >
                Moderators
            </Link>
            <Link
                className={`p-2 rounded-lg ${
                    current == "result" ? "bg-sky-500" : "hover:bg-slate-300"
                }`}
                href={`${current != "result" ? "./result" : "#"}`}
            >
                Result
            </Link>
            <Link
                className={`p-2 rounded-lg ${
                    current == "voters" ? "bg-sky-500" : "hover:bg-slate-300"
                }`}
                href={`${current != "voters" ? "./voters" : "#"}`}
            >
                Voters
            </Link>
            <Link
                className={`p-2 rounded-lg ${
                    current == "settings" ? "bg-sky-500" : "hover:bg-slate-300"
                }`}
                href={`${current != "settings" ? "./settings" : "#"}`}
            >
                Settings
            </Link>
        </div>
    );
};

export default SideNav;
