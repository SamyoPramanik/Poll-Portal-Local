"use client";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const NewOption = ({ setVisibility, pollId, getOptions }) => {
    const optionTextRef = useRef();
    const [formData, setFormData] = useState({
        text: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        optionTextRef.current.focus();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(false);
            const response = await fetch(
                `http://localhost:5004/poll/${pollId}/add-option`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            );
            if (response.status == 200) {
                toast.success("Option created successfully", {
                    theme: "colored",
                    hideProgressBar: true,
                });
                setVisibility(false);
                getOptions();
            } else if (response.status == 400) {
                toast.error("No option can't be added after the poll started", {
                    theme: "colored",
                    hideProgressBar: true,
                });
                setVisibility(false);
            } else {
                toast.error("Option addition failed", {
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
        <div className="flex w-3/4 md:w-1/2 flex-col p-10 bg-slate-100 rounded-lg">
            <div className="text-4xl font-bold text-sky-700">Create Option</div>
            <form onSubmit={handleSubmit} className="flex flex-col mt-10 gap-5">
                <div className="flex flex-col gap-1 w-full">
                    <label className="text-xs font-bold">Option Text</label>
                    <input
                        className="p-1 border-2 border-slate-200 focus:border-sky-500 rounded-sm outline-none bg-slate-200"
                        type="text"
                        name="text"
                        value={formData.text}
                        onChange={handleChange}
                        ref={optionTextRef}
                        required
                    />
                </div>
                <div className="flex w-full gap-2">
                    <button
                        className="bg-slate-300 p-2 hover:bg-slate-400 cursor-pointer rounded-sm w-full"
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
                        Create Option
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewOption;
