const ICONS = {
    cart: '<path d="M6 7h12l-1.2 12.2a1 1 0 0 1-1 .8H8.2a1 1 0 0 1-1-.8L6 7z"/><path d="M9 7V5.5a3 3 0 0 1 6 0V7"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    trash: '<path d="M4 7h16"/><path d="M9 7V5h6v2"/><path d="M7 7l1 13h8l1-13"/>',
    check: '<path d="M5 12.5l4.2 4.2L19 7"/>',
    filter: '<path d="M4 6h16"/><path d="M7 12h10"/><path d="M10 18h4"/>',
    refresh: '<path d="M20 12a8 8 0 1 1-2.2-5.5"/><path d="M20 4v5h-5"/>',
    star: '<path d="M12 2.8l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 16.8 6.6 19.6l1-6.1L3.2 9.2l6.1-.9z"/>',
    "chevron-left": '<path d="M14.5 6l-6 6 6 6"/>',
    "chevron-right": '<path d="M9.5 6l6 6-6 6"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5"/><path d="M12 8h.01"/>'
};

export function icon(name) {
    const body = ICONS[name] || "";
    const filled = name === "star";
    const attrs = filled
        ? 'fill="currentColor" stroke="none"'
        : 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';

    return `<svg class="icon" viewBox="0 0 24 24" ${attrs} aria-hidden="true" focusable="false">${body}</svg>`;
}
