"use client";
import SideNav from "@/components/SideNav";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import NewGroup from "@/components/NewGroup";
import Link from "next/link";
import NewModerator from "@/components/NewModerator";

const PollModeratorsPage = () => {
    const params = useParams();
    const { pollId } = params;
    const [moderators, setModerators] = useState([]);
    const [newModeratorVisibile, setNewModeratorVisibile] = useState(false);
    const [pollData, setPollData] = useState({
        title: "",
        started_at: "",
        finished_at: "",
        visibility: "PUBLIC",
        result_visibility: "PUBLIC",
        min_select: 1,
        max_select: 1,
    });
    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/poll/${pollId}`,
                    { credentials: "include" }
                );
                if (response.status == 200) {
                    const data = await response.json();
                    setPollData(data);
                }
            } catch (err) {
                console.log(err);
            }
        })();
    }, []);
    useEffect(() => {
        getModerators();
    }, []);

    const removeModerator = async (moderatorId) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/poll/${pollId}/remove-moderator/${moderatorId}`,
                {
                    credentials: "include",
                }
            );
            if (response?.status == 200) {
                toast.success("Moderator removed successfully", {
                    theme: "colored",
                    hideProgressBar: true,
                });
                getModerators();
            } else {
                toast.error("Moderator remove failed", {
                    theme: "colored",
                    hideProgressBar: true,
                });
            }
        } catch (err) {
            console.log(err);
            toast.error("Server Error", {
                theme: "colored",
                hideProgressBar: true,
            });
        }
    };

    const getModerators = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/poll/${pollId}/moderators`,
                { credentials: "include" }
            );
            if (response.status == 200) {
                const data = await response.json();
                setModerators(data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleClickOutside = (e) => {
        if (e.target === e.currentTarget) setNewModeratorVisibile(false);
    };
    console.log(moderators);
    return (
        <div className="flex w-full flex-col">
            <div className="flex p-4 text-3xl font-semibold">
                {pollData?.title}
            </div>
            <div className="flex w-full gap-4">
                <div className="flex w-1/4">
                    <SideNav current="moderators" />
                </div>

                <div className="flex w-3/4 flex-col">
                    <div className="flex justify-between pr-2 w-3/4">
                        <div className="flex text-2xl font-semibold">
                            Moderators
                        </div>
                        <div className="flex">
                            <button
                                className="p-2 px-4 text-xs rounded-2xl bg-slate-300 hover:bg-slate-400 font-semibold cursor-pointer"
                                type="button"
                                onClick={(prev) =>
                                    setNewModeratorVisibile(true)
                                }
                            >
                                New Moderator
                            </button>
                        </div>
                    </div>
                    {moderators.length > 0 ? (
                        <div className="flex flex-col mt-5">
                            <table className="w-3/4">
                                <tbody>
                                    <tr className="border-b-2 border-b-slate-100">
                                        <th className="text-left p-2">
                                            Student Id
                                        </th>
                                        <th className="text-left p-2">Name</th>
                                        <th></th>
                                    </tr>
                                    {moderators.map((moderator, idx) => (
                                        <tr
                                            key={idx}
                                            className="border-b-2 border-b-slate-100"
                                        >
                                            <td className="p-2">
                                                {moderator.std_id}
                                            </td>
                                            <td className="p-2">
                                                {moderator.name}
                                            </td>
                                            <td className="p-2">
                                                {moderator.role ==
                                                "MODERATOR" ? (
                                                    <button
                                                        className="p-2 bg-red-400 hover:bg-red-500 text-xs font-semibold rounded-lg cursor-pointer"
                                                        onClick={() =>
                                                            removeModerator(
                                                                moderator.id
                                                            )
                                                        }
                                                    >
                                                        Remove
                                                    </button>
                                                ) : (
                                                    "Creator"
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div>No Moderator </div>
                    )}
                </div>
            </div>
            {newModeratorVisibile && (
                <div
                    className="flex h-screen w-screen absolute backdrop-blur p-0 items-center justify-center left-0 top-0"
                    onClick={handleClickOutside}
                >
                    <NewModerator
                        setVisibility={setNewModeratorVisibile}
                        pollId={pollId}
                        getModerators={getModerators}
                    />
                </div>
            )}
        </div>
    );
};

export default PollModeratorsPage;
