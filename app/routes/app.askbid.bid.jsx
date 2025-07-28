import { useState } from "react";
import { useLoaderData, Form, useActionData, useNavigation } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  InlineStack,
  TextField,
  Banner,
  Box,
  Thumbnail,
  Badge,
  Divider,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  
  const url = new URL(request.url);
  const productId = url.searchParams.get("productId");
  
  if (!productId) {
    throw new Response("Product ID is required", { status: 400 });
  }

  try {
    const product = await db.product.findUnique({
      where: { id: productId },
      include: {
        bids: {
          orderBy: { createdAt: 'desc' },
          take: 5 // Show last 5 bids
        }
      }
    });

    if (!product) {
      throw new Response("Product not found", { status: 404 });
    }

    // Calculate highest bid
    const highestBid = product.bids.length > 0 
      ? Math.max(...product.bids.map(b => b.amount))
      : 0;

    return json({ 
      product,
      highestBid,
      recentBids: product.bids
    });
  } catch (error) {
    console.error("Error loading product for bid:", error);
    throw new Response("Error loading product", { status: 500 });
  }
};

export const action = async ({ request }) => {
  await authenticate.admin(request);
  
  const formData = await request.formData();
  const productId = formData.get("productId");
  const amount = formData.get("amount");
  const bidderEmail = formData.get("bidderEmail");
  const bidderName = formData.get("bidderName");

  // Validation
  if (!productId || !amount || !bidderEmail) {
    return json({
      error: "Missing required fields",
      fields: { productId, amount, bidderEmail, bidderName }
    }, { status: 400 });
  }

  const bidAmount = parseFloat(amount);
  if (isNaN(bidAmount) || bidAmount <= 0) {
    return json({
      error: "Invalid bid amount",
      fields: { productId, amount, bidderEmail, bidderName }
    }, { status: 400 });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(bidderEmail)) {
    return json({
      error: "Invalid email address",
      fields: { productId, amount, bidderEmail, bidderName }
    }, { status: 400 });
  }

  try {
    // Check if product exists
    const product = await db.product.findUnique({
      where: { id: productId },
      include: { bids: true }
    });

    if (!product) {
      return json({
        error: "Product not found",
        fields: { productId, amount, bidderEmail, bidderName }
      }, { status: 404 });
    }

    // Check if bid amount is reasonable (not too low or higher than ask price)
    const highestBid = product.bids.length > 0 
      ? Math.max(...product.bids.map(b => b.amount))
      : 0;

    if (bidAmount <= highestBid) {
      return json({
        error: `Bid must be higher than current highest bid of $${highestBid.toFixed(2)}`,
        fields: { productId, amount, bidderEmail, bidderName }
      }, { status: 400 });
    }

    if (bidAmount > product.askPrice) {
      return json({
        error: `Bid cannot exceed ask price of $${product.askPrice.toFixed(2)}`,
        fields: { productId, amount, bidderEmail, bidderName }
      }, { status: 400 });
    }

    // Create the bid
    await db.bid.create({
      data: {
        productId: productId,
        amount: bidAmount,
        bidderEmail: bidderEmail,
        bidderName: bidderName || null,
        status: "PENDING"
      }
    });

    return redirect(`/app/askbid?success=bid-submitted&productId=${productId}&bidAmount=${bidAmount}`);
  } catch (error) {
    console.error("Error creating bid:", error);
    return json({
      error: "Database error occurred",
      fields: { productId, amount, bidderEmail, bidderName }
    }, { status: 500 });
  }
};

