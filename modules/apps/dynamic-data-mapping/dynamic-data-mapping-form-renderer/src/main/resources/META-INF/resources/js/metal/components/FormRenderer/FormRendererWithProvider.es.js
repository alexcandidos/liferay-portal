import FormRenderer from './FormRenderer.es';
import {PagesVisitor} from '../../util/visitors.es';

class FormRendererWithProvider extends FormRenderer {
	created() {
		this.on('fieldEdited', this._handleFieldEdited);
		this.on('fieldRepeated', this._handleFieldEdited);
	}

	_handleFieldEdited(properties) {
		const pageVisitor = new PagesVisitor(this.pages);

		const pages = pageVisitor.mapFields(
			field => {
				if (field.fieldName === properties.fieldInstance.fieldName) {
					field = {
						...field,
						value: properties.value
					};
				}

				return field;
			}
		);

		this.pages = pages;
	}
}

export default FormRendererWithProvider;