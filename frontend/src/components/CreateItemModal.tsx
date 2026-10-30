import {
	forwardRef,
	useEffect,
	useState,
	type MouseEvent,
	type RefObject,
} from "react";

interface Type {
	id: number;
	name: string;
}

const CreateItemModal = forwardRef<HTMLDialogElement, {}>((_props, ref) => {
	const [types, setTypes] = useState<Type[]>([]);

	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [type, setType] = useState(0);
	const [note, setNote] = useState("");

	useEffect(() => {
		const fetchTypes = async () => {
			try {
				const response = await fetch("/api/types");
				if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
				const data = await response.json();
				setTypes(data);
			} catch (error) {
				console.error(`Failed to fetch types: ${error}`);
			}
		};

		fetchTypes();
	}, []);

	const createItem = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		var id;
		try {
			const response = await fetch("/api/entries", { method: "POST" });
			if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
			const data = await response.json();
			id = data.lastInsertRowid;
		} catch (error) {
			console.error(`Failed to create item: ${error}`);
			return;
		}

		if (id == undefined) {
			console.error("Failed to get item id");
			return;
		}

		try {
			const itemData = {
				title: title,
				content: content,
				type: type,
				note: note,
			};

			const response = await fetch(`/api/entries/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(itemData),
			});

			if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
		} catch (error) {
			console.error(`Failed to edit item: ${error}`);
		}

		(ref as RefObject<HTMLDialogElement>).current?.close();
	};

	const selectType = (e: MouseEvent, id: number) => {
		e.preventDefault();
		setType(id);
	};

	return (
		<dialog className="modal" ref={ref}>
			<div className="modal-box p-8">
				<h3 className="font-bold mb-4">Create Item</h3>
				<form>
					<fieldset className="fieldset">
						<label className="label" htmlFor="title">
							Title
						</label>
						<input
							type="text"
							id="title"
							className="input w-full mb-4"
							placeholder="Title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
						/>

						<label className="label" htmlFor="content">
							Content
						</label>
						<textarea
							className="textarea w-full mb-4"
							id="content"
							placeholder="Content"
							value={content}
							onChange={(e) => setContent(e.target.value)}
						></textarea>

						<label className="label">Type</label>
						<div className="dropdown">
							<div
								id="type"
								tabIndex={0}
								className="btn btn-outline text-gray-600 border-gray-300 m-0"
							>
								Select
							</div>
							<ul tabIndex={-1} className="dropdown-content menu bg-gray-100">
								{types.map((type) => (
									<li key={type.id}>
										<button onClick={(e) => selectType(e, type.id)}>
											{type.name}
										</button>
									</li>
								))}
							</ul>
						</div>

						<label className="label" htmlFor="note">
							Note
						</label>
						<textarea
							className="textarea w-full mb-4"
							id="note"
							placeholder="Note"
							value={note}
							onChange={(e) => setNote(e.target.value)}
						></textarea>

						<button className="btn" onClick={createItem}>
							Create
						</button>
					</fieldset>
				</form>
				<form method="dialog">
					<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
						✕
					</button>
					<button className="btn btn-error text-white w-full">Cancel</button>
				</form>
			</div>
		</dialog>
	);
});

export default CreateItemModal;
