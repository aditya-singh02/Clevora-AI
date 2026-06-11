import { useState, useEffect } from "react";
import axios from "axios";
import { ServerURL } from "../App.jsx"; // Check directory path carefully

export function useGetAllInterviews() {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        axios
            .get(`${ServerURL}/api/v1/interview/get-my-interviews`, {
                withCredentials: true,
            })
            .then(({ data }) => {
                if (isMounted && data?.success && Array.isArray(data.data)) {
                    setInterviews(data.data);
                }
            })
            .catch((err) => {
                console.error("Centralized Fetch Error:", err);
                if (isMounted) setError(err.message || "Failed to load interviews");
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return { interviews, loading, error };
}