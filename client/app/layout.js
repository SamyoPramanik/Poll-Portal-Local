import NavBar from "@/components/NavBar";
import { ToastContainer } from "react-toastify";
import "./globals.css";

export const metadata = {
    title: "BUET Poll Portal",
    description: "created by Samyo Pramanik",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="flex flex-col box-border h-screen p-0 m-0">
                <NavBar />
                {children}
                <ToastContainer />
            </body>
        </html>
    );
}
