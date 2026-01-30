"use client";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const NewModerator = ({ setVisibility, pollId, getModerators }) => {
    const [serachQuery, setSearchQuery] = useState("");
    const [moderators, setModerators] = useState([]);
    const queryRef = useRef();

    useEffect(() => {
        queryRef.current.focus();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/poll/${pollId}/searchUser?q=${serachQuery}`,
                    {
                        credentials: "include",
                    }
                );
                if (response.status == 200) {
                    const data = await response.json();
                    setModerators(data);
                }
            } catch (err) {
                console.log(err);
                toast.error("Server Error", {
                    theme: "colored",
                    hideProgressBar: true,
                });
            }
        })();
    }, [serachQuery]);

    const addModerator = async (id) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/poll/${pollId}/add-moderator/${id}`,
                { credentials: "include" }
            );
            if (response.status == 200) {
                toast.success("Moderator added successfully", {
                    theme: "colored",
                    hideProgressBar: true,
                });

                const moderators1 = moderators.filter((m) => m.id != id);
                setModerators(moderators1);
                getModerators();
            } else {
                toast.error("Moderator addition failed", {
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

    return (
        <div className="flex w-3/4 md:w-1/2 flex-col p-10 bg-slate-100 rounded-lg">
            <div className="text-4xl font-bold text-sky-700">Add Moderator</div>
            <div className="flex flex-col mt-10 gap-5">
                <div className="flex flex-col gap-1 w-full">
                    <label className="text-xs font-bold">
                        Search Moderator
                    </label>
                    <input
                        className="p-1 border-2 border-slate-200 focus:border-sky-500 rounded-sm outline-none bg-slate-200"
                        type="text"
                        value={serachQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        ref={queryRef}
                        required
                    />
                </div>
                {moderators.length > 0 ? (
                    <div>
                        <table className="w-full">
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
                                            <button
                                                className="p-2 px-4 bg-sky-500 hover:bg-sky-600 text-xs font-semibold rounded-lg cursor-pointer"
                                                onClick={() =>
                                                    addModerator(moderator.id)
                                                }
                                            >
                                                Add
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div>No user found</div>
                )}
            </div>
        </div>
    );
};

export default NewModerator;
