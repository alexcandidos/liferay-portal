import handleActivePageUpdated from './actions/handleActivePageUpdated.es';
import handleFieldEdited from './actions/handleFieldEdited.es';
import handleFieldRemoved from './actions/handleFieldRemoved.es';
import handleFieldRepeated from './actions/handleFieldRepeated.es';
import handlePaginationItemClicked from './actions/handlePaginationItemClicked.es';
import handlePaginationNextClicked from './actions/handlePaginationNextClicked.es';
import handlePaginationPreviousClicked from './actions/handlePaginationPreviousClicked.es';
import {evaluate} from '../util/evaluation.es';

const _handleFieldEdited = function(properties) {
	const evaluatorContext = this.getEvaluatorContext();

	handleFieldEdited(
		evaluatorContext,
		properties
	).then(
		evaluatedPages => {
			this.setState(
				{
					pages: evaluatedPages
				},
				() => this.emit('evaluated', evaluatedPages)
			);
		}
	);
};

export default Component => {
	return class withStore extends Component {
		attached() {
			super.attached();

			this.on('activePageUpdated', this._handleActivePageUpdated.bind(this));
			this.on('fieldEdited', _handleFieldEdited.bind(this));
			this.on('fieldRemoved', this._handleFieldRemoved.bind(this));
			this.on('fieldRepeated', this._handleFieldRepeated.bind(this));
			this.on('paginationItemClicked', this._handlePaginationItemClicked.bind(this));
			this.on('paginationNextClicked', this._handlePaginationNextClicked.bind(this));
			this.on('paginationPreviousClicked', this._handlePaginationPreviousClicked.bind(this));
		}

		dispatch(event, payload) {
			this.emit(event, payload);
		}

		evaluate() {
			return evaluate(null, this.getEvaluatorContext());
		}

		getChildContext() {
			return {
				dispatch: this.dispatch.bind(this),
				store: this
			};
		}

		getEvaluatorContext() {
			const {pages, portletNamespace, rules} = this;

			return {
				pages,
				portletNamespace,
				rules
			};
		}

		_handleActivePageUpdated(event) {
			this.setState(handleActivePageUpdated(event));
		}

		_handleFieldRemoved(name) {
			this.setState(
				{
					pages: handleFieldRemoved(this.pages, name)
				}
			);
		}

		_handleFieldRepeated(name) {
			this.setState(
				{
					pages: handleFieldRepeated(this.pages, name)
				}
			);
		}

		_handlePaginationItemClicked({pageIndex}) {
			handlePaginationItemClicked({pageIndex}, this.dispatch.bind(this));
		}

		_handlePaginationNextClicked() {
			const {activePage} = this;

			handlePaginationNextClicked(
				{
					activePage,
					...this.getEvaluatorContext()
				},
				this.dispatch.bind(this)
			);
		}

		_handlePaginationPreviousClicked() {
			const {activePage} = this;

			handlePaginationPreviousClicked(
				{
					activePage,
					...this.getEvaluatorContext()
				},
				this.dispatch.bind(this)
			);
		}
	};
};