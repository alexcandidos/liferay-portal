import handleFieldEdited from './actions/handleFieldEdited.es';
import handleFieldRemoved from './actions/handleFieldRemoved.es';
import handleFieldRepeated from './actions/handleFieldRepeated.es';
import handlePaginationItemClicked from './actions/handlePaginationItemClicked.es';
import handlePaginationNextClicked from './actions/handlePaginationNextClicked.es';
import handlePaginationPreviousClicked from './actions/handlePaginationPreviousClicked.es';

export default Component => {
	return class withStore extends Component {
		created() {
			super.created();

			this.on('fieldEdited', this._handleFieldEdited.bind(this));
			this.on('fieldRepeated', this._handleFieldRepeated.bind(this));
			this.on('fieldRemoved', this._handleFieldRemoved.bind(this));
			this.on('paginationNextClicked', this._handlePaginationNextClicked.bind(this));
			this.on('paginationItemClicked', this._handlePaginationItemClicked.bind(this));
			this.on('paginationPreviousClicked', this._handlePaginationPreviousClicked.bind(this));
		}

		getChildContext() {
			return {
				dispatch: this.emit.bind(this),
				store: this
			};
		}

		_handleFieldEdited(properties) {
			this.setState(
				{
					pages: handleFieldEdited(this.pages, properties)
				}
			);
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

		_handlePaginationNextClicked() {
			const {activePage, pages} = this;

			this.setState(
				{
					activePage: handlePaginationNextClicked(activePage, pages)
				}
			);
		}

		_handlePaginationItemClicked({pageIndex}) {
			this.setState(
				{
					activePage: handlePaginationItemClicked(pageIndex)
				}
			);
		}

		_handlePaginationPreviousClicked() {
			const {activePage} = this;

			this.setState(
				{
					activePage: handlePaginationPreviousClicked(activePage)
				}
			);
		}
	};
};