import isEmpty from "lodash/isEmpty";

type QueryParamValue = string | number | boolean | null | undefined | Date | QueryParamObject | QueryParamValue[];

interface QueryParamObject {
    [key: string]: QueryParamValue;
}

interface QueryStringOptions {
    encode?: boolean;
    skipNull?: boolean;
    skipUndefined?: boolean;
    arrayFormat?: "brackets" | "comma" | "repeat";
    removeUndefinedOrNull?: boolean;
}

interface QueryStringParseOptions {
    decode?: boolean;
    parseNumbers?: boolean;
    parseBooleans?: boolean;
    parseDates?: boolean;
    parseNull?: boolean;
    arrayFormat?: "brackets" | "comma" | "repeat";
}

type QueryObject = {
    [key: string]: string | number | boolean | Date | null | QueryObject | Array<string | number | boolean | Date | null>;
};

export function objectToQueryString(obj: QueryParamObject, options: QueryStringOptions = {}): string {
    const { encode = true, skipNull = false, skipUndefined = false, arrayFormat = "brackets", removeUndefinedOrNull = true } = options;

    if (!obj || typeof obj !== "object") {
        return "";
    }

    function encodeValue(value: QueryParamValue): string {
        if (value === null || value === undefined) {
            return "";
        }

        if (value instanceof Date) {
            return value.toISOString();
        }

        const stringValue = String(value);
        return encode ? encodeURIComponent(stringValue) : stringValue;
    }

    function processArray(key: string, array: QueryParamValue[]): string {
        switch (arrayFormat) {
            case "comma":
                return `${key}=${array.map(encodeValue).join(",")}`;
            case "repeat":
                return array.map((item) => `${key}=${encodeValue(item)}`).join("&");
            case "brackets":
            default:
                return array.map((item) => `${key}[]=${encodeValue(item)}`).join("&");
        }
    }

    function processKeyValue(key: string, value: QueryParamValue, prefix = ""): string | void {
        console.log(key, value);

        if (removeUndefinedOrNull && isEmpty(value)) {
            return;
        }

        // Handle null and undefined
        if (value === null && skipNull) return "";
        if (value === undefined && skipUndefined) return "";

        const encodedKey = prefix ? `${prefix}[${key}]` : key;

        if (value === null || value === undefined) {
            return `${encodedKey}=`;
        }

        // Handle arrays
        if (Array.isArray(value)) {
            return processArray(encodedKey, value);
        }

        // Handle nested objects
        if (typeof value === "object" && !(value instanceof Date)) {
            return Object.entries(value as QueryParamObject)
                .map(([k, v]) => processKeyValue(k, v, encodedKey))
                .filter(Boolean)
                .join("&");
        }

        // Handle primitive values
        return `${encodedKey}=${encodeValue(value)}`;
    }

    return Object.entries(obj)
        .map(([key, value]) => processKeyValue(key, value))
        .filter(Boolean)
        .join("&");
}

export function queryStringToObject(queryString: string, options: QueryStringParseOptions = {}): QueryObject {
    const {
        decode = true,
        parseNumbers = true,
        parseBooleans = true,
        parseDates = true,
        parseNull = true,
        arrayFormat = "brackets",
    } = options;

    // Remove leading '?' if present
    queryString = queryString.replace(/^\?/, "");

    if (!queryString) {
        return {};
    }

    function decodeValue(value: string): string {
        return decode ? decodeURIComponent(value) : value;
    }

    function parseValue(value: string): any {
        // Handle empty values
        if (value === "") {
            return parseNull ? null : "";
        }

        const decodedValue = decodeValue(value);

        // Parse null
        if (parseNull && decodedValue.toLowerCase() === "null") {
            return null;
        }

        // Parse booleans
        if (parseBooleans) {
            if (decodedValue.toLowerCase() === "true") return true;
            if (decodedValue.toLowerCase() === "false") return false;
        }

        // Parse numbers
        if (parseNumbers && !isNaN(Number(decodedValue)) && decodedValue.trim() !== "") {
            return Number(decodedValue);
        }

        // Parse dates
        if (parseDates) {
            const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
            if (isoDateRegex.test(decodedValue)) {
                const date = new Date(decodedValue);
                if (!isNaN(date.getTime())) {
                    return date;
                }
            }
        }

        return decodedValue;
    }

    function parseArrayValue(value: string): any[] {
        if (arrayFormat === "comma") {
            return value.split(",").map(parseValue);
        }
        return [parseValue(value)];
    }

    function setNestedValue(obj: any, path: string[], value: any): void {
        const key = path[0];
        if (path.length === 1) {
            if (obj[key] !== undefined) {
                if (!Array.isArray(obj[key])) {
                    obj[key] = [obj[key]];
                }
                obj[key].push(value);
            } else {
                obj[key] = value;
            }
            return;
        }

        obj[key] = obj[key] || {};
        setNestedValue(obj[key], path.slice(1), value);
    }

    const result: QueryObject = {};

    // Split the query string into key-value pairs
    const pairs = queryString.split("&");

    for (const pair of pairs) {
        if (!pair) continue;

        let [key, value] = pair.split("=").map(decodeValue);
        value = value ?? ""; // Handle cases where value is undefined

        // Parse array notation
        const isArrayBrackets = key.endsWith("[]");
        if (isArrayBrackets) {
            key = key.slice(0, -2);
        }

        // Parse nested object notation
        const matches = key.match(/^([^\[]+)((?:\[[^\]]*\])*)/);
        if (matches) {
            const [, baseKey, bracketsStr] = matches;
            const path = [baseKey];

            if (bracketsStr) {
                const brackets = bracketsStr.match(/\[([^\]]*)\]/g) || [];
                path.push(...brackets.map((b) => b.slice(1, -1)));
            }

            if (isArrayBrackets || arrayFormat === "repeat") {
                const parsedValue = parseValue(value);
                setNestedValue(result, path, parsedValue);
            } else if (arrayFormat === "comma" && path.length === 1) {
                result[path[0]] = parseArrayValue(value);
            } else {
                const parsedValue = parseValue(value);
                setNestedValue(result, path, parsedValue);
            }
        }
    }

    return result;
}
