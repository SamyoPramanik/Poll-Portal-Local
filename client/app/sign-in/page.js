"use client";
import useUserStore from "@/store/userStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const SignInPage = () => {
    const router = useRouter();

    const { signedIn, setUserInfo, setSignedIn } = useUserStore();
    useEffect(() => {
        if (signedIn) router.replace("/polls");
    }, []);

    const [formData, setFormData] = useState({ student_id: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/sign-in`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            );
            if (response?.status == 200) {
                toast.info(`Welcome`, {
                    theme: "colored",
                    hideProgressBar: true,
                });

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/profile`,
                    { credentials: "include" }
                );

                if (response.status == 200) {
                    const user = await response.json();
                    setUserInfo(user);
                    setSignedIn(true);

                    console.log(user);
                    if (user.verified == "NO")
                        router.replace("/otp-verification");
                    else router.replace("/polls");
                }
            } else {
                toast.error("Credentials Error", {
                    theme: "colored",
                    hideProgressBar: true,
                });
                setLoading(false);
                setFormData({ student_id: "", password: "" });
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
                <div className="text-4xl font-bold text-sky-700">Sign In</div>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col mt-3 gap-5"
                >
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold">Student Id</label>
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
                    <button
                        className="bg-sky-600 p-2 hover:bg-sky-700 cursor-pointer rounded-sm text-white"
                        type="submit"
                        disabled={loading}
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignInPage;
