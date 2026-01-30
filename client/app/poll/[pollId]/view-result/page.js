"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const PollResultPage = () => {
    const params = useParams();
    const router = useRouter();
    const { pollId } = params;
    const [result, setResult] = useState([]);
    const [poll, setPoll] = useState(null);

    useEffect(() => {
        try {
            (async () => {
                let response = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/common/poll/${pollId}`,
                    { credentials: "include" }
                );

                if (response.status == 200) {
                    let data = await response.json();
                    setPoll(data);

                    response = await fetch(
                        `${process.env.NEXT_PUBLIC_SERVER_URL}/common/poll/${pollId}/result`,
                        { credentials: "include" }
                    );

                    if (response.status == 200) {
                        const data = await response.json();
                        setResult(data);
                    } else {
                        toast.error("Result is not published", {
                            theme: "colored",
                            hideProgressBar: true,
                        });
                        router.replace("/polls");
                    }
                }
            })();
        } catch (err) {
            console.log(err);
        }
    }, []);

    return (
        <div className="flex w-full justify-center">
            <div className="flex flex-col w-1/2 mt-5 gap-3">
                <div className="text-3xl font-semibold">{poll?.title}</div>
                <div className="flex flex-col gap-2">
                    {result.map((r, idx) => (
                        <div
                            key={idx}
                            className="w-full p-3 rounded-lg cursor-pointer bg-slate-100 flex justify-between items-center gap-3"
                        >
                            <div className="">{r.text}</div>
                            <div className="text-xl font-semibold">
                                {r.score}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PollResultPage;
