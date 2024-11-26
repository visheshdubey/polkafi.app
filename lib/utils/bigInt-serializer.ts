export const serializeBigIntValues = (json: unknown) =>
    JSON.parse(JSON.stringify(json, (key, value) => (typeof value === "bigint" ? value.toString() : value)));
