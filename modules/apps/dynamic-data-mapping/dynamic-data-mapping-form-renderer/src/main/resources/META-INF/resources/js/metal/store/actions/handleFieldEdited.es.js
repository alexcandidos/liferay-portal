import {PagesVisitor} from '../../util/visitors.es';

export default (pages, properties) => {
	const {fieldInstance, value} = properties;
	const pageVisitor = new PagesVisitor(pages);

	return pageVisitor.mapFields(
		field => {
			if (field.name === fieldInstance.name) {
				field = {
					...field,
					value
				};
			}
			else if (field.nestedFields) {
				field = {
					...field,
					nestedFields: field.nestedFields.map(
						nestedField => {
							if (nestedField.name === fieldInstance.name) {
								nestedField = {
									...nestedField,
									value
								};
							}

							return nestedField;
						}
					)
				};
			}

			return field;
		}
	);
};