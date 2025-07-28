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
  EmptyState,
  DataTable,
  Badge,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { fetchProducts, calculateAskPrice } from "../utils/api";
import db from "../db.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  try {
    // Fetch products from Shopify
    const shopifyProducts = await fetchProducts({ admin }, 100);
    
    // Get existing products from database
    const dbProducts = await db.product.findMany({
      select: {
        shopifyId: true,
        title: true,
        askPrice: true,
        basePrice: true,
      }
    });

    // Find products not yet synced to database
    const unsyncedProducts = shopifyProducts.filter(shopifyProduct => 
      !dbProducts.find(dbProduct => dbProduct.shopifyId === shopifyProduct.shopifyId)
    );

    return json({
      shopifyProducts,
      dbProducts,
      unsyncedProducts,
      totalShopifyProducts: shopifyProducts.length,
      totalDbProducts: dbProducts.length,
    });
  } catch (error) {
    console.error("Error in add loader:", error);
    return json({
      shopifyProducts: [],
      dbProducts: [],
      unsyncedProducts: [],
      error: error.message,
    });
  }
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  
  const formData = await request.formData();
  const actionType = formData.get("actionType");

  if (actionType === "syncAll") {
    try {
      // Sync all Shopify products to database
      const shopifyProducts = await fetchProducts({ admin }, 100);
      let syncedCount = 0;
      let updatedCount = 0;

      for (const shopifyProduct of shopifyProducts) {
        const existingProduct = await db.product.findUnique({
          where: { shopifyId: shopifyProduct.shopifyId }
        });

        if (existingProduct) {
          // Update existing product
          await db.product.update({
            where: { id: existingProduct.id },
            data: {
              title: shopifyProduct.title,
              handle: shopifyProduct.handle,
              basePrice: shopifyProduct.basePrice,
              status: shopifyProduct.status,
              imageUrl: shopifyProduct.imageUrl,
              // Keep existing askPrice if set, otherwise calculate new one
              askPrice: existingProduct.askPrice || calculateAskPrice(shopifyProduct.basePrice),
            }
          });
          updatedCount++;
        } else {
          // Create new product
          await db.product.create({
            data: {
              shopifyId: shopifyProduct.shopifyId,
              title: shopifyProduct.title,
              handle: shopifyProduct.handle,
              basePrice: shopifyProduct.basePrice,
              askPrice: calculateAskPrice(shopifyProduct.basePrice),
              status: shopifyProduct.status,
              imageUrl: shopifyProduct.imageUrl,
            }
          });
          syncedCount++;
        }
      }

      return redirect(`/app/askbid/add?success=sync&synced=${syncedCount}&updated=${updatedCount}`);
    } catch (error) {
      console.error("Error syncing products:", error);
      return json({
        error: "Failed to sync products: " + error.message
      }, { status: 500 });
    }
  }

  if (actionType === "updateAskPrice") {
    const productId = formData.get("productId");
    const askPrice = formData.get("askPrice");

    if (!productId || !askPrice) {
      return json({
        error: "Missing product ID or ask price"
      }, { status: 400 });
    }

    const askPriceFloat = parseFloat(askPrice);
    if (isNaN(askPriceFloat) || askPriceFloat <= 0) {
      return json({
        error: "Invalid ask price"
      }, { status: 400 });
    }

    try {
      await db.product.update({
        where: { shopifyId: productId },
        data: { askPrice: askPriceFloat }
      });

      return redirect(`/app/askbid/add?success=update&productId=${productId}&askPrice=${askPriceFloat}`);
    } catch (error) {
      console.error("Error updating ask price:", error);
      return json({
        error: "Failed to update ask price"
      }, { status: 500 });
    }
  }

  return json({ error: "Invalid action" }, { status: 400 });
};

