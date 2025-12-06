export function assertDefined<T>(value: T | undefined | null): T {
    if (value === undefined || value === null) {
        throw new Error("undefined value");
    }
    return value;
}
