import express from "express";
import ProductSchemas from "../schemas/Product.schemas";
import { ProductValidation, ProductStockItemValidation } from "../validations/product.validation";

import { ErrorResponse, ErrorResponseWithMessage, SuccessResponse, ValidationErrorResponse, calculateNetPrice } from "../utils/helpers";
import { IProduct } from "../Interfaces";
// -- /api/v1/products
export async function getAllProducts(req: express.Request, res: express.Response) {
  try {
    const list = await ProductSchemas.find({});
    console.log(list);

    if (!list || list.length === 0) {
      return res.status(404).send(ErrorResponseWithMessage("Ürün Girişi yapılmamış"));
    }
    return res.status(200).send(SuccessResponse(list));

  } catch (error: any) {
    return res.status(500).send(ErrorResponse(error));
  }
}

export async function addProduct(req: express.Request, res: express.Response) {
  const { body } = req;
  const anyError = ProductValidation.validate(body).error;
  if (anyError) {
    return res.status(400).send(ValidationErrorResponse(anyError));
  }

  try {
    const product = new ProductSchemas(body);
    product.netPrice = calculateNetPrice(product.isDiscount, product.price, product.discountAmount);
    console.log("product", product);

    const savedProduct = await product.save();

    return res.status(201).send(SuccessResponse(savedProduct));

  } catch (error: any) {
    return res.status(500).send(ErrorResponse(error));
  }
}


export async function deleteProductWithId(req: express.Request, res: express.Response) {
  const { params: { productId } } = req;
  // Delete function
  if (!productId) {
    return res.status(400).send(ErrorResponseWithMessage("Lütfen Ürünün Id bilgisini gönderiniz."));
  }
  try {
    const deletedItem = await ProductSchemas.findByIdAndDelete(productId);
    return res.status(200).send(SuccessResponse(deletedItem));


  } catch (error: any) {
    return res.status(500).send(ErrorResponse(error));
  }
}

export async function getProductById(req: express.Request, res: express.Response) {
  const { params: { productId } } = req;

  if (!productId) {
    return res.status(400).send(ErrorResponseWithMessage("Lütfen ürünün ID bilgisini gönderiniz."));
  }

  try {
    const product = await ProductSchemas.findById(productId);
    return res.status(200).send(SuccessResponse(product));
  } catch (error: any) {
    return res.status(500).send(ErrorResponse(error));
  }
}

export async function getProductBySlug(req: express.Request, res: express.Response) {
  const { params: { slug } } = req;

  if (!slug) {
    return res.status(400).send(ErrorResponseWithMessage("Lütfen ürünün ID bilgisini gönderiniz."));
  }

  try {
    const product = await ProductSchemas.findOne({ slug });
    return res.status(200).send(SuccessResponse(product));
  } catch (error: any) {
    return res.status(500).send(ErrorResponse(error));
  }
}


export async function updateProduct(req: express.Request, res: express.Response) {
  const { body } = req;
  const { params: { productId } } = req;
  const anyError = ProductValidation.validate(body).error;
  if (anyError) {
    return res.status(400).send(ValidationErrorResponse(anyError));
  }
  if (!productId) {
    return res.status(400).send(ErrorResponseWithMessage("Lütfen ürün ID bilgisini gönderin."));
  }

  try {
    const product: IProduct = { ...body, netPrice: calculateNetPrice(body.isDiscount, body.price, body.discountAmount) };

    const updatedProduct = await ProductSchemas.findByIdAndUpdate(productId, product, { new: true });

    return res.status(200).send(SuccessResponse(updatedProduct));
  } catch (error: any) {
    console.log(error);

    return res.status(500).send(ErrorResponse(error));
  }
}

export async function addToStock(req: express.Request, res: express.Response) {
  const { params: { productId }, body } = req;
  if (!productId) {
    return res.status(400).send(ErrorResponseWithMessage("Lütfen ürün ID Bilgisini belirtiniz."));
  }
  const anyError = ProductStockItemValidation.validate(body).error;
  if (anyError) {
    return res.status(400).send(ValidationErrorResponse(anyError));
  }
  try {

    const product = await ProductSchemas.findById(productId);
    if (!product) {
      return res.status(404).send(ErrorResponseWithMessage("Ürün bulunamadı."));
    }
    const updatedObject = product.toObject();
    const isStockExist = updatedObject.stockStatus?.find(x => x.color?.toString() === body.color && x.size === body.size);
    if (isStockExist) {
      isStockExist.quantity += body.quantity;
    } else {
      updatedObject.stockStatus?.push(body);
    }
    const response = await product.update(updatedObject);

  } catch (error: any) {
    return res.status(500).send(ErrorResponse(error));

  }
}
