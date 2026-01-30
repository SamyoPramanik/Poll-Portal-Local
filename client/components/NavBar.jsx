"use client";
import useUserStore from "@/store/userStore";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import NewPoll from "./NewPoll";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const NavBar = () => {
    const router = useRouter();
    const { userInfo, setUserInfo, signedIn, setSignedIn } = useUserStore();

    const [profileCardVisible, setProfileCardVisible] = useState(false);
    const [newPollVisible, setNewPollVisible] = useState(false);
    console.log(signedIn);
    useEffect(() => {
        if (!signedIn) {
            (async () => {
                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/profile`,
                        {
                            credentials: "include",
                            cache: "no-store",
                        }
                    );
                    if (response.status == 200) {
                        const data = await response.json();
                        setSignedIn(true);

                        setUserInfo({
                            id: data.id,
                            name: data.name,
                            email: data.email,
                            std_id: data.std_id,
                            verified: data.verified,
                        });
                    }
                } catch (err) {
                    console.log(err);
                }
            })();
        }
    }, []);
    const signOut = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/sign-out`, {
            credentials: "include",
        });
        setSignedIn(false);
        toast.info("Signed Out.", {
            theme: "colored",
            hideProgressBar: true,
        });
        router.replace("/");
    };
    return (
        <div className="flex sticky p-4">
            <div className="flex flex-1 text-4xl font-bold">
                <Link href="/" className="cursor-pointer">
                    Poll Portal
                </Link>
            </div>
            {signedIn && (
                <div className="flex gap-4 items-center">
                    <div>
                        <button
                            className="bg-sky-600 p-2 px-6 text-slate-100 rounded-md text-lg cursor-pointer"
                            onClick={() => setNewPollVisible(true)}
                        >
                            Create New Poll
                        </button>
                    </div>
                    <div className="relative">
                        <button
                            className="text-2xl rounded-full px-4 py-2 bg-sky-500 cursor-pointer"
                            onClick={() =>
                                setProfileCardVisible((prev) => !prev)
                            }
                        >
                            {userInfo.name[0]}
                        </button>
                        {profileCardVisible && (
                            <div className="flex absolute flex-col right-0 w-[120px] bg-slate-100 p-1 rounded-sm">
                                <Link
                                    className="p-2 hover:bg-slate-200 rounded-sm"
                                    href="/profile"
                                >
                                    Profile
                                </Link>
                                <Link
                                    className="p-2 hover:bg-slate-200 rounded-sm"
                                    href="#"
                                    onClick={signOut}
                                >
                                    Sign Out
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {newPollVisible && (
                <div className="flex h-screen w-screen absolute backdrop-blur -m-4 p-0 items-center justify-center ">
                    <NewPoll setVisibility={setNewPollVisible} />
                </div>
            )}
        </div>
    );
};

export default NavBar;
