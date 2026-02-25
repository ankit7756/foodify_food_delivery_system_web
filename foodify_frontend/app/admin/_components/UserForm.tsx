"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Camera, X, Loader2, Check, User, AtSign, Mail, Phone, Lock, Shield } from "lucide-react";

interface UserFormProps {
    initialData?: any;
    onSubmit: (formData: FormData) => Promise<{ success: boolean; message?: string }>;
    mode: "add" | "edit";
}

// ✅ OUTSIDE the component — never recreated on re-render
const inputCls = "w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-muted-foreground";

// ✅ OUTSIDE the component — stable reference, inputs never lose focus
function Field({ label, icon: Icon, children }: { label: string; icon: any; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/70 flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 text-orange-500" />
                {label}
            </label>
            {children}
        </div>
    );
}

export default function UserForm({ initialData, onSubmit, mode }: UserFormProps) {
    const [fullName, setFullName] = useState(initialData?.fullName ?? "");
    const [username, setUsername] = useState(initialData?.username ?? "");
    const [email, setEmail] = useState(initialData?.email ?? "");
    const [phone, setPhone] = useState(initialData?.phone ?? "");
    const [role, setRole] = useState(initialData?.role ?? "user");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        if (f.size > 5 * 1024 * 1024) { setError("Image must be under 5MB"); return; }
        setFile(f);
        setPreview(URL.createObjectURL(f));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (mode === "add" && !password) { setError("Password is required"); return; }
        if (password && password !== confirmPassword) { setError("Passwords do not match"); return; }
        if (password && password.length < 6) { setError("Password must be at least 6 characters"); return; }

        const fd = new FormData();
        if (fullName) fd.append("fullName", fullName);
        if (username) fd.append("username", username);
        if (email) fd.append("email", email);
        if (phone) fd.append("phone", phone);
        fd.append("role", role);
        if (password) fd.append("password", password);
        if (file) fd.append("profileImage", file);

        setLoading(true);
        try {
            const res = await onSubmit(fd);
            if (res.success) {
                setSuccess(true);
            } else {
                setError(res.message ?? "Something went wrong");
            }
        } catch (err: any) {
            setError(err.message ?? "Failed");
        } finally {
            setLoading(false);
        }
    };

    const currentImage = preview ?? initialData?.profileImage ?? null;

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">

            {/* Photo */}
            <div className="bg-background border border-border rounded-2xl p-6 shadow-sm flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="h-24 w-24 rounded-full overflow-hidden ring-4 ring-orange-200 dark:ring-orange-800/50 shadow-md">
                        {currentImage ? (
                            <Image src={currentImage} alt="Preview" width={96} height={96} unoptimized className="object-cover w-full h-full" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                                {fullName?.[0]?.toUpperCase() ?? "U"}
                            </div>
                        )}
                    </div>
                    <button type="button" onClick={() => fileRef.current?.click()}
                        className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md border-2 border-background hover:bg-orange-600 transition-colors">
                        <Camera className="h-4 w-4" />
                    </button>
                    {preview && (
                        <button type="button" onClick={() => { setPreview(null); setFile(null); }}
                            className="absolute top-0 right-0 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow border-2 border-background">
                            <X className="h-3 w-3" />
                        </button>
                    )}
                </div>
                <button type="button" onClick={() => fileRef.current?.click()}
                    className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors">
                    {preview ? "Change Photo" : "Upload Photo"}
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </div>

            {/* Fields */}
            <div className="bg-background border border-border rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">User Details</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Full Name" icon={User}>
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                            placeholder="Full name" className={inputCls} required />
                    </Field>
                    <Field label="Username" icon={AtSign}>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                            placeholder="username" className={inputCls} required />
                    </Field>
                    <Field label="Email" icon={Mail}>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@example.com" className={inputCls} required />
                    </Field>
                    <Field label="Phone" icon={Phone}>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                            placeholder="98XXXXXXXX" className={inputCls} required />
                    </Field>
                    <Field label="Role" icon={Shield}>
                        <select value={role} onChange={(e) => setRole(e.target.value)} className={inputCls}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </Field>
                </div>

                <div className="border-t border-border pt-4">
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-4">
                        {mode === "edit" ? "Change Password (optional)" : "Password"}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Password" icon={Lock}>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                placeholder={mode === "edit" ? "Leave blank to keep current" : "Min 6 characters"}
                                className={inputCls} required={mode === "add"} />
                        </Field>
                        <Field label="Confirm Password" icon={Lock}>
                            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Repeat password" className={inputCls} required={mode === "add"} />
                        </Field>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <button type="submit" disabled={loading || success}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all disabled:cursor-not-allowed ${success
                            ? "bg-green-500 text-white"
                            : "bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white disabled:opacity-70"
                        }`}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> :
                        success ? <><Check className="h-4 w-4" /> {mode === "add" ? "User Created!" : "Changes Saved!"}</> :
                            mode === "add" ? "Create User" : "Save Changes"}
                </button>
            </div>
        </form>
    );
}