export default function AddAskBidPage() {
  const { shopifyProducts, dbProducts, unsyncedProducts, totalShopifyProducts, totalDbProducts, error } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const [editingProducts, setEditingProducts] = useState({});

  const isLoading = navigation.state === "submitting";

  const handleEditAskPrice = (productId, currentPrice) => {
    setEditingProducts(prev => ({
      ...prev,
      [productId]: currentPrice.toString()
    }));
  };

  const handleCancelEdit = (productId) => {
    setEditingProducts(prev => {
      const newState = { ...prev };
      delete newState[productId];
      return newState;
    });
  };

  const handleSaveAskPrice = (productId) => {
    const askPrice = editingProducts[productId];
    if (askPrice) {
      const form = document.createElement('form');
      form.method = 'POST';
      form.style.display = 'none';
      
      const actionInput = document.createElement('input');
      actionInput.name = 'actionType';
      actionInput.value = 'updateAskPrice';
      form.appendChild(actionInput);
      
      const productIdInput = document.createElement('input');
      productIdInput.name = 'productId';
      productIdInput.value = productId;
      form.appendChild(productIdInput);
      
      const askPriceInput = document.createElement('input');
      askPriceInput.name = 'askPrice';
      askPriceInput.value = askPrice;
      form.appendChild(askPriceInput);
      
      document.body.appendChild(form);
      form.submit();
    }
  };

  // Prepare data for the table
  const tableRows = dbProducts.map(product => {
    const isEditing = editingProducts.hasOwnProperty(product.shopifyId);
    const editPrice = editingProducts[product.shopifyId] || '';

    return [
      product.title,
      `$${product.basePrice.toFixed(2)}`,
      isEditing ? (
        <TextField
          value={editPrice}
          onChange={(value) => setEditingProducts(prev => ({
            ...prev,
            [product.shopifyId]: value
          }))}
          type="number"
          step="0.01"
          min="0"
          prefix="$"
        />
      ) : `$${product.askPrice.toFixed(2)}`,
      isEditing ? (
        <InlineStack gap="200">
          <Button
            size="slim"
            variant="primary"
            onClick={() => handleSaveAskPrice(product.shopifyId)}
            disabled={!editPrice || parseFloat(editPrice) <= 0}
          >
            Save
          </Button>
          <Button
            size="slim"
            onClick={() => handleCancelEdit(product.shopifyId)}
          >
            Cancel
          </Button>
        </InlineStack>
      ) : (
        <Button
          size="slim"
          onClick={() => handleEditAskPrice(product.shopifyId, product.askPrice)}
        >
          Edit
        </Button>
      )
    ];
  });

  return (
    <Page
      backAction={{
        url: "/app/askbid"
      }}
    >
      <TitleBar title="Sync & Manage Products" />
      
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            {/* Success/Error Messages */}
            {actionData?.error && (
              <Banner tone="critical">
                <Text as="p">{actionData.error}</Text>
              </Banner>
            )}
            
            {error && (
              <Banner tone="critical">
                <Text as="p">Error loading data: {error}</Text>
              </Banner>
            )}

            {/* Statistics */}
            <InlineStack gap="400">
              <Card>
                <BlockStack gap="200">
                  <Text as="h3" variant="headingMd">Shopify Products</Text>
                  <Text as="p" variant="heading2xl">{totalShopifyProducts}</Text>
                </BlockStack>
              </Card>
              <Card>
                <BlockStack gap="200">
                  <Text as="h3" variant="headingMd">Synced Products</Text>
                  <Text as="p" variant="heading2xl">{totalDbProducts}</Text>
                </BlockStack>
              </Card>
              <Card>
                <BlockStack gap="200">
                  <Text as="h3" variant="headingMd">Unsynced Products</Text>
                  <Text as="p" variant="heading2xl" tone={unsyncedProducts?.length > 0 ? "warning" : "success"}>
                    {unsyncedProducts?.length || 0}
                  </Text>
                </BlockStack>
              </Card>
            </InlineStack>

            {/* Sync Actions */}
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingLg">Product Synchronization</Text>
                <Text as="p" variant="bodyMd" tone="subdued">
                  Sync your Shopify products to enable Ask/Bid functionality. This will create entries in the database 
                  with default ask prices set to 20% above base price.
                </Text>
                
                <InlineStack gap="300">
                  <Form method="post">
                    <input type="hidden" name="actionType" value="syncAll" />
                    <Button
                      submit
                      variant="primary"
                      loading={isLoading}
                      disabled={totalShopifyProducts === 0}
                    >
                      {isLoading ? "Syncing..." : `Sync All Products (${totalShopifyProducts})`}
                    </Button>
                  </Form>
                  
                  <Button onClick={() => window.location.href = '/app/askbid'}>
                    View Ask/Bid Listings
                  </Button>
                </InlineStack>
              </BlockStack>
            </Card>

            {/* Unsynced Products */}
            {unsyncedProducts && unsyncedProducts.length > 0 && (
              <Card>
                <BlockStack gap="400">
                  <Text as="h2" variant="headingLg">Unsynced Products ({unsyncedProducts.length})</Text>
                  <Text as="p" variant="bodyMd" tone="subdued">
                    These products from your Shopify store haven't been synced yet.
                  </Text>
                  
                  <DataTable
                    columnContentTypes={['text', 'text', 'text', 'text']}
                    headings={['Product Title', 'Base Price', 'Calculated Ask Price', 'Status']}
                    rows={unsyncedProducts.map(product => [
                      product.title,
                      `$${product.basePrice.toFixed(2)}`,
                      `$${calculateAskPrice(product.basePrice).toFixed(2)}`,
                      <Badge key={product.shopifyId} tone={product.status === 'ACTIVE' ? 'success' : 'warning'}>
                        {product.status}
                      </Badge>
                    ])}
                  />
                </BlockStack>
              </Card>
            )}

            {/* Existing Products */}
            {dbProducts.length > 0 ? (
              <Card>
                <BlockStack gap="400">
                  <Text as="h2" variant="headingLg">Manage Ask Prices ({dbProducts.length})</Text>
                  <Text as="p" variant="bodyMd" tone="subdued">
                    Edit ask prices for products already synced to the database.
                  </Text>
                  
                  <DataTable
                    columnContentTypes={['text', 'text', 'text', 'text']}
                    headings={['Product Title', 'Base Price', 'Ask Price', 'Actions']}
                    rows={tableRows}
                  />
                </BlockStack>
              </Card>
            ) : (
              <Card>
                <EmptyState
                  heading="No products synced yet"
                  action={{
                    content: 'Sync Products Now',
                    onAction: () => {
                      const form = document.createElement('form');
                      form.method = 'POST';
                      form.style.display = 'none';
                      
                      const actionInput = document.createElement('input');
                      actionInput.name = 'actionType';
                      actionInput.value = 'syncAll';
                      form.appendChild(actionInput);
                      
                      document.body.appendChild(form);
                      form.submit();
                    }
                  }}
                  image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                >
                  <Text as="p">
                    Sync your Shopify products to start managing ask and bid prices.
                  </Text>
                </EmptyState>
              </Card>
            )}
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
