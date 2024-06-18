import axios from "axios";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

const meanCacheService = {
    addRecord: async (value: number) => {
        const response = await axios.post("/api/records", { value });
        return response.data;
    },
    calculateMean: async () => {
        const response = await axios.get("/api/mean");
        return response.data;
    },
    initialize: async (ttl: number) => {
        let fingerprint: string;
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        fingerprint = result.visitorId;
        const response = await axios.post("/api/initialization", {
            fingerprint,
            ttl,
        });
        return response.data;
    },
};

export default meanCacheService;
