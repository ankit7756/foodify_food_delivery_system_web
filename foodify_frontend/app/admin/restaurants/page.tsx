"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Loader2, Check, X } from "lucide-react";
import { adminGetRestaurants, adminDeleteRestaurant, adminCreateRestaurant, adminUpdateRestaurant, adminGetRestaurantById } from "@/lib/api/admin-api";
import DeleteModal from "@/app/_components/DeleteModal";

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
    return (
        <button type="button" onClick={onChange}
            className={`relative inline-flex h-5 w-9 rounded-full transition-colors flex-shrink-0 ${checked ? "bg-green-500" : "bg-muted-foreground/30"}`}>
            <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform mt-0.5 ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
        </button>
    );
}

function RestaurantModal({ initial, onSave, onClose }: {
    initial?: any;
    onSave: (fd: FormData) => Promise<void>;
    onClose: () => void;
}) {
    const [name, setName] = useState(initial?.name ?? "");
    const [description, setDescription] = useState(initial?.description ?? "");
    const [address, setAddress] = useState(initial?.address ?? "");
    const [phone, setPhone] = useState(initial?.phone ?? "");
    const [deliveryTime, setDeliveryTime] = useState(initial?.deliveryTime ?? "");
    const [deliveryFee, setDeliveryFee] = useState(initial?.deliveryFee ?? "");
    const [categories, setCategories] = useState(Array.isArray(initial?.categories) ? initial.categories.join(", ") : "");
    const [isOpen, setIsOpen] = useState(initial?.isOpen ?? true);
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setFile(f);
        setPreview(URL.createObjectURL(f));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!initial && !file) { setError("Image is required"); return; }

        const fd = new FormData();
        fd.append("name", name);
        fd.append("description", description);
        fd.append("address", address);
        fd.append("phone", phone);
        fd.append("deliveryTime", deliveryTime);
        fd.append("deliveryFee", String(deliveryFee));
        fd.append("categories", categories);
        fd.append("isOpen", String(isOpen));
        if (file) fd.append("image", file);

        setLoading(true);
        try { await onSave(fd); onClose(); }
        catch (err: any) { setError(err.message ?? "Failed"); }
        finally { setLoading(false); }
    };

    const inputCls = "w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-muted-foreground";
    const currentImg = preview ?? initial?.image ?? null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-background border border-border rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-background rounded-t-2xl">
                    <h2 className="font-bold">{initial ? "Edit Restaurant" : "Add Restaurant"}</h2>
                    <button onClick={onClose} className="p-1.5 hover:bg-accent rounded-lg transition-colors"><X className="h-4 w-4" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Image */}
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-xl overflow-hidden bg-muted border border-border flex-shrink-0 cursor-pointer" onClick={() => fileRef.current?.click()}>
                            {currentImg ? (
                                <Image src={currentImg} alt="Preview" width={64} height={64} unoptimized className="object-cover w-full h-full" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs text-center p-2">Click to upload</div>
                            )}
                        </div>
                        <div>
                            <button type="button" onClick={() => fileRef.current?.click()}
                                className="text-sm font-semibold text-orange-500 hover:text-orange-600">{file ? "Change Image" : "Upload Image"}</button>
                            <p className="text-xs text-muted-foreground mt-0.5">JPG/PNG · Max 5MB</p>
                        </div>
                        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 space-y-1"><label className="text-xs font-semibold text-muted-foreground">Name *</label>
                            <input value={name} onChange={e => setName(e.target.value)} placeholder="Restaurant name" className={inputCls} required /></div>
                        <div className="col-span-2 space-y-1"><label className="text-xs font-semibold text-muted-foreground">Description *</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description..." className={`${inputCls} resize-none h-20`} required /></div>
                        <div className="space-y-1"><label className="text-xs font-semibold text-muted-foreground">Phone *</label>
                            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="98XXXXXXXX" className={inputCls} required /></div>
                        <div className="space-y-1"><label className="text-xs font-semibold text-muted-foreground">Delivery Fee (Rs) *</label>
                            <input type="number" value={deliveryFee} onChange={e => setDeliveryFee(e.target.value)} placeholder="50" className={inputCls} required /></div>
                        <div className="space-y-1"><label className="text-xs font-semibold text-muted-foreground">Delivery Time *</label>
                            <input value={deliveryTime} onChange={e => setDeliveryTime(e.target.value)} placeholder="30-45 min" className={inputCls} required /></div>
                        <div className="space-y-1 flex flex-col justify-end"><label className="text-xs font-semibold text-muted-foreground mb-2 flex items-center justify-between">Currently Open <Toggle checked={isOpen} onChange={() => setIsOpen(!isOpen)} /></label></div>
                        <div className="col-span-2 space-y-1"><label className="text-xs font-semibold text-muted-foreground">Address *</label>
                            <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Full address" className={inputCls} required /></div>
                        <div className="col-span-2 space-y-1"><label className="text-xs font-semibold text-muted-foreground">Categories (comma separated)</label>
                            <input value={categories} onChange={e => setCategories(e.target.value)} placeholder="Pizza, Burgers, Drinks" className={inputCls} /></div>
                    </div>

                    {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-xl">{error}</p>}

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-accent transition-colors">Cancel</button>
                        <button type="submit" disabled={loading}
                            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 text-white text-sm font-bold disabled:opacity-70 flex items-center justify-center gap-2">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : initial ? "Save Changes" : "Add Restaurant"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function RestaurantsPage() {
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalItems: 0 });
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState<{ open: boolean; data?: any }>({ open: false });
    const [deleteTarget, setDeleteTarget] = useState<any>(null);

    const fetchRestaurants = async (page = 1) => {
        setLoading(true);
        try {
            const res = await adminGetRestaurants(String(page), "10", search || undefined);
            setRestaurants(res.data ?? []);
            setPagination(res.pagination ?? { page: 1, totalPages: 1, totalItems: 0 });
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchRestaurants(1); }, [search]);

    const handleSave = async (fd: FormData, id?: string) => {
        if (id) await adminUpdateRestaurant(id, fd);
        else await adminCreateRestaurant(fd);
        fetchRestaurants(pagination.page);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        await adminDeleteRestaurant(deleteTarget._id);
        setDeleteTarget(null);
        fetchRestaurants(1);
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                    <h1 className="text-2xl font-extrabold">Restaurants</h1>
                    <p className="text-sm text-muted-foreground">Manage all restaurants</p>
                </div>
                <button onClick={() => setModal({ open: true })}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 text-white text-sm font-bold hover:from-orange-600 hover:to-pink-700 transition-all">
                    <Plus className="h-4 w-4" /> Add Restaurant
                </button>
            </div>

            {/* Search */}
            <form onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); }}
                className="flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-2.5 w-full max-w-sm shadow-sm">
                <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)}
                    placeholder="Search restaurants..." className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground" />
            </form>

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>
            ) : (
                <div className="bg-background border border-border rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/30">
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Restaurant</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Address</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Delivery Fee</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {restaurants.map((r) => (
                                    <tr key={r._id} className="hover:bg-accent/30 transition-colors">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                                                    {r.image && <Image src={r.image} alt={r.name} width={40} height={40} unoptimized className="object-cover w-full h-full" />}
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{r.name}</p>
                                                    <p className="text-xs text-muted-foreground">{r.deliveryTime}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-muted-foreground text-xs max-w-[180px] truncate">{r.address}</td>
                                        <td className="px-5 py-3 font-medium">Rs. {r.deliveryFee}</td>
                                        <td className="px-5 py-3">
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${r.isOpen ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-600"}`}>
                                                {r.isOpen ? "Open" : "Closed"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-1.5">
                                                <button onClick={() => setModal({ open: true, data: r })}
                                                    className="p-1.5 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-500 transition-colors">
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => setDeleteTarget(r)}
                                                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between px-5 py-3 border-t border-border">
                            <p className="text-xs text-muted-foreground">{pagination.totalItems} restaurants</p>
                            <div className="flex items-center gap-1">
                                <button onClick={() => fetchRestaurants(pagination.page - 1)} disabled={pagination.page === 1}
                                    className="p-1.5 rounded-lg hover:bg-accent disabled:opacity-40 transition-colors"><ChevronLeft className="h-4 w-4" /></button>
                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                                    <button key={p} onClick={() => fetchRestaurants(p)}
                                        className={`h-7 w-7 rounded-lg text-xs font-semibold transition-colors ${p === pagination.page ? "bg-orange-500 text-white" : "hover:bg-accent"}`}>{p}</button>
                                ))}
                                <button onClick={() => fetchRestaurants(pagination.page + 1)} disabled={pagination.page === pagination.totalPages}
                                    className="p-1.5 rounded-lg hover:bg-accent disabled:opacity-40 transition-colors"><ChevronRight className="h-4 w-4" /></button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {modal.open && (
                <RestaurantModal
                    initial={modal.data}
                    onSave={(fd) => handleSave(fd, modal.data?._id)}
                    onClose={() => setModal({ open: false })}
                />
            )}
            <DeleteModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
                title="Delete Restaurant" description={`Delete "${deleteTarget?.name}"? This cannot be undone.`} />
        </div>
    );
}