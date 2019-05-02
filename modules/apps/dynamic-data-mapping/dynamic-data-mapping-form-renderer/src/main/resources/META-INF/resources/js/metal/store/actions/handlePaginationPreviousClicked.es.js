export default ({activePage}, dispatch) => {
	dispatch('activePageUpdated', Math.max(activePage - 1, 0));
};