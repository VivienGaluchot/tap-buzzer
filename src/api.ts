export interface TapRequest {
    // Unique identifier for the client sending the tap request
    id: string;
    // Player name
    name: string;
}

export interface TapResponse {
    // "accepted" if the tap was accepted, "refused" otherwise
    status: "accepted" | "refused";
    // Time already elapsed since the tap was accepted, in milliseconds
    elapsedTime: number;
    // Remaining time until the tap interval elapses, in milliseconds
    remainingTime: number;
}

export interface HostUpdate {
    // Player name
    name: string;
    // Remaining time until the tap interval elapses, in milliseconds
    remainingTime: number;
}
