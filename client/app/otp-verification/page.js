"use client";
import useUserStore from "@/store/userStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const OtpVerifcationPage = () => {
    const router = useRouter();

    const { signedIn, userInfo } = useUserStore();
    useEffect(() => {
        if (signedIn && userInfo.verified == "YES") router.replace("/");
    }, []);

    const [formData, setFormData] = useState({ otp: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(false);
            const response = await fetch(
                `http://localhost:5004/auth/verify-otp`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            );
            if (response?.status == 200) {
                toast.info(`Your account is verified successfully`, {
                    theme: "colored",
                    hideProgressBar: true,
                });
                router.replace("/polls");
            } else {
                toast.error("Invalid OTP", {
                    theme: "colored",
                    hideProgressBar: true,
                });
                setLoading(false);
                setFormData({ otp: "" });
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
                <div className="text-4xl font-bold text-sky-700">
                    Verify Your Email Address
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col mt-3 gap-5"
                >
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold">
                            Enter the OTP sent to your email
                        </label>
                        <input
                            className="p-1 border-2 border-slate-200 focus:border-sky-500 rounded-sm outline-none bg-slate-200"
                            type="text"
                            name="otp"
                            value={formData.otp}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button
                        className="bg-sky-600 p-2 hover:bg-sky-700 cursor-pointer rounded-sm text-white"
                        type="submit"
                        disabled={loading}
                    >
                        Verify
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OtpVerifcationPage;
