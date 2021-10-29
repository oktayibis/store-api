import express from "express"


export async function getUser(req: express.Request, res:express.Response) {
  res.send("user info")
}