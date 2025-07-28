import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { json } from "@remix-run/node";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  InlineStack,
  EmptyState,
  Banner,
  Filters,
  ChoiceList,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { AskBidCard } from "../components/AskBidCard";
import { fetchProducts, calculateAskPrice } from "../utils/api";
import db from "../db.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  try {
    // Fetch products from Shopify
    const shopifyProducts = await fetchProducts({ admin }, 50);
    
    // Get existing products from database with bids
    const dbProducts = await db.product.findMany({
      include: {
        bids: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    // Sync products: update existing and add new ones
    const syncedProducts = [];
    
    for (const shopifyProduct of shopifyProducts) {
      const existingProduct = dbProducts.find(p => p.shopifyId === shopifyProduct.shopifyId);
      
      if (existingProduct) {
        // Update existing product
        const updatedProduct = await db.product.update({
          where: { id: existingProduct.id },
          data: {
            title: shopifyProduct.title,
            handle: shopifyProduct.handle,
            basePrice: shopifyProduct.basePrice,
            status: shopifyProduct.status,
            imageUrl: shopifyProduct.imageUrl,
            askPrice: existingProduct.askPrice || calculateAskPrice(shopifyProduct.basePrice),
          },
          include: {
            bids: {
              orderBy: { createdAt: 'desc' }
            }
          }
        });
        syncedProducts.push(updatedProduct);
      } else {
        // Create new product
        const newProduct = await db.product.create({
          data: {
            shopifyId: shopifyProduct.shopifyId,
            title: shopifyProduct.title,
            handle: shopifyProduct.handle,
            basePrice: shopifyProduct.basePrice,
            askPrice: calculateAskPrice(shopifyProduct.basePrice),
            status: shopifyProduct.status,
            imageUrl: shopifyProduct.imageUrl,
          },
          include: {
            bids: {
              orderBy: { createdAt: 'desc' }
            }
          }
        });
        syncedProducts.push(newProduct);
      }
    }

    // Calculate statistics
    const stats = {
      totalProducts: syncedProducts.length,
      productsWithBids: syncedProducts.filter(p => p.bids.length > 0).length,
      totalBids: syncedProducts.reduce((sum, p) => sum + p.bids.length, 0),
      averageAskPrice: syncedProducts.reduce((sum, p) => sum + p.askPrice, 0) / syncedProducts.length || 0,
    };

    return json({ 
      products: syncedProducts,
      stats,
      success: true 
    });
  } catch (error) {
    console.error("Error in askbid loader:", error);
    return json({ 
      products: [], 
      stats: null,
      error: error.message,
      success: false 
    });
  }
};

export default function AskBidPage() {
  const { products, stats, error, success } = useLoaderData();
  const navigate = useNavigate();
  const [filteredProducts, setFilteredProducts] = useState(products || []);
  const [filters, setFilters] = useState({
    status: [],
    hasBids: [],
  });

  // Filter products based on current filters
  useEffect(() => {
    let filtered = [...products];

    if (filters.status.length > 0) {
      filtered = filtered.filter(p => filters.status.includes(p.status));
    }

    if (filters.hasBids.length > 0) {
      if (filters.hasBids.includes('with-bids')) {
        filtered = filtered.filter(p => p.bids.length > 0);
      }
      if (filters.hasBids.includes('without-bids')) {
        filtered = filtered.filter(p => p.bids.length === 0);
      }
    }

    setFilteredProducts(filtered);
  }, [products, filters]);

  const handleFiltersChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      status: [],
      hasBids: [],
    });
  };

  const filterOptions = [
    {
      key: 'status',
      label: 'Product Status',
      filter: (
        <ChoiceList
          title="Status"
          titleHidden
          choices={[
            { label: 'Active', value: 'ACTIVE' },
            { label: 'Draft', value: 'DRAFT' },
            { label: 'Archived', value: 'ARCHIVED' },
          ]}
          selected={filters.status}
          onChange={(value) => handleFiltersChange('status', value)}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: 'hasBids',
      label: 'Bid Status',
      filter: (
        <ChoiceList
          title="Bid Status"
          titleHidden
          choices={[
            { label: 'With Bids', value: 'with-bids' },
            { label: 'Without Bids', value: 'without-bids' },
          ]}
          selected={filters.hasBids}
          onChange={(value) => handleFiltersChange('hasBids', value)}
          allowMultiple
        />
      ),
      shortcut: true,
    },
  ];

  if (!success && error) {
    return (
      <Page>
        <TitleBar title="Ask & Bid Management" />
        <Layout>
          <Layout.Section>
            <Banner tone="critical">
              <Text as="p">Error loading products: {error}</Text>
            </Banner>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Page>
      <TitleBar title="Ask & Bid Management">
        <Button
          variant="primary"
          onClick={() => navigate('/app/askbid/add')}
        >
          Sync New Products
        </Button>
      </TitleBar>
      
      <BlockStack gap="500">
        {/* Statistics Cards */}
        {stats && (
          <Layout>
            <Layout.Section>
              <InlineStack gap="400">
                <Card>
                  <BlockStack gap="200">
                    <Text as="h3" variant="headingMd">Total Products</Text>
                    <Text as="p" variant="heading2xl">{stats.totalProducts}</Text>
                  </BlockStack>
                </Card>
                <Card>
                  <BlockStack gap="200">
                    <Text as="h3" variant="headingMd">Products with Bids</Text>
                    <Text as="p" variant="heading2xl">{stats.productsWithBids}</Text>
                  </BlockStack>
                </Card>
                <Card>
                  <BlockStack gap="200">
                    <Text as="h3" variant="headingMd">Total Bids</Text>
                    <Text as="p" variant="heading2xl">{stats.totalBids}</Text>
                  </BlockStack>
                </Card>
                <Card>
                  <BlockStack gap="200">
                    <Text as="h3" variant="headingMd">Avg Ask Price</Text>
                    <Text as="p" variant="heading2xl">${stats.averageAskPrice.toFixed(2)}</Text>
                  </BlockStack>
                </Card>
              </InlineStack>
            </Layout.Section>
          </Layout>
        )}

        {/* Filters */}
        <Layout>
          <Layout.Section>
            <Card>
              <Filters
                queryValue=""
                filters={filterOptions}
                onQueryChange={() => {}}
                onClearAll={clearAllFilters}
              >
                <Text as="h3" variant="headingMd">
                  {filteredProducts.length} of {products.length} products
                </Text>
              </Filters>
            </Card>
          </Layout.Section>
        </Layout>

        {/* Products List */}
        <Layout>
          <Layout.Section>
            {filteredProducts.length === 0 ? (
              <EmptyState
                heading="No products found"
                action={{
                  content: 'Sync Products from Shopify',
                  onAction: () => navigate('/app/askbid/add'),
                }}
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              >
                <Text as="p">
                  {products.length === 0 
                    ? "Sync your Shopify products to start setting ask and bid prices."
                    : "Try adjusting your filters to see more products."
                  }
                </Text>
              </EmptyState>
            ) : (
              <BlockStack gap="400">
                {filteredProducts.map((product) => (
                  <AskBidCard key={product.id} product={product} />
                ))}
              </BlockStack>
            )}
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
