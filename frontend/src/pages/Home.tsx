import { useEffect, useState } from "react";

export default function Home() {
	const [news, setNews] = useState<any[]>([]);
	const [companies, setCompanies] = useState<any[]>([]);
	const [shares, setShares] = useState<any[]>([]);

	useEffect(() => {
		fetch(`/api/news`).then(r => r.json()).then(setNews);
		fetch(`/api/topcompany`).then(r => r.json()).then(setCompanies);
		fetch(`/api/topshare`).then(r => r.json()).then(setShares);
	}, []);

	return (
	<div className="grid md:grid-cols-3 gap-6 mt-6">
		{/* Stock Update */}
		<section className="border-2 border-orange-400 rounded-md shadow-md">
		<div className="bg-orange-500 text-white font-bold p-2">📈 Stock Update</div>
		<div className="p-4">
			{shares.length === 0 ? (
			<p>Loading…</p>
			) : (
			<table className="w-full text-sm text-left">
				<thead className="bg-orange-100">
				<tr>
					<th className="px-3 py-2">Company</th>
					<th className="px-3 py-2">Price</th>
					<th className="px-3 py-2">Market Capital</th>
				</tr>
				</thead>
				<tbody>
				{shares.map((s) => (
					<tr key={s.id} className="border-t hover:bg-orange-50 h-9">
					<td className="px-3 py-2">{s.companyName}</td>
					<td className="px-3 py-2">$ {s.price}</td>
					<td className="px-3 py-2">$ {s.marketCapital}  B</td>
					</tr>
				))}
				</tbody>
			</table>
			)}
		</div>
		</section>
		{/* Top Company */}
		<section className="border-2 border-orange-400 rounded-md shadow-md">
		<div className="bg-orange-500 text-white font-bold p-2">📊 Top Company</div>
		<div className="p-6 text-gray-700 text-left space-y-3">
			{companies.length > 0 ? (
			<>
				<p>Name: <strong>{companies[0].companyName}</strong></p>
				<p>Stock Symbol: <strong>{companies[0].stockSym}</strong></p>
				<p>Capital: <strong>{companies[0].capital} B</strong></p>
				<p>Share Volume: <strong>{companies[0].shareVolume}</strong></p>
				<p>Price: <strong>${companies[0].price}</strong></p>
				<p>Dividend: <strong>${companies[0].dividend}</strong></p>
				<p>Dividend Yield: <strong>{companies[0].dividendYield}%</strong></p>
				<p>Sector: <strong>{companies[0].sector}</strong></p>
				<p>Country: <strong>{companies[0].country}</strong></p>
			</>
			) : (
			<p>Loading…</p>
			)}
		</div>
		</section>
		{/* News Box */}
		<section className="border-2 border-orange-400 rounded-md shadow-md">
		<div className="bg-orange-500 text-white font-bold p-2">📰 News</div>
		<div className="p-4 space-y-3">
			{news.length === 0 ? (
			<p>Loading…</p>
			) : (
			news.map((n) => (
				<article key={n.id}>
				<h3 className="font-semibold text-orange-600">{n.headline}</h3>
				<p className="text-sm text-gray-700 mt-1 whitespace-pre-line text-justify leading-relaxed">
					{n.intro}
				</p>
				</article>
			))
			)}
		</div>
		</section>
	</div>
	);
}
