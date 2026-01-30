"use client";
import SideNav from "@/components/SideNav";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";

const PollVotersPage = () => {
    const params = useParams();
    const { pollId } = params;
    const [voters, setVoters] = useState([]);
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
        getVoters();
    }, []);

    const convertDate = (d) => {
        const date = new Date(d);
        const convertedDate = format(date, "dd-MMM-yyyy HH:mm");
        return convertedDate;
    };

    const getVoters = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/poll/${pollId}/voters`,
                { credentials: "include" }
            );
            if (response.status == 200) {
                const data = await response.json();
                setVoters(data);
            }
        } catch (err) {
            console.log(err);
        }
    };
    console.log(voters);
    return (
        <div className="flex w-full flex-col">
            <div className="flex p-4 text-3xl font-semibold">
                {pollData?.title}
            </div>
            <div className="flex w-full gap-4">
                <div className="flex w-1/4">
                    <SideNav current="voters" />
                </div>

                <div className="flex w-3/4 flex-col">
                    <div className="flex justify-between pr-2 w-3/4">
                        <div className="flex text-2xl font-semibold">
                            Voters
                        </div>
                    </div>
                    {voters.length > 0 ? (
                        <div className="flex flex-col mt-5">
                            <table className="w-3/4">
                                <tbody>
                                    <tr className="border-b-2 border-b-slate-100">
                                        <th className="text-left p-2">
                                            Student Id
                                        </th>
                                        <th className="text-left p-2">Name</th>
                                        <th className="text-left p-2">
                                            Voted At
                                        </th>
                                    </tr>
                                    {voters.map((voter, idx) => (
                                        <tr
                                            key={idx}
                                            className="border-b-2 border-b-slate-100"
                                        >
                                            <td className="p-2">
                                                {voter.std_id}
                                            </td>
                                            <td className="p-2">
                                                {voter.name}
                                            </td>
                                            <td className="p-2">
                                                {convertDate(voter.voted_at)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div>No Voter </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PollVotersPage;
