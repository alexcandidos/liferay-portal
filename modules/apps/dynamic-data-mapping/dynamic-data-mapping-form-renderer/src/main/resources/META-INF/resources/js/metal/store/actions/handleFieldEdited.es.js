import {evaluate} from '../../util/evaluation.es';
import {PagesVisitor} from '../../util/visitors.es';

export default (evaluatorContext, properties) => {
	const {fieldInstance, value} = properties;
	const {fieldName} = fieldInstance;
	const {pages} = evaluatorContext;
	const pageVisitor = new PagesVisitor(pages);

	const editedPages = pageVisitor.mapFields(
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

	return evaluate(
		fieldName,
		{
			...evaluatorContext,
			pages: editedPages
		}
	);
};