"use client";
import useUserStore from "@/store/userStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const SignUpPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        student_name: "",
        student_id: "",
        student_email: "",
        password: "",
        confirm: "",
    });
    const [loading, setLoading] = useState(false);

    const { signedIn } = useUserStore();
    useEffect(() => {
        if (signedIn) router.replace("/");
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(false);
            const response = await fetch(`http://localhost:5004/auth/sign-up`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },

                body: JSON.stringify(formData),
            });
            if (response.status == 200) {
                toast.info("Sign Up successful. Sign in to your account", {
                    theme: "colored",
                    hideProgressBar: true,
                });
                router.replace("/sign-in");
            } else if (response.status == 403) {
                toast.error("User with this Student id already exists", {
                    theme: "colored",
                    hideProgressBar: true,
                });
                setLoading(false);
            } else if (response.status == 400) {
                const msg = await response.json();
                toast.error(msg, {
                    theme: "colored",
                    hideProgressBar: true,
                });
                setLoading(false);
            } else {
                const msg = await response.json();

                toast.error(msg, {
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
        <div className="flex h-full w-full justify-center mt-10">
            <div className="flex w-3/4 md:w-1/4 flex-col">
                <div className="text-4xl font-bold text-sky-700">Sign Up</div>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col mt-3 gap-5"
                >
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold">Name</label>
                        <input
                            className="p-1 border-2 border-slate-200 focus:border-sky-500 rounded-sm outline-none bg-slate-200"
                            type="text"
                            name="student_name"
                            value={formData.student_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold">
                            Institutional Email (21*****@cse.buet.ac.bd)
                        </label>
                        <input
                            className="p-1 border-2 border-slate-200 focus:border-sky-500 rounded-sm outline-none bg-slate-200"
                            type="email"
                            name="student_email"
                            value={formData.student_email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold">Student ID</label>
                        <input
                            className="p-1 border-2 border-slate-200 focus:border-sky-500 rounded-sm outline-none bg-slate-200"
                            type="text"
                            name="student_id"
                            value={formData.student_id}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold">Password</label>
                        <input
                            className="p-1 border-2 border-slate-200 focus:border-sky-500 rounded-sm outline-none bg-slate-200"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold">
                            confirm Password
                        </label>
                        <input
                            className="p-1 border-2 border-slate-200 focus:border-sky-500 rounded-sm outline-none bg-slate-200"
                            type="password"
                            name="confirm"
                            value={formData.confirm}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button
                        className="bg-sky-600 p-2 hover:bg-sky-700 cursor-pointer rounded-sm text-white"
                        type="submit"
                        disabled={loading}
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;
