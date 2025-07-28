// app/utils/api.js

export async function fetchProducts(session, first = 20) {
  const query = `
    query getProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            status
            featuredImage {
              url
              altText
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  price
                  compareAtPrice
                  inventoryQuantity
                }
              }
            }
            tags
            productType
            vendor
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
      }
    }
  `;

  try {
    const response = await session.admin.graphql(query, {
      variables: { first }
    });
    
    const responseJson = await response.json();
    
    if (responseJson.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(responseJson.errors)}`);
    }

    return responseJson.data.products.edges.map(edge => {
      const product = edge.node;
      const variant = product.variants.edges[0]?.node;
      
      return {
        shopifyId: product.id.replace("gid://shopify/Product/", ""),
        title: product.title,
        handle: product.handle,
        status: product.status,
        basePrice: variant ? parseFloat(variant.price) : 0,
        imageUrl: product.featuredImage?.url || null,
        productType: product.productType,
        vendor: product.vendor,
        tags: product.tags,
        inventoryQuantity: variant?.inventoryQuantity || 0
      };
    });
  } catch (error) {
    console.error("Error fetching products from Shopify:", error);
    throw error;
  }
}

export async function fetchSingleProduct(session, productId) {
  const query = `
    query getProduct($id: ID!) {
      product(id: $id) {
        id
        title
        handle
        status
        featuredImage {
          url
          altText
        }
        variants(first: 1) {
          edges {
            node {
              id
              price
              compareAtPrice
              inventoryQuantity
            }
          }
        }
        tags
        productType
        vendor
        description
      }
    }
  `;

  try {
    const response = await session.admin.graphql(query, {
      variables: { id: `gid://shopify/Product/${productId}` }
    });
    
    const responseJson = await response.json();
    
    if (responseJson.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(responseJson.errors)}`);
    }

    const product = responseJson.data.product;
    if (!product) return null;

    const variant = product.variants.edges[0]?.node;
    
    return {
      shopifyId: product.id.replace("gid://shopify/Product/", ""),
      title: product.title,
      handle: product.handle,
      status: product.status,
      basePrice: variant ? parseFloat(variant.price) : 0,
      imageUrl: product.featuredImage?.url || null,
      productType: product.productType,
      vendor: product.vendor,
      tags: product.tags,
      description: product.description,
      inventoryQuantity: variant?.inventoryQuantity || 0
    };
  } catch (error) {
    console.error("Error fetching single product from Shopify:", error);
    throw error;
  }
}

export function calculateAskPrice(basePrice, markup = 0.2) {
  return parseFloat((basePrice * (1 + markup)).toFixed(2));
}
