import express from "express"

// -- /api/v1/products
export async function getAllProducts(req: express.Request, res:express.Response) {
  res.send("Product")
}