import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	console.log("Seeding database...");

	await prisma.news.create({
		data: {
			date: new Date(),
			headline: "Here Is Why This A.I. Stock Is Set To Jump 500%",
			intro:
			"Artificial intelligence stands as the most breathtaking tech revolution of our time. It’s on par with the original industrial revolution and is weaving itself into every corner of our daily existence.\nThis is why we have been researching stocks that have the strongest upside potential and recommending them to our readers.\nFor example, we recommended Oracle right around the time ChatGPT was initially released…. After our commendation the stock gained more than 300%.\nRight now, is the prime moment to ride the AI wave in Europe and make serious money.",
			details:
			"Artificial intelligence stands as the most breathtaking tech revolution of our time. It’s on par with the original industrial revolution and is weaving itself into every corner of our daily existence.\nThis is why we have been researching stocks that have the strongest upside potential and recommending them to our readers.\nFor example, we recommended Oracle right around the time ChatGPT was initially released…. After our commendation the stock gained more than 300%.\nRight now, is the prime moment to ride the AI wave in Europe and make serious money.",
		},
	});

	await prisma.topcompany.create({
		data: {
			companyName: "Elisa",
			stockSym: "ELISA.HE",
			capital: 7.2,
			shareVolume: 160514000,
			price: 44.37,
			dividend: 40.08,
			dividendYield: 6.17,
			sector: "Telecommunication",
			country: "Finland",
		},
	});

	await prisma.topshare.createMany({
		data: [
			{ companyName: "Nordea Bank", price: 17.37, marketCapital: 59.71 },
			{ companyName: "Nokia", price: 7.09, marketCapital: 38.27 },
			{ companyName: "KONE", price: 67.61 , marketCapital: 35.01 },
			{ companyName: "Elisa", price: 44.37, marketCapital: 7.12 },
			{ companyName: "Neste", price: 21.82, marketCapital: 16.76 },
			{ companyName: "Amer Sports", price: 32.38, marketCapital: 17.95 },
			{ companyName: "Fortum", price: 22.71, marketCapital: 20.37 },
			{ companyName: "Sampo", price: 11.37, marketCapital: 30.37 },
		],
	});
	console.log("Database seeded.");
	}

main()
	.catch(e => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
