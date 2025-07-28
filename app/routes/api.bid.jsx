import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

// Temporary in-memory store for ask/bid data
// In production, you'd want to use a database
let bidStore = {};

export async function loader({ request }) {
  await authenticate.admin(request);
  
  const url = new URL(request.url);
  const productId = url.searchParams.get("productId");
  
  if (!productId) {
    return json({ error: "Missing productId" }, { status: 400 });
  }
  
  const data = bidStore[productId] || { ask: null, bid: null };
  return json(data);
}

export async function action({ request }) {
  await authenticate.admin(request);
  
  const formData = await request.formData();
  const productId = formData.get("productId");
  const ask = formData.get("ask");
  const bid = formData.get("bid");

  if (!productId) {
    return json({ error: "Missing productId" }, { status: 400 });
  }

  // Store the ask/bid data
  bidStore[productId] = {
    ask: ask ? parseFloat(ask) : null,
    bid: bid ? parseFloat(bid) : null,
    updatedAt: new Date().toISOString()
  };

  return json({ 
    success: true, 
    ask: bidStore[productId].ask, 
    bid: bidStore[productId].bid 
  });
}
