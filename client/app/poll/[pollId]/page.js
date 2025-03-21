"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Pollpage = () => {
    const params = useParams();
    const { pollId } = params;
    const [poll, setPoll] = useState(null);
    const [options, setOptions] = useState([]);
    const [selectedId, setSelectedId] = useState(0);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    useEffect(() => {
        try {
            (async () => {
                const response = await fetch(
                    `http://localhost:5004/common/poll/${pollId}`,
                    { credentials: "include" }
                );

                if (response.status == 200) {
                    const data = await response.json();
                    setPoll(data);
                    setOptions(data.options);
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
                `http://localhost:5004/poll/${pollId}/vote`,
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
                <div className="flex flex-col gap-2">
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
