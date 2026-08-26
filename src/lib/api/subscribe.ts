export const subscribeApi = {
  async subscribe(data: { email: string; name?: string; interests?: string[] }) {
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getCount() {
    const res = await fetch("/api/subscribe/count");
    return res.json();
  },
};
