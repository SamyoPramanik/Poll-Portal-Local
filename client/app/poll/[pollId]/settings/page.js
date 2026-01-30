"use client";
import SideNav from "@/components/SideNav";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";

const PollSettingsPage = () => {
    const router = useRouter();
    const params = useParams();
    const { pollId } = params;
    const [pollData, setPollData] = useState({
        title: "",
        started_at: "",
        finished_at: "",
        visibility: "PUBLIC",
        result_visibility: "PUBLIC",
        min_select: 1,
        max_select: 1,
    });
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        (async () => {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/poll/${pollId}`,
                { credentials: "include" }
            );
            const data = await response.json();
            setPollData({
                ...data,
                started_at: convertDate(data.started_at),
                finished_at: convertDate(data.finished_at),
            });
        })();
    }, []);
    console.log(pollData);

    const convertDate = (date) => {
        const inputDate = new Date(date);
        const formattedDate = format(inputDate, "yyyy-MM-dd'T'HH:mm");
        return formattedDate;
    };

    const deletePoll = async () => {
        const sureToDelete = confirm("Do you want to delete this poll?");

        if (sureToDelete == true) {
            try {
                setLoading(true);
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/poll/${pollId}/delete`,
                    {
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                    }
                );
                if (response.status == 200) {
                    toast.success("Poll deleted successfully", {
                        theme: "colored",
                        hideProgressBar: true,
                    });
                    router.replace("/polls");
                } else if (response.status == 400) {
                    toast.error(await response.json(), {
                        theme: "colored",
                        hideProgressBar: true,
                    });
                } else {
                    toast.error("Poll delete failed", {
                        theme: "colored",
                        hideProgressBar: true,
                    });
                    setLoading(false);
                }
            } catch (err) {
                console.log(err);
                toast.error("Server Error", {
                    theme: "colored",
                    hideProgressBar: true,
                });
                setLoading(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/poll/${pollId}/update`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(pollData),
                }
            );
            if (response.status == 200) {
                toast.success("Poll updated successfully", {
                    theme: "colored",
                    hideProgressBar: true,
                });
                setLoading(false);
            } else if (response.status == 400) {
                toast.error(await response.json(), {
                    theme: "colored",
                    hideProgressBar: true,
                });
            } else {
                toast.error("Poll update failed", {
                    theme: "colored",
                    hideProgressBar: true,
                });
                setLoading(false);
            }
        } catch (err) {
            console.log(err);
            toast.error("Server Error", {
                theme: "colored",
                hideProgressBar: true,
            });
            setLoading(false);
        }
    };
    const handleChange = (e) => {
        setPollData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    return (
        <div className="flex w-full flex-col">
            <div className="flex p-4 text-3xl font-semibold">
                {pollData?.title}
            </div>
            <div className="flex w-full gap-4">
                <div className="flex w-1/4">
                    <SideNav current="settings" />
                </div>

                <div className="flex flex-col gap-4">
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-5"
                    >
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold">
                                Poll Title
                            </label>
                            <input
                                className="p-1 border-2 border-slate-200 focus:border-sky-500 rounded-sm outline-none bg-slate-200"
                                type="text"
                                name="title"
                                value={pollData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="flex gap-2">
                            <div className="flex flex-col gap-1 w-full">
                                <label className="text-xs font-bold">
                                    Start Time
                                </label>
                                <input
                                    className="p-1 border-2 border-slate-200 focus:border-sky-500 rounded-sm outline-none bg-slate-200"
                                    type="datetime-local"
                                    name="started_at"
                                    value={pollData.started_at}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-full">
                                <label className="text-xs font-bold">
                                    End Time
                                </label>
                                <input
                                    className="p-1 border-2 border-slate-200 focus:border-sky-500 rounded-sm outline-none bg-slate-200"
                                    type="datetime-local"
                                    name="finished_at"
                                    value={pollData.finished_at}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex flex-col gap-1 w-full">
                                <label className="text-xs font-bold">
                                    Visibility
                                </label>
                                <select
                                    className="p-1 border-2 border-slate-200 focus:border-sky-500 rounded-sm outline-none bg-slate-200"
                                    name="visibility"
                                    value={pollData.visibility}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="PUBLIC">Public</option>
                                    <option value="PRIVATE">Private</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1 w-full">
                                <label className="text-xs font-bold">
                                    {" "}
                                    Result Visibility
                                </label>
                                <select
                                    className="p-1 border-2 border-slate-200 focus:border-sky-500 rounded-sm outline-none bg-slate-200"
                                    name="result_visibility"
                                    value={pollData.result_visibility}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="PUBLIC">Public</option>
                                    <option value="PRIVATE">Private</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col w-full gap-2">
                            <button
                                className="bg-sky-600 p-2 hover:bg-sky-700 cursor-pointer rounded-sm text-white w-full"
                                type="submit"
                                disabled={loading}
                            >
                                Save Change
                            </button>
                        </div>
                    </form>
                    <button
                        className="bg-red-500 p-2 hover:bg-red-700 cursor-pointer rounded-sm text-white w-full"
                        type="button"
                        disabled={loading}
                        onClick={deletePoll}
                    >
                        Delete Poll
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PollSettingsPage;
