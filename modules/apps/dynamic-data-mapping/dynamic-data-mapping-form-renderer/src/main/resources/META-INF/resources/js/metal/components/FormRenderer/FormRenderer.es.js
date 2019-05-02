import '../../containers/Pagination/Pagination.es';
import '../../containers/Wizard/Wizard.es';
import '../PageRenderer/PageRenderer.es';
import 'clay-button';
import Component from 'metal-component';
import Soy from 'metal-soy';
import templates from './FormRenderer.soy.js';
import {Config} from 'metal-state';

/**
 * FormRenderer.
 * @extends Component
 */

class FormRenderer extends Component {
	_handleFieldBlurred(event) {
		this.emit('fieldBlurred', event);
	}

	_handleFieldClicked(index) {
		this.emit('fieldClicked', index);
	}

	_handleFieldEdited(event) {
		this.emit('fieldEdited', event);
	}
}

FormRenderer.STATE = {

	/**
	 * @default
	 * @instance
	 * @memberof FormRenderer
	 * @type {?number}
	 */

	activePage: Config.number().value(0),

	/**
	 * @default false
	 * @instance
	 * @memberof FormRenderer
	 * @type {?bool}
	 */

	editable: Config.bool().value(false),

	/**
	 * @default []
	 * @instance
	 * @memberof FormRenderer
	 * @type {?array<object>}
	 */

	pages: Config.array().value([]),

	/**
	 * @default undefined
	 * @instance
	 * @memberof FormRenderer
	 * @type {!string}
	 */

	spritemap: Config.string().required()
};

Soy.register(FormRenderer, templates);

export default FormRenderer;