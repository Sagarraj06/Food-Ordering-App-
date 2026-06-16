import React, { useState } from 'react'
import { useAppData } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authService } from '../main';

type Role = "customer" | "rider" | "seller" | null;

const SelectRole = () => {
    const [role, setRole] = useState<Role>(null);
    const { setUser } = useAppData();
    const navigate = useNavigate();
    const roles: ("customer" | "rider" | "seller")[] = ["customer", "rider", "seller"];

    const addRole = async () => {
        if (!role) return;
        try {
            const { data } = await axios.put(`${authService}/api/auth/add/role`, {
                role
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            localStorage.setItem("token", data.token);
            setUser(data.user);
            navigate("/", { replace: true });
        } catch (error) {
            console.error(error);
            alert("Something Went Wrong");
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-white px-4">
            <div className="w-full max-w-sm space-y-6">
                <h1 className="text-center text-2xl font-bold text-gray-800">
                    Choose your role
                </h1>
                <div className="space-y-4">
                    {roles.map((r) => (
                        <button
                            key={r}
                            onClick={() => setRole(r)}
                            className={`w-full rounded-xl border px-4 py-3 text-sm font-medium capitalize transition cursor-pointer ${
                                role === r
                                    ? "border-[#E23744] bg-[#E23744] text-white"
                                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            Continue as {r}
                        </button>
                    ))}
                </div>

                <button
                    onClick={addRole}
                    disabled={!role}
                    className="w-full rounded-xl bg-[#E23744] text-white py-3 font-semibold transition hover:bg-[#c92f3a] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    Confirm Role
                </button>
            </div>
        </div>
    )
}

export default SelectRole;