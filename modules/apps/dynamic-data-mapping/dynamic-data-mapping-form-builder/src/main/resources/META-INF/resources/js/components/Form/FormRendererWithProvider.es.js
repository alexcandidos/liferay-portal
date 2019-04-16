import FormRenderer from './FormRenderer.es';
import {PagesVisitor} from '../../util/visitors.es';

class FormRendererWithProvider extends FormRenderer {
	_handleFieldEdited(properties) {
		const pageVisitor = new PagesVisitor(this.pages);

		const pages = pageVisitor.mapFields(
			field => {
				if (field.fieldName === properties.fieldInstance.fieldName) {
					return {
						...field,
						value: properties.value
					};
				}
			}
		);

		this.pages = pages;
	}

	created() {
		this.on('fieldEdited', this._handleFieldEdited)
		this.on('fieldRepeated', this._handleFieldEdited)
	}
}

export default FormRendererWithProvider;