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
          take: 10 // Show recent bids for context
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
      recentBids: product.bids,
      totalBids: product.bids.length
    });
  } catch (error) {
    console.error("Error loading product for edit:", error);
    throw new Response("Error loading product", { status: 500 });
  }
};

export const action = async ({ request }) => {
  await authenticate.admin(request);
  
  const formData = await request.formData();
  const productId = formData.get("productId");
  const askPrice = formData.get("askPrice");

  // Validation
  if (!productId || !askPrice) {
    return json({
      error: "Missing required fields",
      fields: { productId, askPrice }
    }, { status: 400 });
  }

  const askPriceFloat = parseFloat(askPrice);
  if (isNaN(askPriceFloat) || askPriceFloat <= 0) {
    return json({
      error: "Invalid ask price - must be a positive number",
      fields: { productId, askPrice }
    }, { status: 400 });
  }

  try {
    // Check if product exists and get current bids
    const product = await db.product.findUnique({
      where: { id: productId },
      include: { bids: true }
    });

    if (!product) {
      return json({
        error: "Product not found",
        fields: { productId, askPrice }
      }, { status: 404 });
    }

    // Check if new ask price is reasonable
    const highestBid = product.bids.length > 0 
      ? Math.max(...product.bids.map(b => b.amount))
      : 0;

    // Ask price should be at least equal to base price
    if (askPriceFloat < product.basePrice) {
      return json({
        error: `Ask price cannot be lower than base price of $${product.basePrice.toFixed(2)}`,
        fields: { productId, askPrice }
      }, { status: 400 });
    }

    // Warn if ask price is lower than highest bid (but allow it)
    if (highestBid > 0 && askPriceFloat < highestBid) {
      return json({
        error: `Warning: Ask price is lower than highest bid of $${highestBid.toFixed(2)}. This may cause issues with bid validation.`,
        fields: { productId, askPrice }
      }, { status: 400 });
    }

    // Update the ask price
    await db.product.update({
      where: { id: productId },
      data: { askPrice: askPriceFloat }
    });

    return redirect(`/app/askbid?success=ask-updated&productId=${productId}&askPrice=${askPriceFloat}`);
  } catch (error) {
    console.error("Error updating ask price:", error);
    return json({
      error: "Database error occurred",
      fields: { productId, askPrice }
    }, { status: 500 });
  }
};

