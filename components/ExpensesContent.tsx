"use client";

import { useState, useEffect, useCallback } from "react";
import { Coffee, Bus, ShoppingBag, Receipt, Film, MoreHorizontal, Plus, Wallet, Trash2, CalendarRange, TrendingUp, IndianRupee, ChevronDown, Tag, Pencil, Save, X, Loader2 } from "lucide-react";
import { clsx } from "clsx";

interface Expense {
    _id: string; // Changed to _id for Mongo
    description: string;
    amount: number;
    category: string;
    timestamp: string; // Date comes as string from JSON
}

interface Category {
    name: string;
    icon: React.ElementType;
}

interface Stats {
    today: number;
    week: number;
    month: number;
}

export function ExpensesContent() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [activeCategory, setActiveCategory] = useState("Food");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<Stats>({ today: 0, week: 0, month: 0 });

    // Edit Mode State
    const [editingId, setEditingId] = useState<string | null>(null);

    // Category Management
    const [categories, setCategories] = useState<Category[]>([
        { name: "Food", icon: Coffee },
        { name: "Transport", icon: Bus },
        { name: "Shopping", icon: ShoppingBag },
        { name: "Bills", icon: Receipt },
        { name: "Fun", icon: Film },
        { name: "Other", icon: MoreHorizontal },
    ]);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

    const activeCatObj = categories.find(c => c.name === activeCategory) || categories[0];
    const ActiveIcon = activeCatObj.icon;

    const getHeaders = () => {
        const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
        // DEBUG: Check what is actually in userData
        if (!userData.email || (!userData.id && !userData._id)) {
            console.warn("getHeaders: Missing user data", userData);
        }
        return {
            "Content-Type": "application/json",
            "x-user-email": userData.email || "",
            "x-user-id": userData.id || userData._id || ""
        };
    };

    const fetchData = useCallback(async () => {
        try {
            console.log("Fetching expenses data...");
            const [expRes, statsRes] = await Promise.all([
                fetch("/api/expenses", { headers: getHeaders() }),
                fetch("/api/expenses/stats", { headers: getHeaders() })
            ]);

            if (expRes.ok) {
                const data = await expRes.json();
                console.log("Expenses fetched:", data);
                setExpenses(data);
            } else {
                console.error("Failed to fetch expenses:", expRes.status, await expRes.text());
            }

            if (statsRes.ok) {
                const data = await statsRes.json();
                console.log("Stats fetched:", data);
                setStats(data);
            } else {
                console.error("Failed to fetch stats:", statsRes.status);
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
        if ((userData.id || userData._id) && userData.email) {
            fetchData();
        } else {
            // No valid session, redirect immediately
            setIsLoading(false);
            window.location.href = "/";
        }
    }, [fetchData]);

    const handleAddOrUpdateExpense = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount) return;

        const val = parseFloat(amount);
        const payload = {
            description: description || activeCategory,
            amount: val,
            category: activeCategory,
        };

        try {
            let res;
            if (editingId) {
                // Update existing
                res = await fetch(`/api/expenses/${editingId}`, {
                    method: "PUT",
                    headers: getHeaders(),
                    body: JSON.stringify(payload),
                });
            } else {
                // Create new
                res = await fetch("/api/expenses", {
                    method: "POST",
                    headers: getHeaders(),
                    body: JSON.stringify(payload),
                });
            }

            if (res.ok) {
                resetForm();
                fetchData(); // Refresh list and stats
            } else {
                const errData = await res.json();
                console.error("Save failed", errData);
                if (res.status === 401) {
                    const headers = getHeaders();
                    console.error("Unauthorized: Session headers missing or invalid.", headers);
                    alert(`Session expired or invalid: ${errData.error}`);
                } else {
                    alert(`Failed to save expense: ${errData.error || "Unknown error"}`);
                }
            }
        } catch (error) {
            console.error("Failed to save", error);
        }
    };

    const resetForm = () => {
        setDescription("");
        setAmount("");
        setEditingId(null);
        setActiveCategory("Food");
        setIsDropdownOpen(false);
    };

    const handleEditClick = (expense: Expense) => {
        setEditingId(expense._id);
        setAmount(expense.amount.toString());
        setDescription(expense.description);
        setActiveCategory(expense.category);

        // Scroll to top on mobile
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this expense?")) return;
        try {
            const res = await fetch(`/api/expenses/${id}`, {
                method: "DELETE",
                headers: getHeaders(),
            });
            if (res.ok) {
                setExpenses(expenses.filter(e => e._id !== id));
                const statsRes = await fetch("/api/expenses/stats", { headers: getHeaders() });
                if (statsRes.ok) setStats(await statsRes.json());

                // If editing deleted item, reset
                if (editingId === id) resetForm();
            }
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    const handleCreateCategory = () => {
        if (!newCategoryName.trim()) return;

        const newCat: Category = {
            name: newCategoryName.trim(),
            icon: Tag
        };

        setCategories([...categories, newCat]);
        setActiveCategory(newCat.name);
        setNewCategoryName("");
        setIsAddingCategory(false);
        setIsDropdownOpen(false);
    };

    // Helper to group expenses
    const groupedExpenses = (() => {
        const groups: { [key: string]: { expenses: Expense[], total: number } } = {};

        expenses.forEach(expense => {
            const date = new Date(expense.timestamp);
            const today = new Date();
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            let dateKey = date.toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' });

            if (date.toDateString() === today.toDateString()) {
                dateKey = "Today";
            } else if (date.toDateString() === yesterday.toDateString()) {
                dateKey = "Yesterday";
            }

            if (!groups[dateKey]) {
                groups[dateKey] = { expenses: [], total: 0 };
            }

            groups[dateKey].expenses.push(expense);
            groups[dateKey].total += expense.amount;
        });

        return Object.entries(groups).map(([date, data]) => ({ date, ...data }));
    })();

    return (
        <div className="mx-auto max-w-md lg:max-w-6xl space-y-6 lg:space-y-8 pt-2 lg:pt-4 pb-20 lg:pb-0">



            {/* Stats Grid */}
            <div className="grid grid-cols-3 lg:grid-cols-3 gap-2 lg:gap-3 px-1 lg:px-0">
                <div className="flex flex-col items-center justify-center rounded-2xl bg-indigo-100/50 py-3 lg:py-6 ring-1 ring-inset ring-indigo-200 dark:bg-indigo-950/40 dark:ring-indigo-800/40 transition-all hover:scale-[1.02]">
                    <div className="flex items-center gap-1.5 mb-0.5 lg:mb-1">
                        <IndianRupee className="w-3 h-3 text-indigo-500 lg:hidden" />
                        <span className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-300">Today</span>
                    </div>
                    <span className="text-sm lg:text-2xl font-bold text-indigo-950 dark:text-indigo-100">
                        {isLoading ? "..." : `₹${stats.today.toFixed(0)}`}
                    </span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-2xl bg-fuchsia-100/50 py-3 lg:py-6 ring-1 ring-inset ring-fuchsia-200 dark:bg-fuchsia-950/40 dark:ring-fuchsia-800/40 transition-all hover:scale-[1.02]">
                    <div className="flex items-center gap-1.5 mb-0.5 lg:mb-1">
                        <TrendingUp className="w-3 h-3 text-fuchsia-500 lg:hidden" />
                        <span className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-fuchsia-600 dark:text-fuchsia-300">Week</span>
                    </div>
                    <span className="text-sm lg:text-2xl font-bold text-fuchsia-950 dark:text-fuchsia-100">
                        {isLoading ? "..." : `₹${stats.week.toFixed(0)}`}
                    </span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-2xl bg-orange-100/50 py-3 lg:py-6 ring-1 ring-inset ring-orange-200 dark:bg-orange-950/40 dark:ring-orange-800/40 transition-all hover:scale-[1.02]">
                    <div className="flex items-center gap-1.5 mb-0.5 lg:mb-1">
                        <CalendarRange className="w-3 h-3 text-orange-500 lg:hidden" />
                        <span className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-300">Month</span>
                    </div>
                    <span className="text-sm lg:text-2xl font-bold text-orange-950 dark:text-orange-100">
                        {isLoading ? "..." : `₹${stats.month.toFixed(0)}`}
                    </span>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                {/* Entry Card */}
                <div className="lg:w-1/2 lg:flex lg:flex-col lg:justify-start">
                    <div className={clsx(
                        "sticky top-6 relative overflow-visible rounded-3xl border bg-white p-4 lg:p-6 shadow-2xl transition-all duration-300 dark:bg-zinc-900 dark:shadow-black/60",
                        editingId ? "border-violet-500 shadow-violet-500/20 ring-2 ring-violet-500/20" : "border-zinc-100 dark:border-zinc-800 shadow-zinc-200/40"
                    )}>
                        <div className={clsx(
                            "absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl transition-colors duration-300",
                            editingId ? "bg-violet-500" : "bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500 opacity-80"
                        )} />

                        {editingId && (
                            <div className="absolute top-4 right-4 animate-in fade-in slide-in-from-top-2">
                                <button
                                    onClick={resetForm}
                                    className="p-1.5 rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )}

                        <form onSubmit={handleAddOrUpdateExpense} className="space-y-4 lg:space-y-6">
                            {/* Amount Input */}
                            <div className="flex flex-col items-center py-1">
                                {editingId && (
                                    <span className="text-xs font-bold text-violet-600 mb-1 uppercase tracking-widest">Editing Transaction</span>
                                )}
                                <div className="relative w-full">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-[40px] lg:-translate-x-[50px] -translate-y-1/2 pointer-events-none">
                                        <span className="text-xl lg:text-2xl font-bold text-zinc-800 dark:text-zinc-200">₹</span>
                                    </div>
                                    <input
                                        type="number"
                                        inputMode="decimal"
                                        step="0.01"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0"
                                        className="w-full bg-transparent text-center text-5xl lg:text-6xl font-black tracking-tight text-zinc-900 placeholder:text-zinc-100 focus:outline-none dark:text-white dark:placeholder:text-zinc-800"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* Category Dropdown */}
                            <div className="relative z-50">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsDropdownOpen(!isDropdownOpen);
                                        setIsAddingCategory(false);
                                    }}
                                    className="w-full h-12 lg:h-14 flex items-center justify-between px-4 rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-900 font-medium transition-all hover:bg-zinc-100 dark:bg-zinc-800/50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center p-1.5 rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-300">
                                            <ActiveIcon className="h-4 w-4 lg:h-5 lg:w-5" />
                                        </div>
                                        <span>{activeCategory}</span>
                                    </div>
                                    <ChevronDown className={clsx("h-4 w-4 text-zinc-400 transition-transform", isDropdownOpen && "rotate-180")} />
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-2xl bg-white border border-zinc-100 shadow-xl dark:bg-zinc-900 dark:border-zinc-800 dark:shadow-black animate-in fade-in zoom-in-95 duration-200">
                                        {isAddingCategory ? (
                                            <div className="p-2 space-y-3">
                                                <input
                                                    type="text"
                                                    value={newCategoryName}
                                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                                    placeholder="Category name..."
                                                    className="w-full rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-zinc-800 dark:text-white"
                                                    autoFocus
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsAddingCategory(false)}
                                                        className="flex-1 px-3 py-2 rounded-lg bg-zinc-100 text-xs font-medium text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleCreateCategory}
                                                        className="flex-1 px-3 py-2 rounded-lg bg-violet-600 text-xs font-medium text-white hover:bg-violet-700"
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="max-h-56 overflow-y-auto space-y-0.5">
                                                    {categories.map((cat) => {
                                                        const Icon = cat.icon;
                                                        const isActive = activeCategory === cat.name;
                                                        return (
                                                            <button
                                                                key={cat.name}
                                                                type="button"
                                                                onClick={() => {
                                                                    setActiveCategory(cat.name);
                                                                    setIsDropdownOpen(false);
                                                                }}
                                                                className={clsx(
                                                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium",
                                                                    isActive
                                                                        ? "bg-violet-50 text-violet-900 dark:bg-violet-900/20 dark:text-violet-100"
                                                                        : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
                                                                )}
                                                            >
                                                                <Icon className={clsx("h-4 w-4", isActive ? "text-violet-600 dark:text-violet-400" : "text-zinc-400")} />
                                                                <span>{cat.name}</span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                                <div className="mt-1 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsAddingCategory(true)}
                                                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-violet-600 hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-900/20"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                        Create New Category
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Description & Add Button Row */}
                            <div className="flex gap-2 lg:gap-3">
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Add a note..."
                                    className="flex-1 rounded-xl bg-zinc-50 px-4 lg:px-5 py-3 lg:py-4 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-100 focus:bg-white transition-all dark:bg-zinc-800/50 dark:text-white dark:focus:ring-violet-900/30 dark:focus:bg-zinc-800"
                                />
                                <button
                                    type="submit"
                                    disabled={!amount}
                                    className={clsx(
                                        "flex h-[46px] w-[46px] lg:h-[54px] lg:w-[54px] items-center justify-center rounded-xl text-white shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:shadow-none",
                                        editingId
                                            ? "bg-violet-600 shadow-violet-500/30"
                                            : "bg-zinc-900 shadow-zinc-900/20 dark:bg-white dark:text-black dark:shadow-white/10"
                                    )}
                                >
                                    {editingId ? <Save className="h-5 w-5 lg:h-6 lg:w-6" strokeWidth={2.5} /> : <Plus className="h-5 w-5 lg:h-6 lg:w-6" strokeWidth={2.5} />}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* List - Right/Bottom */}
                <div className="lg:w-1/2 space-y-6 px-2 lg:px-0">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Recent Transactions</h3>
                    </div>

                    {isLoading && expenses.length === 0 ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                        </div>
                    ) : expenses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                            <Wallet className="h-10 w-10 text-zinc-300 mb-2" />
                            <p className="text-sm font-medium text-zinc-400">No expenses recorded yet</p>
                        </div>
                    ) : (
                        groupedExpenses.map((group) => (
                            <div key={group.date} className="space-y-3">
                                <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">{group.date}</h4>
                                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-300">Total: ₹{group.total.toFixed(0)}</span>
                                </div>
                                <div className="space-y-2">
                                    {group.expenses.map((expense) => {
                                        const cat = categories.find(c => c.name === expense.category);
                                        const Icon = cat ? cat.icon : Wallet;
                                        const isEditing = editingId === expense._id;

                                        return (
                                            <div
                                                key={expense._id}
                                                className={clsx(
                                                    "group flex items-center justify-between rounded-2xl bg-white p-4 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] transition-all border dark:bg-zinc-900 dark:shadow-black/20",
                                                    isEditing
                                                        ? "border-violet-500 ring-1 ring-violet-500"
                                                        : "border-zinc-100/50 dark:border-zinc-800 hover:shadow-md hover:border-zinc-200 dark:hover:border-zinc-700"
                                                )}
                                            >
                                                <div className="flex items-center gap-3 lg:gap-4">
                                                    <div className="flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-2xl bg-zinc-50 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 group-hover:bg-violet-50 group-hover:text-violet-600 transition-colors">
                                                        <Icon className="h-4 w-4 lg:h-5 lg:w-5" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-violet-700 transition-colors">
                                                            {expense.description}
                                                        </span>
                                                        <span className="text-[10px] font-medium text-zinc-400">
                                                            {new Date(expense.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 lg:gap-3">
                                                    <span className="font-bold text-base lg:text-lg text-zinc-900 dark:text-white flex items-center">
                                                        <span className="text-zinc-400 mr-0.5 font-sans">₹</span>
                                                        {expense.amount.toFixed(2)}
                                                    </span>

                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleEditClick(expense)}
                                                            className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-violet-600 dark:hover:bg-zinc-800"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(expense._id)}
                                                            className="p-1.5 rounded-lg text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
    );
}
