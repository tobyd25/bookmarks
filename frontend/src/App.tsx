import { useEffect, useRef, useState } from "react";
import "./App.css";
import CreateItemModal from "./components/CreateItemModal";
import EditItemModal from "./components/EditItemModal";
import { type ItemData } from "./types/item";

interface Entry {
	id: number;
	title: string;
	content: string;
	type: string;
	note: string;
	created_at: string;
}

function App() {
	const [searchTerm, setSearchTerm] = useState("");

	const [entries, setEntries] = useState<Entry[]>([]);

	const createItemModalRef = useRef<HTMLDialogElement>(null);
	const [editingItem, setEditingItem] = useState<{
		data: ItemData;
		id: number;
	} | null>(null);
	const editItemModalRef = useRef<HTMLDialogElement>(null);

	const openCreateModal = () => createItemModalRef.current?.showModal();
	const openEditModal = (item: Entry) => {
		setEditingItem({
			data: {
				title: item.title,
				content: item.content,
				type: parseInt(item.type),
				note: item.note,
			},
			id: item.id,
		});

		// fix modal not showing on first click
		setTimeout(() => editItemModalRef.current?.showModal(), 0);
	};

	const getEntries = async () => {
		try {
			const response = await fetch("/api/items");
			if (!response.ok) {
				throw new Error(`HTTP error: ${response.status}`);
			}
			const data = await response.json();
			setEntries(data);
		} catch (error) {
			console.error(`Error fetching entries: ${error}`);
		}
	};

	const handleDelete = async (itemId: number) => {
		try {
			const response = await fetch(`/api/items/${itemId}`, {
				method: "DELETE",
			});
			if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
			getEntries();
		} catch (error) {
			console.error(`Failed to delete item: ${error}`);
		}
	};

	useEffect(() => {
		getEntries();
	}, []);

	const filteredEntries = entries.filter(
		(entry) =>
			entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
			entry.note.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<div className="m-8 mx-48">
			<div className="flex">
				<label className="input mx-4">
					<svg
						className="h-[1em] opacity-50"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
					>
						<g
							strokeLinejoin="round"
							strokeLinecap="round"
							strokeWidth="2.5"
							fill="none"
							stroke="currentColor"
						>
							<circle cx="11" cy="11" r="8"></circle>
							<path d="m21 21-4.3-4.3"></path>
						</g>
					</svg>
					<input
						type="search"
						className="grow"
						placeholder="Search"
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</label>

				<button className="btn" onClick={openCreateModal}>
					Create Item
				</button>
			</div>

			<CreateItemModal ref={createItemModalRef} onCreate={getEntries} />

			{editingItem && (
				<EditItemModal
					ref={editItemModalRef}
					onEdit={() => {
						getEntries();
						setEditingItem(null);
					}}
					itemData={editingItem.data}
					itemId={editingItem.id}
				/>
			)}

			<ul className="list divide-y divide-gray-300">
				{filteredEntries.map((entry) => (
					<li className="list-row flex justify-between" key={entry.id}>
						<div>
							<div className="text-[1.5rem]">{entry.title}</div>
							<div className="text-[1rem]">{entry.content}</div>
							<div className="text-[1rem] text-gray-500">
								Created: {entry.created_at}
							</div>
						</div>
						<div className="flex gap-4">
							<button className="btn" onClick={() => openEditModal(entry)}>
								Edit
							</button>
							<button
								className="btn btn-error text-white"
								onClick={() => handleDelete(entry.id)}
							>
								Delete
							</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}

export default App;
