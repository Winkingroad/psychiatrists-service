// app/components/AskBidCard.jsx
import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import {
  Card,
  Text,
  Button,
  InlineStack,
  BlockStack,
  Badge,
  Box,
  Thumbnail,
  Divider,
} from "@shopify/polaris";

export function AskBidCard({ product }) {
  const [showBids, setShowBids] = useState(false);
  const navigate = useNavigate();
  
  // Calculate highest bid
  const highestBid = product.bids && product.bids.length > 0 
    ? Math.max(...product.bids.map(bid => parseFloat(bid.amount)))
    : 0;

  // Calculate profit potential
  const askPrice = parseFloat(product.askPrice || 0);
  const baseCost = parseFloat(product.baseCost || 0);
  const profit = askPrice - baseCost;
  const profitMargin = baseCost > 0 ? ((profit / baseCost) * 100).toFixed(1) : 0;

  // Handle navigation with onClick handlers
  const handleSubmitBid = () => {
    navigate(`/app/askbid/bid?productId=${product.id}`);
  };

  const handleEditAsk = () => {
    navigate(`/app/askbid/edit?productId=${product.id}`);
  };

  console.log('Product in AskBidCard:', product.id, product.title);

  return (
    <Card>
      <BlockStack gap="400">
        {/* Product Header */}
        <InlineStack align="space-between" blockAlign="start">
          <InlineStack gap="300" blockAlign="center">
            {product.featuredImage && (
              <Thumbnail
                source={product.featuredImage}
                alt={product.title}
                size="small"
              />
            )}
            <BlockStack gap="100">
              <Text variant="headingMd" as="h3">
                {product.title}
              </Text>
              <Text variant="bodyMd" tone="subdued">
                SKU: {product.handle || 'N/A'}
              </Text>
            </BlockStack>
          </InlineStack>
          <Badge tone={askPrice > 0 ? "success" : "attention"}>
            {askPrice > 0 ? "Active" : "No Ask Price"}
          </Badge>
        </InlineStack>

        <Divider />

        {/* Pricing Information */}
        <InlineStack gap="600" wrap={false}>
          <BlockStack gap="200">
            <Text variant="bodyMd" tone="subdued">Base Cost</Text>
            <Text variant="headingLg" as="p">
              ${baseCost.toFixed(2)}
            </Text>
          </BlockStack>
          
          <BlockStack gap="200">
            <Text variant="bodyMd" tone="subdued">Ask Price</Text>
            <Text 
              variant="headingLg" 
              as="p"
              tone={askPrice > baseCost ? "success" : "critical"}
            >
              ${askPrice.toFixed(2)}
            </Text>
          </BlockStack>
          
          <BlockStack gap="200">
            <Text variant="bodyMd" tone="subdued">Highest Bid</Text>
            <Text variant="headingLg" as="p">
              ${highestBid.toFixed(2)}
            </Text>
          </BlockStack>
          
          <BlockStack gap="200">
            <Text variant="bodyMd" tone="subdued">Profit Margin</Text>
            <Text 
              variant="headingLg" 
              as="p"
              tone={profit > 0 ? "success" : "critical"}
            >
              {profitMargin}%
            </Text>
          </BlockStack>
        </InlineStack>

        {/* Bid Information */}
        {product.bids && product.bids.length > 0 && (
          <Box>
            <InlineStack align="space-between" blockAlign="center">
              <Text variant="bodyMd">
                {product.bids.length} bid{product.bids.length !== 1 ? 's' : ''}
              </Text>
              <Button
                variant="plain"
                onClick={() => setShowBids(!showBids)}
              >
                {showBids ? 'Hide' : 'Show'} Bids
              </Button>
            </InlineStack>
            
            {showBids && (
              <Box paddingBlockStart="300">
                <BlockStack gap="200">
                  {product.bids
                    .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
                    .slice(0, 3)
                    .map((bid, index) => (
                      <InlineStack key={bid.id} align="space-between">
                        <Text variant="bodyMd">
                          Bid #{product.bids.length - index}
                        </Text>
                        <Text variant="bodyMd" fontWeight="semibold">
                          ${parseFloat(bid.amount).toFixed(2)}
                        </Text>
                        <Badge tone={bid.status === 'pending' ? 'info' : 'success'}>
                          {bid.status}
                        </Badge>
                      </InlineStack>
                    ))}
                  {product.bids.length > 3 && (
                    <Text variant="bodyMd" tone="subdued">
                      +{product.bids.length - 3} more bids
                    </Text>
                  )}
                </BlockStack>
              </Box>
            )}
          </Box>
        )}

        <Divider />

        {/* Action Buttons */}
        <InlineStack gap="300">
          <Button
            variant="primary"
            onClick={handleSubmitBid}
          >
            Submit Bid
          </Button>
          <Button
            onClick={handleEditAsk}
          >
            Edit Ask Price
          </Button>
        </InlineStack>
      </BlockStack>
    </Card>
  );
}
