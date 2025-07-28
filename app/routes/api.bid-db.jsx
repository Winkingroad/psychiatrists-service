import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export async function loader({ request }) {
  await authenticate.admin(request);
  
  const url = new URL(request.url);
  const productId = url.searchParams.get("productId");
  
  if (!productId) {
    return json({ error: "Missing productId" }, { status: 400 });
  }
  
  try {
    const productBid = await db.productBid.findUnique({
      where: { productId }
    });
    
    return json({
      ask: productBid?.askPrice || null,
      bid: productBid?.bidPrice || null
    });
  } catch (error) {
    console.error("Error fetching product bid:", error);
    return json({ error: "Database error" }, { status: 500 });
  }
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

  try {
    const askPrice = ask ? parseFloat(ask) : null;
    const bidPrice = bid ? parseFloat(bid) : null;

    const productBid = await db.productBid.upsert({
      where: { productId },
      update: {
        askPrice,
        bidPrice,
      },
      create: {
        productId,
        askPrice,
        bidPrice,
      },
    });

    return json({ 
      success: true, 
      ask: productBid.askPrice, 
      bid: productBid.bidPrice 
    });
  } catch (error) {
    console.error("Error saving product bid:", error);
    return json({ error: "Database error" }, { status: 500 });
  }
}
