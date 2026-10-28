import { forwardRef } from "react";

const CreateItemModal = forwardRef<HTMLDialogElement, {}>((_props, ref) => {
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
						/>

						<label className="label" htmlFor="content">
							Content
						</label>
						<textarea
							className="textarea w-full mb-4"
							id="content"
							placeholder="Content"
						></textarea>

						<label className="label" htmlFor="note">
							Note
						</label>
						<textarea
							className="textarea w-full mb-4"
							id="note"
							placeholder="Note"
						></textarea>

						<button className="btn" onClick={(e) => e.preventDefault()}>
							Create
						</button>
						<form method="dialog">
							<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
								✕
							</button>
							<button className="btn btn-error text-white w-full">
								Cancel
							</button>
						</form>
					</fieldset>
				</form>
			</div>
		</dialog>
	);
});

export default CreateItemModal;
