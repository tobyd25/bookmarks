import { useEffect, useState } from "react";
import "./App.css";

interface Entry {
	id: number;
	title: string;
	content: string;
	type: string;
	note: string;
}

function App() {
	const [entries, setEntries] = useState<Entry[]>([]);

	useEffect(() => {
		const getEntries = async () => {
			try {
				const response = await fetch("/api/entries");
				if (!response.ok) {
					throw new Error(`HTTP error: ${response.status}`);
				}
				const data = await response.json();
				setEntries(data);
			} catch (error) {
				console.error(`Error fetching entries: ${error}`);
			}
		};

		getEntries();
	}, []);

	return (
		<>
			{entries.map((entry) => (
				<div key={entry.id}>{entry.title}</div>
			))}
		</>
	);
}

export default App;
