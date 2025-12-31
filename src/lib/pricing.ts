export const GEMINI_PRICING = {
    "gemini-3.0-pro": {
        input: 3.50,
        output: 10.50,
        name: "Gemini 3.0 Pro"
    },
    "gemini-3.0-flash": {
        input: 0.075,
        output: 0.30,
        name: "Gemini 3.0 Flash"
    },
    "default": {
        input: 0.075,
        output: 0.30,
        name: "Gemini 3.0 Flash"
    }
};

export type PricingModel = keyof typeof GEMINI_PRICING;

export function calculateCost(
    inputTokens: number,
    outputTokens: number,
    modelKey: string = "gemini-3.0-flash"
): number {
    let pricing = GEMINI_PRICING["default"];

    // Logic: check for "pro" first, else default to flash (cheaper/safer assumption) 
    // or strictly check for "flash".
    if (modelKey.toLowerCase().includes("pro")) {
        pricing = GEMINI_PRICING["gemini-3.0-pro"];
    } else if (modelKey.toLowerCase().includes("flash")) {
        pricing = GEMINI_PRICING["gemini-3.0-flash"];
    }

    const inputCost = (inputTokens / 1_000_000) * pricing.input;
    const outputCost = (outputTokens / 1_000_000) * pricing.output;

    return inputCost + outputCost;
}

export function formatCost(cost: number): string {
    if (cost === 0) return "$0.00";
    if (cost < 0.0001) return "< $0.0001";
    return `$${cost.toFixed(5)}`;
}
