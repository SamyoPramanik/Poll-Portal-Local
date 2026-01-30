import React from "react";
import { format } from "date-fns";
import Link from "next/link";

const PollCard = ({
    id,
    title,
    started_at,
    finished_at,
    participants,
    moderator,
}) => {
    return (
        <div className="flex flex-col gap-2 p-1 border-b-2 border-b-slate-100 hover:bg-slate-100">
            <div className="flex items-center justify-between">
                <div className="text-2xl font-semibold">{title}</div>
                {moderator == "YES" && (
                    <Link
                        className="text-sm text-sky-700hover:underline"
                        href={`./poll/${id}/settings`}
                    >
                        Edit
                    </Link>
                )}
            </div>
            <div className="flex gap-2 justify-between">
                <div className="flex">
                    {isStarted(started_at) ? (
                        <div className="text-sm">
                            <span>Started At: </span>
                            <span className="font-semibold">
                                {" "}
                                {formatDate(started_at)}
                            </span>
                        </div>
                    ) : (
                        <div>
                            <span>Starts At: </span>
                            <span className="font-semibold">
                                {" "}
                                {formatDate(started_at)}
                            </span>
                        </div>
                    )}
                </div>
                <div className="text-sm">
                    <span>Participants: </span>
                    <span className="font-semibold"> {participants}</span>
                </div>
                <div className="text-sm">
                    {isFinished(finished_at) ? (
                        <div className="text-sm">
                            <span>Finished At: </span>
                            <span className="font-semibold">
                                {" "}
                                {formatDate(finished_at)}
                            </span>
                        </div>
                    ) : (
                        <div>
                            <span>Ends At: </span>
                            <span className="font-semibold">
                                {" "}
                                {formatDate(finished_at)}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PollCard;

const isStarted = (date) => {
    const today = new Date();
    const givenDate = new Date(date);
    if (givenDate < today) return true;
    return false;
};

const isFinished = (date) => {
    const today = new Date();
    const givenDate = new Date(date);
    if (givenDate < today) return true;
    return false;
};

const formatDate = (date) => {
    const givenDate = new Date(date);
    const formattedDate = format(date, "dd-MMM-yyyy HH:mm");
    return formattedDate;
};
