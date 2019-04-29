import handleFieldEdited from './handleFieldEdited.es';
import handleFieldRepeated from './handleFieldRepeated.es';
import handleFieldRemoved from './handleFieldRemoved.es';

export default Component => {
	return class withStore extends Component {
		created() {
			super.created();

			this.on('fieldEdited', this._handleFieldEdited.bind(this));
			this.on('fieldRepeated', this._handleFieldRepeated.bind(this));
			this.on('fieldRemoved', this._handleFieldRemoved.bind(this));
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
	};
};