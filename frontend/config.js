// API endpoint configuration.
// Local development uses localhost; the deployed site uses the Render service.
// If you rename the Render web service, update the URL below.
window.PORTFOLIO_API_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://portfolio-sti8.onrender.com";
