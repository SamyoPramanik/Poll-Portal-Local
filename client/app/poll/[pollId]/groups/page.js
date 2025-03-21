"use client";
import SideNav from "@/components/SideNav";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import NewGroup from "@/components/NewGroup";
import Link from "next/link";

const PollGroupsPage = () => {
    const params = useParams();
    const { pollId } = params;
    const [groups, setGroups] = useState([]);
    const [newGroupVisible, setNewGroupVisible] = useState(false);
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
                    `http://localhost:5004/poll/${pollId}`,
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
        getGroups();
    }, []);

    const removeGroup = async (groupId) => {
        try {
            const response = await fetch(
                `http://localhost:5004/poll/${pollId}/remove-group/${groupId}`,
                {
                    credentials: "include",
                }
            );
            if (response?.status == 200) {
                toast.success("Group removed successfully", {
                    theme: "colored",
                    hideProgressBar: true,
                });
                getGroups();
            } else if (response.status == 400) {
                toast.error(await response.json(), {
                    theme: "colored",
                    hideProgressBar: true,
                });
            } else {
                toast.error("Group remove failed", {
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

    const getGroups = async () => {
        try {
            const response = await fetch(
                `http://localhost:5004/poll/${pollId}/groups`,
                { credentials: "include" }
            );
            if (response.status == 200) {
                const data = await response.json();
                setGroups(data);
            }
        } catch (err) {
            console.log(err);
        }
    };
    console.log(groups);
    return (
        <div className="flex w-full flex-col">
            <div className="flex p-4 text-3xl font-semibold">
                {pollData?.title}
            </div>
            <div className="flex w-full gap-4">
                <div className="flex w-1/4">
                    <SideNav current="groups" />
                </div>

                <div className="flex w-3/4 flex-col">
                    <div className="flex justify-between pr-2 w-2/3">
                        <div className="flex text-2xl font-semibold">
                            Groups
                        </div>
                        <div className="flex">
                            <button
                                className="p-2 px-4 text-xs rounded-2xl bg-slate-300 hover:bg-slate-400 font-semibold cursor-pointer"
                                type="button"
                                onClick={(prev) => setNewGroupVisible(true)}
                            >
                                New Group
                            </button>
                        </div>
                    </div>
                    {groups.length > 0 ? (
                        <div className="flex flex-col mt-5">
                            <table className="w-2/3">
                                <tbody>
                                    <tr className="border-b-2 border-b-slate-100">
                                        <th className="text-left p-2">
                                            Student Id
                                        </th>
                                        <th className="text-center p-2">
                                            Points
                                        </th>
                                        <th></th>
                                    </tr>
                                    {groups.map((group, idx) => (
                                        <tr
                                            key={idx}
                                            className="border-b-2 border-b-slate-100"
                                        >
                                            <td className="p-2">
                                                {group.min_stdid} -{" "}
                                                {group.max_stdid}
                                            </td>
                                            <td className="p-2 text-center">
                                                {group.point}
                                            </td>
                                            <td className="p-2">
                                                <button
                                                    className="p-2 bg-red-400 hover:bg-red-500 text-xs font-semibold rounded-lg cursor-pointer"
                                                    onClick={() =>
                                                        removeGroup(group.id)
                                                    }
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div>No Groups </div>
                    )}
                </div>
            </div>
            {newGroupVisible && (
                <div className="flex h-screen w-screen absolute backdrop-blur p-0 items-center justify-center left-0 top-0">
                    <NewGroup
                        setVisibility={setNewGroupVisible}
                        pollId={pollId}
                        getGroups={getGroups}
                    />
                </div>
            )}
        </div>
    );
};

export default PollGroupsPage;
