import {PagesVisitor} from '../../util/visitors.es';

export default (pages, properties) => {
	const {fieldInstance} = properties;
	const pageVisitor = new PagesVisitor(pages);

	const focusedFieldPages = pageVisitor.mapFields(
		field => {
			return {
				...field,
				focused: field.name === fieldInstance.name,
				wasFocused: true
			};
		}
	);

	return Promise.resolve(focusedFieldPages);
};