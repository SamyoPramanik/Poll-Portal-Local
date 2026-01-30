"use client";
import PollCard from "@/components/PollCard";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Pollspage = () => {
    const [polls, setPolls] = useState([]);

    useEffect(() => {
        try {
            (async () => {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/common/polls`,
                    {
                        credentials: "include",
                    }
                );
                if (response.status == 200) {
                    const data = await response.json();
                    setPolls(data);
                }
            })();
            console.log(polls);
        } catch (err) {
            console.log(err);
        }
    }, []);
    return (
        <div className="flex w-full mt-4 justify-center">
            <div className="flex flex-col w-3/4 md:w-1/2">
                {polls.map((poll, idx) => (
                    <Link key={idx} href={`./poll/${poll.id}`}>
                        {" "}
                        <PollCard
                            key={idx}
                            id={poll.id}
                            title={poll.title}
                            started_at={poll.started_at}
                            finished_at={poll.finished_at}
                            participants={poll.participants}
                            moderator={poll.moderator}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Pollspage;
