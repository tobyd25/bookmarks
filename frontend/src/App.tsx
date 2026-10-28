import { useEffect, useRef, useState } from "react";
import "./App.css";
import CreateItemModal from "./components/CreateItemModal";

interface Entry {
	id: number;
	title: string;
	content: string;
	type: string;
	note: string;
	created_at: string;
}

function App() {
	const [entries, setEntries] = useState<Entry[]>([]);
	const createItemModalRef = useRef<HTMLDialogElement>(null);

	const openCreateModal = () => createItemModalRef.current?.showModal();

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
		<div className="m-8 mx-48">
			<button className="btn" onClick={openCreateModal}>
				Create Item
			</button>

			<CreateItemModal ref={createItemModalRef} />

			<ul className="list divide-y divide-gray-300">
				{entries.map((entry) => (
					<li className="list-row" key={entry.id}>
						<div>
							<div className="text-[1.5rem]">{entry.title}</div>
							<div className="text-[1rem]">{entry.content}</div>
							<div className="text-[1rem] text-gray-500">
								{entry.created_at}
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}

export default App;
