import Component from 'metal-component';
import Soy from 'metal-soy';
import templates from './WizardPage.soy.js';
import {Config} from 'metal-state';

class WizardPage extends Component {
	_handleNextButtonClicked() {
		const {dispatch} = this.context;

		dispatch('paginationNextClicked');
	}

	_handlePreviousButtonClicked() {
		const {dispatch} = this.context;

		dispatch('paginationPreviousClicked');
	}
}

WizardPage.STATE = {
	activePage: Config.number(),
	editable: Config.bool(),
	empty: Config.bool(),
	page: Config.object(),
	pageIndex: Config.number(),
	paginationMode: Config.string(),
	spritemap: Config.string(),
	total: Config.number()
};

Soy.register(WizardPage, templates);

export default WizardPage;