"use client";

import Link from "next/link";

const HomePage = () => {
    return (
        <div className="flex flex-col items-center justify-center mt-40 px-4">
            <div className="flex text-6xl text-center">
                Welcome to the Poll Portal
            </div>
            <div className="flex mt-5">
                <Link
                    className="bg-sky-600 text-white rounded-lg text-lg px-10 py-4 hover:bg-sky-700 transition duration-200"
                    href="/sign-in"
                >
                    Sign In to Continue
                </Link>
            </div>
            <div className="flex mt-2">
                Don&apos;t have a account?&nbsp;{" "}
                <Link className="text-sky-600 hover:underline" href="/sign-up">
                    Sign Up
                </Link>
            </div>
        </div>
    );
};

export default HomePage;