export default function BidSubmissionPage() {
  const { product, highestBid, recentBids } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  
  const [formData, setFormData] = useState({
    amount: actionData?.fields?.amount || "",
    bidderEmail: actionData?.fields?.bidderEmail || "",
    bidderName: actionData?.fields?.bidderName || "",
  });

  const isSubmitting = navigation.state === "submitting";
  
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatPrice = (price) => `$${price.toFixed(2)}`;
  
  // Calculate suggested bid (5% above highest bid or 80% of ask price)
  const suggestedBid = Math.max(
    highestBid * 1.05,
    product.askPrice * 0.8,
    product.basePrice * 1.1
  );

  return (
    <Page
      backAction={{
        url: "/app/askbid"
      }}
    >
      <TitleBar title={`Submit Bid - ${product.title}`} />
      
      <Layout>
        <Layout.Section variant="oneHalf">
          <BlockStack gap="500">
            {/* Error Banner */}
            {actionData?.error && (
              <Banner tone="critical">
                <Text as="p">{actionData.error}</Text>
              </Banner>
            )}

            {/* Product Info Card */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingLg">Product Information</Text>
                
                <InlineStack gap="400" blockAlign="start">
                  {product.imageUrl && (
                    <Thumbnail
                      source={product.imageUrl}
                      alt={product.title}
                      size="large"
                    />
                  )}
                  <BlockStack gap="200">
                    <Text as="h3" variant="headingMd">{product.title}</Text>
                    <InlineStack gap="200">
                      <Badge tone={product.status === "ACTIVE" ? "success" : "warning"}>
                        {product.status}
                      </Badge>
                    </InlineStack>
                  </BlockStack>
                </InlineStack>

                <Divider />

                <InlineStack gap="500" align="space-between">
                  <BlockStack gap="100">
                    <Text as="p" variant="bodyMd" tone="subdued">Base Price</Text>
                    <Text as="p" variant="headingMd">{formatPrice(product.basePrice)}</Text>
                  </BlockStack>
                  <BlockStack gap="100">
                    <Text as="p" variant="bodyMd" tone="subdued">Ask Price</Text>
                    <Text as="p" variant="headingMd" tone="success">{formatPrice(product.askPrice)}</Text>
                  </BlockStack>
                  <BlockStack gap="100">
                    <Text as="p" variant="bodyMd" tone="subdued">Highest Bid</Text>
                    <Text as="p" variant="headingMd" tone={highestBid > 0 ? "warning" : "subdued"}>
                      {highestBid > 0 ? formatPrice(highestBid) : "No bids yet"}
                    </Text>
                  </BlockStack>
                </InlineStack>
              </BlockStack>
            </Card>

            {/* Bid Form */}
            <Card>
              <Form method="post">
                <input type="hidden" name="productId" value={product.id} />
                <BlockStack gap="400">
                  <Text as="h2" variant="headingLg">Submit Your Bid</Text>
                  
                  <TextField
                    label="Bid Amount"
                    type="number"
                    step="0.01"
                    min={highestBid > 0 ? (highestBid + 0.01).toFixed(2) : "0.01"}
                    max={product.askPrice.toFixed(2)}
                    name="amount"
                    value={formData.amount}
                    onChange={(value) => handleFieldChange("amount", value)}
                    placeholder={`Minimum: ${formatPrice(highestBid + 0.01)}`}
                    prefix="$"
                    helpText={`Suggested bid: ${formatPrice(suggestedBid)} (must be between ${formatPrice(highestBid + 0.01)} and ${formatPrice(product.askPrice)})`}
                    error={actionData?.error && actionData.error.includes("amount") ? actionData.error : undefined}
                    disabled={isSubmitting}
                    requiredIndicator
                  />

                  <TextField
                    label="Your Email"
                    type="email"
                    name="bidderEmail"
                    value={formData.bidderEmail}
                    onChange={(value) => handleFieldChange("bidderEmail", value)}
                    placeholder="your.email@example.com"
                    helpText="We'll notify you if your bid is accepted"
                    error={actionData?.error && actionData.error.includes("email") ? actionData.error : undefined}
                    disabled={isSubmitting}
                    requiredIndicator
                  />

                  <TextField
                    label="Your Name (Optional)"
                    type="text"
                    name="bidderName"
                    value={formData.bidderName}
                    onChange={(value) => handleFieldChange("bidderName", value)}
                    placeholder="John Doe"
                    helpText="Display name for your bid"
                    disabled={isSubmitting}
                  />

                  <InlineStack gap="300">
                    <Button
                      submit
                      variant="primary"
                      loading={isSubmitting}
                      disabled={!formData.amount || !formData.bidderEmail}
                    >
                      {isSubmitting ? "Submitting Bid..." : "Submit Bid"}
                    </Button>
                    <Button
                      onClick={() => window.location.href = '/app/askbid'}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </InlineStack>
                </BlockStack>
              </Form>
            </Card>
          </BlockStack>
        </Layout.Section>

        {/* Recent Bids Sidebar */}
        <Layout.Section variant="oneHalf">
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingLg">Recent Bids</Text>
              
              {recentBids.length === 0 ? (
                <Box padding="400">
                  <Text as="p" variant="bodyMd" tone="subdued" alignment="center">
                    No bids yet. Be the first to bid!
                  </Text>
                </Box>
              ) : (
                <BlockStack gap="300">
                  {recentBids.map((bid, index) => (
                    <Box key={bid.id} padding="300" background="bg-surface-secondary" borderRadius="200">
                      <InlineStack align="space-between">
                        <BlockStack gap="100">
                          <Text as="p" variant="bodyMd" fontWeight="semibold">
                            {bid.bidderName || bid.bidderEmail}
                          </Text>
                          <Text as="p" variant="bodySm" tone="subdued">
                            {new Date(bid.createdAt).toLocaleDateString()} at {new Date(bid.createdAt).toLocaleTimeString()}
                          </Text>
                        </BlockStack>
                        <InlineStack gap="200" blockAlign="center">
                          <Text as="p" variant="bodyMd" fontWeight="semibold">
                            {formatPrice(bid.amount)}
                          </Text>
                          {index === 0 && (
                            <Badge tone="warning">Highest</Badge>
                          )}
                          <Badge 
                            tone={
                              bid.status === "ACCEPTED" ? "success" : 
                              bid.status === "REJECTED" ? "critical" : 
                              "info"
                            }
                          >
                            {bid.status}
                          </Badge>
                        </InlineStack>
                      </InlineStack>
                    </Box>
                  ))}
                </BlockStack>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
