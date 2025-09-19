/**
 * USED ON `@/hooks/useAuth.tsx` and a simple generic template for DRY CRUD.
 * Adds an item to the specified collection (`notes`, `quizzes`, or `flashcards`) within the user's state.
 *
 * @template T - The type of the item, which must have an `id` property of type `string`.
 * @param state - The state object containing the user and their collections.
 * @param key - The key of the collection to add the item to. Must be one of `"notes"`, `"quizzes"`, or `"flashcards"`.
 * @param item - The item to add to the specified collection.
 */
export function addItem<T extends { id: string }>(
  state: any,
  key: "notes" | "quizzes" | "flashcards",
  item: T
) {
  if (state.user) {
    state.user[key] = [...(state.user[key] ?? []), item];
  }
}

/**
 * USED ON `@/hooks/useAuth.tsx` and a simple generic template for DRY CRUD.
 * Edits an item within a specified user collection in the state object.
 *
 * @template T - The type of items in the collection, which must have an `id` property.
 * @param state - The state object containing user data.
 * @param key - The key of the user collection to edit (`"notes"`, `"quizzes"`, or `"flashcards"`).
 * @param updatedItem - The updated item data, which must include an `id` property.
 *
 * @remarks
 * If the item with the specified `id` exists in the collection, it will be updated with the properties from `updatedItem`.
 * If the item does not exist, no changes are made.
 */
export function editItem<T extends { id: string }>(
  state: any,
  key: "notes" | "quizzes" | "flashcards",
  updatedItem: Partial<T> & { id: string }
) {
  if (state.user && state.user[key]) {
    const index = state.user[key].findIndex((x: T) => x.id === updatedItem.id);
    if (index !== -1) {
      state.user[key][index] = {
        ...state.user[key][index],
        ...updatedItem,
      };
    }
  }
}

export function deleteItem<T extends { id: string }>(
  state: any,
  key: "notes" | "quizzes" | "flashcards",
  id: string
) {
  if (state.user && state.user[key]) {
    state.user[key] = state.user[key].filter((x: T) => x.id !== id);
  }
}
