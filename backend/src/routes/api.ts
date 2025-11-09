import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();
export const api = Router();

api.get("/news", async (_req, res) => {
	const rows = await prisma.news.findMany({ orderBy: { date: "desc" } });
	res.json(rows);
});

api.get("/topcompany", async (_req, res) => {
	const rows = await prisma.topcompany.findMany({ orderBy: { capital: "desc" } });
	res.json(rows);
});

api.get("/topshare", async (_req, res) => {
	const shares = await prisma.topshare.findMany({ orderBy: { price: "desc" } });
	res.json(shares);
});
