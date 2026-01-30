"use client";
import SideNav from "@/components/SideNav";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Link from "next/link";
import NewOption from "@/components/NewOption";

const PollOptionsPage = () => {
    const params = useParams();
    const { pollId } = params;
    const [options, setOptions] = useState([]);
    const [newOptionVisible, setNewOptionVisible] = useState(false);
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
        getOptions();
    }, []);

    const removeOption = async (optionId) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/poll/${pollId}/remove-option/${optionId}`,
                { credentials: "include" }
            );
            if (response?.status == 200) {
                toast.success("Option removed successfully", {
                    theme: "colored",
                    hideProgressBar: true,
                });
                getOptions();
            } else if (response.status == 400) {
                toast.error(await response.json(), {
                    theme: "colored",
                    hideProgressBar: true,
                });
            } else {
                toast.error("Option remove failed", {
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

    const getOptions = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/poll/${pollId}/options`,
                { credentials: "include" }
            );
            if (response.status == 200) {
                const data = await response.json();
                setOptions(data);
            }
        } catch (err) {
            console.log(err);
        }
    };
    console.log(options);
    return (
        <div className="flex w-full flex-col">
            <div className="flex p-4 text-3xl font-semibold">
                {pollData?.title}
            </div>
            <div className="flex w-full gap-4">
                <div className="flex w-1/4">
                    <SideNav current="options" />
                </div>

                <div className="flex w-3/4 flex-col">
                    <div className="flex justify-between pr-2 w-2/3">
                        <div className="flex text-2xl font-semibold">
                            Options
                        </div>
                        <div className="flex">
                            <button
                                className="p-2 px-4 text-xs rounded-2xl bg-slate-300 hover:bg-slate-400 font-semibold cursor-pointer"
                                type="button"
                                onClick={(prev) => setNewOptionVisible(true)}
                            >
                                New Option
                            </button>
                        </div>
                    </div>
                    {options.length > 0 ? (
                        <div className="flex flex-col mt-5">
                            <table className="w-2/3">
                                <tbody>
                                    {options.map((option, idx) => (
                                        <tr
                                            key={idx}
                                            className="border-b-2 border-b-slate-100"
                                        >
                                            <td className="p-2">
                                                {option.text}
                                            </td>
                                            <td className="p-2 flex justify-end items-center">
                                                <button
                                                    className="p-2 bg-red-400 hover:bg-red-500 text-xs font-semibold rounded-lg cursor-pointer"
                                                    onClick={() =>
                                                        removeOption(option.id)
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
                        <div>No Options </div>
                    )}
                </div>
            </div>
            {newOptionVisible && (
                <div className="flex h-screen w-screen absolute backdrop-blur p-0 items-center justify-center left-0 top-0">
                    <NewOption
                        setVisibility={setNewOptionVisible}
                        pollId={pollId}
                        getOptions={getOptions}
                    />
                </div>
            )}
        </div>
    );
};

export default PollOptionsPage;
