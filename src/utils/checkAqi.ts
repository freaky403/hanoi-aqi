export const checkAqi = (aqi: number) => {
    return aqi <= 50 ? {
        color: "#009966",
        status: "Good"
    } : aqi <= 100 ? {
        color: "#ffde33",
        status: "Moderate"
    } : aqi <= 200 ? {
        color: "#ff9933",
        status: "Poor"
    } : aqi <= 300 ? {
        color: "#cc0033",
        status: "Unhealthy"
    } : aqi <= 400 ? {
        color: "#660099",
        status: "Severe"
    } : {
        color: "#7e0023",
        status: "Hazardous"
    };
}