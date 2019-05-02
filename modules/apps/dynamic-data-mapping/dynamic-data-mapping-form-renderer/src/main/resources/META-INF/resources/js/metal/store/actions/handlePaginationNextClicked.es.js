export default (activePage, pages) => {
	return Math.min(activePage + 1, pages.length - 1);
};