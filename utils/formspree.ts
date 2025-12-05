
export const FORMSPREE_ENDPOINT = "https://formspree.io/f/mrbnloke";

export const submitToFormspree = async (data: any) => {
  try {
    await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  } catch (error) {
    console.error("Formspree submission failed", error);
  }
};
