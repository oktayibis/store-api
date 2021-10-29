import express from "express"

// -- /api/v1/products
export async function getAllProducts(req: express.Request, res:express.Response) {
  res.send("Product")
}

export async function addProduct(req:express.Request, res:express.Response) {
  const { body } = req;

  // Add Product
  res.send(body)
}

export async function updateProductWithId(req:express.Request, res:express.Response) {
  const { body } = req;
  const { params: { productId } } = req;

  // Update Function
  res.send(body)
}

export async function deleteProductWithId(req:express.Request, res:express.Response) {
  const { params: { productId } } = req;
  // Delete function
  res.send(productId)
}