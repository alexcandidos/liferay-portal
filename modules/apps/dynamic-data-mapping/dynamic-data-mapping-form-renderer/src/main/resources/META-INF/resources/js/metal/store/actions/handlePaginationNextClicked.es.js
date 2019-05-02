export default ({activePage, pages}, dispatch) => {
	dispatch('activePageUpdated', Math.min(activePage + 1, pages.length - 1));
};