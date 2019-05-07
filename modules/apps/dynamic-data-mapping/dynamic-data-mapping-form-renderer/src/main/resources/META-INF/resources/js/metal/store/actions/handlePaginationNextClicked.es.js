import {evaluate} from '../../util/evaluation.es';

export default (evaluatorContext, dispatch) => {
	const {activePage, pages} = evaluatorContext;

	return evaluate(null, evaluatorContext).then(
		evaluatedPages => {
			const nextActivePageIndex = evaluatedPages.findIndex(
				({enabled}, index) => {
					let found = false;

					if (enabled && index > activePage) {
						found = true;
					}

					return found;
				}
			);

			dispatch('activePageUpdated', Math.min(nextActivePageIndex, pages.length - 1));
		}
	);
};