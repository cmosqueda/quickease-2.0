export function addItem<T extends { id: string }>(
  state: any,
  key: "notes" | "quizzes" | "flashcards",
  item: T
) {
  if (state.user) {
    state.user[key] = [...(state.user[key] ?? []), item];
  }
}

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
