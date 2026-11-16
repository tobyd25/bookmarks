import { forwardRef, useState, type MouseEvent, type RefObject } from "react";

import { type ItemType, type ItemData } from "../types/item";
import { useItemTypes } from "../hooks/useItemTypes";

interface Props {
	onCreate: () => void;
}

const CreateItemModal = forwardRef<HTMLDialogElement, Props>(
	({ onCreate }: Props, ref) => {
		const {
			itemTypes,
			isLoading: itemTypesLoading,
			error: itemTypesError,
		} = useItemTypes();

		const [title, setTitle] = useState("");
		const [content, setContent] = useState("");
		const [selectedType, setSelectedType] = useState<ItemType>({
			id: 0,
			name: "None",
		});
		const [note, setNote] = useState("");

		const createItem = async (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();

			const itemData: ItemData = {
				title,
				content,
				type: selectedType.id,
				note,
			};

			try {
				const response = await fetch("/api/items", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(itemData),
				});

				if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

				const data = await response.json();

				if (!data.lastInsertRowid)
					throw new Error("Server did not return a valid item ID");
			} catch (error) {
				console.error(`Failed to create item: ${error}`);
				return;
			}

			onCreate();
			(ref as RefObject<HTMLDialogElement>).current?.close();
		};

		const selectType = (e: MouseEvent, type: ItemType) => {
			e.preventDefault();
			setSelectedType(type);
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
							/>

							<label className="label">Type</label>
							<div className="dropdown">
								<div
									id="type"
									tabIndex={0}
									className="btn btn-outline text-gray-600 border-gray-300 m-0"
								>
									{selectedType.name}
								</div>
								<ul tabIndex={-1} className="dropdown-content menu bg-gray-100">
									{itemTypes.map((type) => (
										<li key={type.id}>
											<button onClick={(e) => selectType(e, type)}>
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
	},
);

export default CreateItemModal;
