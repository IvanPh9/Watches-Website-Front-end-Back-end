let WATCH_TYPES = [];
let WATCH_MATERIALS = [];
let WATCH_COLORS = [];

export async function initConstants() {
    try {
        const response = await fetch('http://localhost:3000/api/filters');
        if (response.ok) {
            const filters = await response.json();

            // Перезаписуємо наші змінні даними з БД
            WATCH_TYPES = filters.types || [];
            WATCH_MATERIALS = filters.materials || [];
            WATCH_COLORS = filters.colors || [];

            console.log("Константи успішно підтягнуто з БД!");
        } else {
            console.error("Не вдалося завантажити фільтри, статус:", response.status);
        }
    } catch (error) {
        console.error("Бекенд недоступний. Фільтри порожні:", error);
    }
}

export { WATCH_TYPES, WATCH_MATERIALS, WATCH_COLORS };