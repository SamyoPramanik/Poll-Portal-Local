"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Pollpage = () => {
    const params = useParams();
    const { pollId } = params;
    const [poll, setPoll] = useState(null);
    const [options, setOptions] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedId, setSelectedId] = useState(0);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    useEffect(() => {
        try {
            (async () => {
                let response = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/common/poll/${pollId}`,
                    { credentials: "include" }
                );

                if (response.status == 200) {
                    const data = await response.json();

                    const now = new Date();
                    const started_at = new Date(data.started_at);
                    if (now < started_at) {
                        toast.info("Poll is not started", {
                            theme: "colored",
                            hideProgressBar: true,
                        });
                        router.replace(`/polls`);
                        return;
                    } else {
                        response = await fetch(
                            `${process.env.NEXT_PUBLIC_SERVER_URL}/poll/${pollId}/resultAvailable`,
                            { credentials: "include" }
                        );

                        if (response.status == 200) {
                            router.replace(`${pollId}/view-result`);
                            return;
                        }
                    }

                    setPoll(data);
                    setOptions(data.options);
                    setGroups(data.groups);
                } else {
                    toast.error("You can't vote this poll", {
                        theme: "colored",
                        hideProgressBar: true,
                    });
                    router.replace(`/polls`);
                }
            })();
        } catch (err) {
            console.log(err);
        }
    }, []);

    const handleClick = async () => {
        try {
            const formData = { option_id: selectedId };
            setLoading(true);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/poll/${pollId}/vote`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            );
            if (response?.status == 200) {
                toast.success("Your vote recorded successfully", {
                    theme: "colored",
                    hideProgressBar: true,
                });
                router.replace(`./${pollId}/view-result`);
            } else if (response.status == 401) {
                toast.error("You can't vote this poll", {
                    theme: "colored",
                    hideProgressBar: true,
                });
                setLoading(false);
                router.replace(`./${pollId}/view-result`);
            } else {
                toast.error("Vote failed", {
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

    const getStyle = (id, selectedId) => {
        if (id == selectedId) {
            return "bg-orange-300";
        }
        return "bg-slate-100 hover:bg-slate-200";
    };
    return (
        <div className="flex w-full justify-center">
            <div className="flex flex-col w-1/2 mt-5 gap-3">
                <div className="text-3xl font-semibold">{poll?.title}</div>
                <div className="flex w-full flex-col">
                    {groups.length > 0 ? (
                        <div className="flex flex-col mt-5">
                            <table className="w-full">
                                <tbody>
                                    <tr className="border-b-2 border-b-slate-100">
                                        <th className="text-left p-2">
                                            Student Id
                                        </th>
                                        <th className="text-center p-2">
                                            Points
                                        </th>
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
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div>No Groups </div>
                    )}
                </div>
                <div className="flex flex-col gap-2 mt-5">
                    {options.map((option, idx) => (
                        <div
                            key={idx}
                            className={`w-full p-3 rounded-lg cursor-pointer ${getStyle(
                                option.id,
                                selectedId
                            )}`}
                            onClick={() => {
                                setSelectedId(option.id);
                            }}
                        >
                            {option.text}
                        </div>
                    ))}
                </div>
                <div className="flex justify-center">
                    <button
                        className="bg-sky-600 p-2 hover:bg-sky-700 cursor-pointer rounded-lg text-white w-[120px]"
                        type="submit"
                        disabled={loading}
                        onClick={handleClick}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Pollpage;
