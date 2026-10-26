import { useEffect } from "react";

function App() {
	useEffect(() => {
		getEntries();
	}, []);

	return <></>;
}

const getEntries = async () => {
	try {
		const response = await fetch("/api/entries");
		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}
		const data = await response.json();
		console.log(data);
	} catch (error) {
		console.error(`Error fetching entries: ${error}`);
	}
};

export default App;
