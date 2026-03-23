import api from "./client";

export default function getLeanerStatsRequest(): Promise {
    const response = api.get('/stats')
    return response.data;
}