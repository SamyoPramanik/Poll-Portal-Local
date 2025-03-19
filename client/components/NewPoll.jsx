"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";

const NewPoll = ({ setVisibility }) => {
    const [formData, setFormData] = useState({
        title: "",
        started_at: "",
        finished_at: "",
        visibility: "PUBLIC",
        result_visibility: "PUBLIC",
        min_select: 1,
        max_select: 1,
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(false);
            const response = await fetch(
                "http://localhost:5004/common/poll/create",
                {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            );
            if (response?.status == 200) {
                toast.success("Poll created successfully", {
                    theme: "colored",
                    hideProgressBar: true,
                });
                setVisibility(false);
            } else {
                toast.error("Poll creation failed", {
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
    return (
        <div className="flex w-3/4 md:w-1/4 flex-col p-10 bg-slate-100 rounded-lg">
            <div className="text-4xl font-bold text-sky-700">Create Poll</div>
            <form onSubmit={handleSubmit} className="flex flex-col mt-10 gap-5">
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold">Poll Title</label>
                    <input
                        className="p-1 border-2 border-slate-200 focus:border-sky-500 rounded-sm outline-none bg-slate-200"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="flex gap-2">
                    <div className="flex flex-col gap-1 w-full">
                        <label className="text-xs font-bold">Start Time</label>
                        <input
                            className="p-1 border-2 border-slate-200 focus:border-sky-500 rounded-sm outline-none bg-slate-200"
                            type="datetime-local"
                            name="started_at"
                            value={formData.started_at}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                        <label className="text-xs font-bold">End Time</label>
                        <input
                            className="p-1 border-2 border-slate-200 focus:border-sky-500 rounded-sm outline-none bg-slate-200"
                            type="datetime-local"
                            name="finished_at"
                            value={formData.finished_at}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="flex flex-col gap-1 w-full">
                        <label className="text-xs font-bold">Visibility</label>
                        <select
                            className="p-1 border-2 border-slate-200 focus:border-sky-500 rounded-sm outline-none bg-slate-200"
                            name="visibility"
                            value={formData.visibility}
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
                            value={formData.result_visibility}
                            onChange={handleChange}
                            required
                        >
                            <option value="PUBLIC">Public</option>
                            <option value="PRIVATE">Private</option>
                        </select>
                    </div>
                </div>

                <div className="flex w-full gap-2">
                    <button
                        className="bg-slate-400 p-2 hover:bg-slate-700 cursor-pointer rounded-sm text-white w-full"
                        type="button"
                        onClick={() => setVisibility(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-sky-600 p-2 hover:bg-sky-700 cursor-pointer rounded-sm text-white w-full"
                        type="submit"
                        disabled={loading}
                    >
                        Create Poll
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewPoll;
