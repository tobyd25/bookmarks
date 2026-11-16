import { useEffect, useState } from "react";
import { type ItemType } from "../types/item";

interface useItemTypesReturn {
	itemTypes: ItemType[];
	isLoading: boolean;
	error: string | null;
}

export const useItemTypes = (): useItemTypesReturn => {
	const [itemTypes, setItemTypes] = useState<ItemType[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	useEffect(() => {
		const fetchTypes = async () => {
			try {
				const response = await fetch("/api/types");
				if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
				const data = await response.json();
				setItemTypes(data);
			} catch (error) {
				if (error instanceof Error) {
					setError(error.message);
				} else {
					setError("An unknown error occured.");
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchTypes();
	}, []);

	return { itemTypes, isLoading, error };
};
