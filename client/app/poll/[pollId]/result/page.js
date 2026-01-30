"use client";
import SideNav from "@/components/SideNav";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Link from "next/link";
import NewOption from "@/components/NewOption";

const PollResultPage = () => {
    const params = useParams();
    const { pollId } = params;
    const [result, setResult] = useState([]);
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
        getResult();
    }, []);

    const getResult = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/poll/${pollId}/result`,
                { credentials: "include" }
            );
            if (response.status == 200) {
                const data = await response.json();
                setResult(data);
            }
        } catch (err) {
            console.log(err);
        }
    };
    console.log(result);
    return (
        <div className="flex w-full flex-col">
            <div className="flex p-4 text-3xl font-semibold">
                {pollData?.title}
            </div>
            <div className="flex w-full gap-4">
                <div className="flex w-1/4">
                    <SideNav current="result" />
                </div>

                <div className="flex w-3/4 flex-col">
                    <div className="flex justify-between pr-2 w-2/3">
                        <div className="flex text-2xl font-semibold">
                            Result
                        </div>
                    </div>
                    {result.length > 0 ? (
                        <div className="flex flex-col mt-5">
                            <table className="w-2/3">
                                <tbody>
                                    <tr className="border-b-2 border-b-slate-100">
                                        <th className="text-left p-2">
                                            Option
                                        </th>
                                        <th className="text-center p-2">
                                            Score
                                        </th>
                                    </tr>
                                    {result.map((r, idx) => (
                                        <tr
                                            key={idx}
                                            className="border-b-2 border-b-slate-100"
                                        >
                                            <td className="p-2">{r.text}</td>
                                            <td className="p-2 text-center">
                                                {r.score}
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
        </div>
    );
};

export default PollResultPage;
