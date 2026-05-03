import { WATCH_TYPES, WATCH_MATERIALS, WATCH_COLORS } from "../utils/constants.js";

window.renderFilters = function(currentParams, submitHandler, resetHandler) {
    const container = document.getElementById('filters-container');
    if (!container) return;

    let activeFiltersCount = 0;
    if (currentParams.inStock) activeFiltersCount++;
    if (currentParams.minPrice) activeFiltersCount++;
    if (currentParams.maxPrice) activeFiltersCount++;
    if (currentParams.type) activeFiltersCount++;
    if (currentParams.material) activeFiltersCount++;
    if (currentParams.color) activeFiltersCount++;

    const counterHTML = activeFiltersCount > 0
        ? `<p class="counter">${activeFiltersCount}</p>`
        : '';

    const typeOptions = WATCH_TYPES.map(t => `<option value="${t}" ${currentParams.type === t ? 'selected' : ''}>${t}</option>`).join('');
    const materialOptions = WATCH_MATERIALS.map(m => `<option value="${m}" ${currentParams.material === m ? 'selected' : ''}>${m}</option>`).join('');
    const colorOptions = WATCH_COLORS.map(c => `<option value="${c}" ${currentParams.color === c ? 'selected' : ''}>${c}</option>`).join('');

    container.innerHTML = `
        <form id="shared-filter-form" onsubmit="window.${submitHandler}(event)" class="modern-search-form">
            
            <div class="search-pill">
                <div class="search-row">
                    <input type="text" id="filter-search" value="${currentParams.search || ''}" placeholder="Search for a product by name" autocomplete="off">
                </div>
                
                <div class="controls-row">
                    <div class="controls-left">
                        <button type="button" class="btn-tools" onclick="document.getElementById('advanced-filters').classList.toggle('show')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-adjustments-horizontal"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M4 6l8 0" /><path d="M16 6l4 0" /><path d="M6 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M4 12l2 0" /><path d="M10 12l10 0" /><path d="M15 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M4 18l11 0" /><path d="M19 18l1 0" /></svg>
                            Filter
                            ${counterHTML}
                        </button>
                    </div>
                    
                    <div class="controls-right">
                        <select id="filter-sort" class="select-pro">
                            <option value="">Recommended</option>
                            <option value="price_asc" ${currentParams.sort === 'price_asc' ? 'selected' : ''}>Price: Low to High</option>
                            <option value="price_desc" ${currentParams.sort === 'price_desc' ? 'selected' : ''}>Price: High to Low</option>
                            <option value="title_asc" ${currentParams.sort === 'title_asc' ? 'selected' : ''}>Name: A to Z</option>
                            <option value="title_desc" ${currentParams.sort === 'title_desc' ? 'selected' : ''}>Name: Z to A</option>
                        </select>
                        
                        <button type="submit" class="btn-submit-icon" title="Apply Filters">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-send-2"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4.698 4.034l16.302 7.966l-16.302 7.966a.503 .503 0 0 1 -.546 -.124a.555 .555 0 0 1 -.12 -.568l2.468 -7.274l-2.468 -7.274a.555 .555 0 0 1 .12 -.568a.503 .503 0 0 1 .546 -.124" /><path d="M6.5 12h14.5" /></svg>                        </button>
                        
                        <button type="button" class="btn-reset-icon" onclick="window.${resetHandler}()" title="Скинути фільтри">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-reload"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" /><path d="M20 4v5h-5" /></svg>                        </button>
                    </div>
                </div>
            </div>

            <div id="advanced-filters" class="advanced-filters-panel">
                <div class="advanced-filters-grid">
                    
                    <div class="filter-group">
                        <label>Price Range (₴)</label>
                        <div class="price-inputs">
                            <input type="number" id="filter-min-price" value="${currentParams.minPrice || ''}" placeholder="Min" min="0">
                            <span>-</span>
                            <input type="number" id="filter-max-price" value="${currentParams.maxPrice || ''}" placeholder="Max" min="0">
                        </div>
                    </div>

                    <div class="filter-group">
                        <label>Watch Type</label>
                        <select id="filter-type">
                            <option value="">All Types</option>
                            ${typeOptions}
                        </select>
                    </div>

                    <div class="filter-group">
                        <label>Material</label>
                        <select id="filter-material">
                            <option value="">All Materials</option>
                            ${materialOptions}
                        </select>
                    </div>

                    <div class="filter-group">
                        <label>Dial Color</label>
                        <select id="filter-color">
                            <option value="">All Colors</option>
                            ${colorOptions}
                        </select>
                    </div>
                    
                    <div class="filter-group checkbox-group" style="justify-content: flex-end;">
                        <label class="toggle-checkbox">
                            <input type="checkbox" id="filter-instock" ${currentParams.inStock ? 'checked' : ''}>
                            In stock
                        </label>
                    </div>

                </div>
            </div>
        </form>
    `;
}

window.getFilterParamsFromForm = function() {
    return {
        search: document.getElementById('filter-search').value.trim(),
        inStock: document.getElementById('filter-instock').checked,
        type: document.getElementById('filter-type').value,
        material: document.getElementById('filter-material').value,
        color: document.getElementById('filter-color').value,
        minPrice: document.getElementById('filter-min-price').value,
        maxPrice: document.getElementById('filter-max-price').value,
        sort: document.getElementById('filter-sort').value
    };
}