export default function EditAskPricePage() {
  const { product, highestBid, recentBids, totalBids } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  
  const [askPrice, setAskPrice] = useState(
    actionData?.fields?.askPrice || product.askPrice.toString()
  );

  const isSubmitting = navigation.state === "submitting";
  
  const formatPrice = (price) => `$${price.toFixed(2)}`;
  
  // Calculate suggested ask price (20% above base price or 10% above highest bid)
  const suggestedAskPrice = Math.max(
    product.basePrice * 1.2,
    highestBid * 1.1
  );

  // Calculate potential profit
  const currentAskPrice = parseFloat(askPrice) || product.askPrice;
  const potentialProfit = currentAskPrice - product.basePrice;
  const profitMargin = ((potentialProfit / product.basePrice) * 100);

  return (
    <Page
      backAction={{
        url: "/app/askbid"
      }}
    >
      <TitleBar title={`Edit Ask Price - ${product.title}`} />
      
      <Layout>
        <Layout.Section variant="oneHalf">
          <BlockStack gap="500">
            {/* Error/Success Banner */}
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
                      {totalBids > 0 && (
                        <Badge tone="info">
                          {totalBids} Bid{totalBids !== 1 ? 's' : ''}
                        </Badge>
                      )}
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
                    <Text as="p" variant="bodyMd" tone="subdued">Current Ask</Text>
                    <Text as="p" variant="headingMd" tone="success">{formatPrice(product.askPrice)}</Text>
                  </BlockStack>
                  <BlockStack gap="100">
                    <Text as="p" variant="bodyMd" tone="subdued">Highest Bid</Text>
                    <Text as="p" variant="headingMd" tone={highestBid > 0 ? "warning" : "subdued"}>
                      {highestBid > 0 ? formatPrice(highestBid) : "No bids"}
                    </Text>
                  </BlockStack>
                </InlineStack>

                {/* Profit Analysis */}
                {currentAskPrice > 0 && (
                  <Box padding="300" background="bg-surface-secondary" borderRadius="200">
                    <BlockStack gap="200">
                      <Text as="p" variant="bodySm" tone="subdued">Profit Analysis</Text>
                      <InlineStack gap="400">
                        <Text as="p" variant="bodyMd">
                          Profit: {formatPrice(potentialProfit)}
                        </Text>
                        <Text as="p" variant="bodyMd">
                          Margin: {profitMargin.toFixed(1)}%
                        </Text>
                      </InlineStack>
                    </BlockStack>
                  </Box>
                )}
              </BlockStack>
            </Card>

            {/* Edit Ask Price Form */}
            <Card>
              <Form method="post">
                <input type="hidden" name="productId" value={product.id} />
                <BlockStack gap="400">
                  <Text as="h2" variant="headingLg">Update Ask Price</Text>
                  
                  <TextField
                    label="Ask Price"
                    type="number"
                    step="0.01"
                    min={product.basePrice.toFixed(2)}
                    name="askPrice"
                    value={askPrice}
                    onChange={setAskPrice}
                    placeholder={formatPrice(product.askPrice)}
                    prefix="$"
                    helpText={`Suggested: ${formatPrice(suggestedAskPrice)} (minimum: ${formatPrice(product.basePrice)})`}
                    error={actionData?.error && actionData.error.includes("price") ? actionData.error : undefined}
                    disabled={isSubmitting}
                    requiredIndicator
                  />

                  <InlineStack gap="300">
                    <Button
                      submit
                      variant="primary"
                      loading={isSubmitting}
                      disabled={!askPrice || parseFloat(askPrice) <= 0}
                    >
                      {isSubmitting ? "Updating..." : "Update Ask Price"}
                    </Button>
                    <Button
                      onClick={() => window.location.href = '/app/askbid'}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="plain"
                      onClick={() => setAskPrice(suggestedAskPrice.toFixed(2))}
                      disabled={isSubmitting}
                    >
                      Use Suggested
                    </Button>
                  </InlineStack>
                </BlockStack>
              </Form>
            </Card>
          </BlockStack>
        </Layout.Section>

        {/* Recent Bids & Analytics Sidebar */}
        <Layout.Section variant="oneHalf">
          <BlockStack gap="400">
            {/* Bid Statistics */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingLg">Bid Statistics</Text>
                
                {totalBids > 0 ? (
                  <InlineStack gap="400">
                    <BlockStack gap="100">
                      <Text as="p" variant="bodyMd" tone="subdued">Total Bids</Text>
                      <Text as="p" variant="headingMd">{totalBids}</Text>
                    </BlockStack>
                    <BlockStack gap="100">
                      <Text as="p" variant="bodyMd" tone="subdued">Highest Bid</Text>
                      <Text as="p" variant="headingMd">{formatPrice(highestBid)}</Text>
                    </BlockStack>
                    <BlockStack gap="100">
                      <Text as="p" variant="bodyMd" tone="subdued">Avg Bid</Text>
                      <Text as="p" variant="headingMd">
                        {formatPrice(recentBids.reduce((sum, bid) => sum + bid.amount, 0) / recentBids.length)}
                      </Text>
                    </BlockStack>
                  </InlineStack>
                ) : (
                  <Text as="p" variant="bodyMd" tone="subdued">
                    No bids received yet
                  </Text>
                )}
              </BlockStack>
            </Card>

            {/* Recent Bids */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingLg">Recent Bids</Text>
                
                {recentBids.length === 0 ? (
                  <Box padding="400">
                    <Text as="p" variant="bodyMd" tone="subdued" alignment="center">
                      No bids yet
                    </Text>
                  </Box>
                ) : (
                  <BlockStack gap="300">
                    {recentBids.slice(0, 5).map((bid, index) => (
                      <Box key={bid.id} padding="300" background="bg-surface-secondary" borderRadius="200">
                        <InlineStack align="space-between">
                          <BlockStack gap="100">
                            <Text as="p" variant="bodyMd" fontWeight="semibold">
                              {bid.bidderName || bid.bidderEmail}
                            </Text>
                            <Text as="p" variant="bodySm" tone="subdued">
                              {new Date(bid.createdAt).toLocaleDateString()}
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
                    
                    {recentBids.length > 5 && (
                      <Text as="p" variant="bodySm" tone="subdued" alignment="center">
                        Showing 5 of {recentBids.length} bids
                      </Text>
                    )}
                  </BlockStack>
                )}
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
