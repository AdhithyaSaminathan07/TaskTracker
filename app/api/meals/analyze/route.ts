import { NextResponse } from "next/server";

// Fallback data for demo mode
const DEMO_DB: Record<string, any> = {
    // Basics
    "apple": { name: "apple", calories: 52, protein: 0.3, carbs: 14, fats: 0.2, fiber: 2.4 },
    "banana": { name: "banana", calories: 89, protein: 1.1, carbs: 22.8, fats: 0.3, fiber: 2.6 },
    "rice": { name: "rice", calories: 130, protein: 2.7, carbs: 28, fats: 0.3, fiber: 0.4 },
    "chicken": { name: "chicken", calories: 239, protein: 27, carbs: 0, fats: 14, fiber: 0 },
    "egg": { name: "egg", calories: 155, protein: 13, carbs: 1.1, fats: 11, fiber: 0 },
    "milk": { name: "milk", calories: 42, protein: 3.4, carbs: 5, fats: 1, fiber: 0 },

    // South Indian Specials
    "idli": { name: "idli (2 pcs)", calories: 120, protein: 3, carbs: 24, fats: 0.5, fiber: 1 },
    "dosa": { name: "dosa (plain)", calories: 170, protein: 3, carbs: 29, fats: 4, fiber: 1 },
    "masala dosa": { name: "masala dosa", calories: 380, protein: 4.5, carbs: 55, fats: 15, fiber: 3 },
    "sambar": { name: "sambar (1 bowl)", calories: 150, protein: 4.5, carbs: 20, fats: 5, fiber: 4 },
    "vada": { name: "medu vada (2 pcs)", calories: 290, protein: 7.5, carbs: 24, fats: 18, fiber: 2 },
    "upma": { name: "upma (1 bowl)", calories: 250, protein: 3.5, carbs: 35, fats: 10, fiber: 3 },
    "pongal": { name: "ven pongal", calories: 320, protein: 4.5, carbs: 45, fats: 12, fiber: 2 },
    "kesari": { name: "rava kesari", calories: 350, protein: 1.5, carbs: 55, fats: 12, fiber: 0.5 },
    "uttapam": { name: "uttapam", calories: 220, protein: 3, carbs: 35, fats: 7, fiber: 2 },
    "pesarattu": { name: "pesarattu", calories: 240, protein: 6, carbs: 32, fats: 7, fiber: 5 },
    "chapati": { name: "chapati (2 pcs)", calories: 240, protein: 6, carbs: 40, fats: 6, fiber: 6 },
    "parotta": { name: "parotta (2 pcs)", calories: 450, protein: 6, carbs: 60, fats: 20, fiber: 2 },
    "curd rice": { name: "curd rice", calories: 290, protein: 5, carbs: 40, fats: 10, fiber: 0.5 },
    "rasam": { name: "rasam", calories: 60, protein: 0.8, carbs: 8, fats: 3, fiber: 0.5 },
    "veg biryani": { name: "veg biryani", calories: 350, protein: 6, carbs: 55, fats: 10, fiber: 6 },
    "chicken biryani": { name: "chicken biryani", calories: 450, protein: 19, carbs: 45, fats: 18, fiber: 3 },

    // South Indian Non-Veg Specials
    "chicken 65": { name: "chicken 65 (6 pcs)", calories: 380, protein: 21, carbs: 12, fats: 24, fiber: 1 },
    "fish curry": { name: "fish curry (meen kuzhambu)", calories: 320, protein: 18, carbs: 8, fats: 20, fiber: 2 },
    "chettinad chicken": { name: "chettinad chicken", calories: 410, protein: 22, carbs: 10, fats: 28, fiber: 2 },
    "mutton sukka": { name: "mutton sukka", calories: 390, protein: 20, carbs: 6, fats: 28, fiber: 1 },
    "pepper chicken": { name: "pepper chicken", calories: 340, protein: 21, carbs: 8, fats: 18, fiber: 1 },
    "egg curry": { name: "egg curry (2 eggs)", calories: 280, protein: 10.5, carbs: 8, fats: 20, fiber: 1 },
    "prawn fry": { name: "prawn fry", calories: 310, protein: 16.5, carbs: 12, fats: 18, fiber: 1 },
    "omelette": { name: "omelette (2 eggs)", calories: 210, protein: 10.5, carbs: 2, fats: 16, fiber: 0 },
    "karuvadu": { name: "karuvadu (dry fish)", calories: 280, protein: 26, carbs: 0, fats: 14, fiber: 0 },

    // Tamil Nadu Fruits
    "jackfruit": { name: "jackfruit (1 cup)", calories: 155, protein: 2.8, carbs: 38, fats: 1, fiber: 2.5 },
    "mango": { name: "mango (1 medium)", calories: 200, protein: 2.8, carbs: 50, fats: 1.3, fiber: 5 },
    "guava": { name: "guava (1 medium)", calories: 68, protein: 2.6, carbs: 14, fats: 0.9, fiber: 5.4 },
    "papaya": { name: "papaya (1 cup)", calories: 60, protein: 0.5, carbs: 15, fats: 0.2, fiber: 2.5 },
    "pomegranate": { name: "pomegranate (1 cup)", calories: 145, protein: 2.9, carbs: 33, fats: 2, fiber: 7 },
    "sapota": { name: "sapota (1 medium)", calories: 83, protein: 0.4, carbs: 20, fats: 1.1, fiber: 5.3 },
    "tender coconut": { name: "tender coconut water", calories: 45, protein: 0.7, carbs: 9, fats: 0.5, fiber: 2.6 },

    // Tamil Nadu Snacks
    "murukku": { name: "murukku (2 pcs)", calories: 150, protein: 2, carbs: 18, fats: 8, fiber: 1 },
    "athirasam": { name: "athirasam (1 pc)", calories: 180, protein: 1, carbs: 28, fats: 7, fiber: 0.5 },
    "paniyaram": { name: "paniyaram (3 pcs)", calories: 120, protein: 3, carbs: 20, fats: 3, fiber: 1 },
    "sundal": { name: "chana sundal (1 cup)", calories: 220, protein: 12, carbs: 35, fats: 4, fiber: 10 },
    "bajji": { name: "vazhakkai bajji (2 pcs)", calories: 280, protein: 6, carbs: 35, fats: 15, fiber: 3 },
    "bonda": { name: "aloo bonda (2 pcs)", calories: 300, protein: 6, carbs: 40, fats: 14, fiber: 3 },
    "medu vada": { name: "medu vada (2 pcs)", calories: 290, protein: 10, carbs: 24, fats: 18, fiber: 2 },
    "masala vada": { name: "masala vada (2 pcs)", calories: 320, protein: 12, carbs: 30, fats: 18, fiber: 6 },
    "mixture": { name: "mixture (1 cup)", calories: 450, protein: 12, carbs: 45, fats: 25, fiber: 4 },
    "thattai": { name: "thattai (2 pcs)", calories: 160, protein: 2, carbs: 20, fats: 8, fiber: 1 },
    "seedai": { name: "seedai (1 cup)", calories: 350, protein: 4, carbs: 45, fats: 18, fiber: 2 },

    // Chats & Street Food
    "pani puri": { name: "pani puri (6 pcs)", calories: 180, protein: 3, carbs: 36, fats: 4, fiber: 2 },
    "masal puri": { name: "masal puri (1 plate)", calories: 250, protein: 4.5, carbs: 40, fats: 10, fiber: 4 },
    "bhel puri": { name: "bhel puri (1 plate)", calories: 280, protein: 5, carbs: 45, fats: 9, fiber: 3 },
    "sev puri": { name: "sev puri (1 plate)", calories: 320, protein: 4.5, carbs: 42, fats: 16, fiber: 2 },
    "dahi puri": { name: "dahi puri (6 pcs)", calories: 350, protein: 6, carbs: 48, fats: 14, fiber: 2 },
    "samosa": { name: "samosa (1 pc)", calories: 260, protein: 4.5, carbs: 24, fats: 17, fiber: 2 },
    "pav bhaji": { name: "pav bhaji (2 pav)", calories: 400, protein: 7.5, carbs: 55, fats: 15, fiber: 5 },
    "cutlet": { name: "veg cutlet (2 pcs)", calories: 300, protein: 4.5, carbs: 30, fats: 18, fiber: 3 },

    // Variety Rice
    "lemon rice": { name: "lemon rice", calories: 320, protein: 4.5, carbs: 50, fats: 12, fiber: 2 },
    "tamarind rice": { name: "tamarind rice", calories: 350, protein: 5, carbs: 55, fats: 14, fiber: 3 },
    "tomato rice": { name: "tomato rice", calories: 290, protein: 3.5, carbs: 48, fats: 10, fiber: 2 },
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
        return NextResponse.json({ error: "Query required" }, { status: 400 });
    }

    const apiKey = process.env.CALORIE_NINJA_API_KEY;

    try {
        // 1. Try Real API if Key exists
        if (apiKey) {
            const res = await fetch(`https://api.calorieninjas.com/v1/nutrition?query=${query}`, {
                headers: { 'X-Api-Key': apiKey }
            });

            if (res.ok) {
                const data = await res.json();
                if (data.items && data.items.length > 0) {
                    // Aggregate multiple items if user typed "chicken and rice"
                    const total = data.items.reduce((acc: any, item: any) => ({
                        calories: acc.calories + item.calories,
                        protein: acc.protein + item.protein_g,
                        carbs: acc.carbs + item.carbohydrates_total_g,
                        fats: acc.fats + item.fat_total_g,
                        fiber: acc.fiber + item.fiber_g,
                    }), { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 });

                    return NextResponse.json({ success: true, data: total });
                }
            }
        }

        // 2. Fallback / Demo Mode
        const lowerQuery = query.toLowerCase();
        let found = null;

        // Simple keyword matching for demo
        for (const [key, val] of Object.entries(DEMO_DB)) {
            if (lowerQuery.includes(key)) {
                found = val;
                break; // Just take the first match for simple demo
            }
        }

        if (found) {
            return NextResponse.json({
                success: true,
                data: found,
                isDemo: true,
                message: "Using demo data. Add CALORIE_NINJA_API_KEY for full database."
            });
        }

        return NextResponse.json({
            error: "Food not found in demo database",
            message: "Try 'apple', 'banana', 'chicken' or add API key."
        }, { status: 404 });

    } catch (error) {
        console.error("Nutrition analysis failed:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
