import express from "express";





export async function deleteFromCart(req: express.Request, res: express.Response) {
  const { params: { cartItemId } } = req;

  return res.send(cartItemId);
}

export async function getCart(req: express.Request, res: express.Response) {
  return res.send("cart items");
}

export async function updateCart(req: express.Request, res: express.Response) {
  const { body } = req;

  res.send(body);
}



