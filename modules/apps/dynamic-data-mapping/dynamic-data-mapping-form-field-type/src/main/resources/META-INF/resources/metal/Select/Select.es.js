import '../FieldBase/FieldBase.es';
import '../Text/Text.es';
import './SelectRegister.soy.js';
import 'clay-dropdown';
import 'clay-icon';
import 'clay-label';
import Component from 'metal-component';
import dom from 'metal-dom';
import Soy from 'metal-soy';
import templates from './Select.soy.js';
import {Config} from 'metal-state';
import {EventHandler} from 'metal-events';

class Select extends Component {
	static STATE = {

		/**
		 * @default 'string'
		 * @instance
		 * @memberof Select
		 * @type {?(string|undefined)}
		 */

		dataType: Config.string().value('string'),

		/**
		 * @default 'boolean'
		 * @instance
		 * @memberof Select
		 * @type {?(boolean|undefined)}
		 */

		evaluable: Config.bool().value(false),

		/**
		 * @default undefined
		 * @instance
		 * @memberof Select
		 * @type {?bool}
		 */

		expanded: Config.bool().internal().value(false),

		/**
		 * @default 'string'
		 * @instance
		 * @memberof Select
		 * @type {?(string|undefined)}
		 */

		dataSourceType: Config.string(),

		/**
		 * @default false
		 * @instance
		 * @memberof Select
		 * @type {?bool}
		 */

		readOnly: Config.bool().value(false),

		/**
		 * @default undefined
		 * @instance
		 * @memberof FieldBase
		 * @type {?(string|undefined)}
		 */

		tip: Config.string(),

		/**
		 * @default undefined
		 * @instance
		 * @memberof Select
		 * @type {?(string|undefined)}
		 */

		id: Config.string(),

		key: Config.string(),

		/**
		 * @default undefined
		 * @instance
		 * @memberof Text
		 * @type {?(string|undefined)}
		 */

		fieldName: Config.string(),

		fixedOptions: Config.arrayOf(
			Config.shapeOf(
				{
					active: Config.bool().value(false),
					disabled: Config.bool().value(false),
					id: Config.string(),
					inline: Config.bool().value(false),
					label: Config.string(),
					name: Config.string(),
					showLabel: Config.bool().value(true),
					value: Config.string()
				}
			)
		).value([]),

		/**
		 * @default undefined
		 * @instance
		 * @memberof Select
		 * @type {?array<object>}
		 */

		options: Config.arrayOf(
			Config.shapeOf(
				{
					active: Config.bool().value(false),
					disabled: Config.bool().value(false),
					id: Config.string(),
					inline: Config.bool().value(false),
					label: Config.string(),
					name: Config.string(),
					showLabel: Config.bool().value(true),
					value: Config.string()
				}
			)
		).value([]),

		/**
		 * @default undefined
		 * @instance
		 * @memberof Select
		 * @type {?(string|undefined)}
		 */

		label: Config.string(),

		/**
		 * @default undefined
		 * @instance
		 * @memberof Select
		 * @type {?(string|undefined)}
		 */

		multiple: Config.bool(),

		/**
		 * @default Choose an Option
		 * @instance
		 * @memberof Select
		 * @type {?string}
		 */

		placeholder: Config.string(),

		/**
		 * @default undefined
		 * @instance
		 * @memberof Select
		 * @type {?string}
		 */

		predefinedValue: Config.oneOfType([Config.array(), Config.string()]).value([]),

		/**
		 * @default false
		 * @instance
		 * @memberof Select
		 * @type {?bool}
		 */

		required: Config.bool().value(false),

		/**
		 * @default undefined
		 * @instance
		 * @memberof FieldBase
		 * @type {?(bool|undefined)}
		 */

		repeatable: Config.bool(),

		/**
		 * @default false
		 * @instance
		 * @memberof Select
		 * @type {?bool}
		 */

		showLabel: Config.bool().value(true),

		/**
		 * @default undefined
		 * @instance
		 * @memberof Select
		 * @type {?(string|undefined)}
		 */

		spritemap: Config.string(),

		/**
		 * @default {}
		 * @instance
		 * @memberof Select
		 * @type {object}
		 */

		strings: Config.object().value(
			{
				chooseAnOption: Liferay.Language.get('choose-an-option')
			}
		),

		/**
		 * @default undefined
		 * @instance
		 * @memberof Text
		 * @type {?(string|undefined)}
		 */

		type: Config.string().value('select'),

		/**
		 * @default undefined
		 * @instance
		 * @memberof Select
		 * @type {?(string|undefined)}
		 */

		value: Config.oneOfType([Config.array(), Config.string()]),

		visible: Config.bool().value(true)
	};

	willReceiveState({options}) {
		if (options && options.newVal) {
			this.setState(
				{
					options: options.newVal
				}
			);
		}
	}

	attached() {
		this._eventHandler = new EventHandler();

		this._eventHandler.add(
			dom.on(document, 'click', this._handleDocumentClicked.bind(this))
		);

		this.setState(
			{
				visible: true
			}
		);
	}

	disposeInternal() {
		super.disposeInternal();

		this._eventHandler.removeAllListeners();
	}

	prepareStateForRender(state) {
		const {predefinedValue, value} = state;
		const {fixedOptions, multiple, options} = this;
		const predefinedValueArray = this._getArrayValue(predefinedValue);
		let valueArray = this._getArrayValue(value);

		valueArray = this._isEmptyArray(valueArray) ? predefinedValueArray : valueArray;

		valueArray = valueArray.filter(
			(value, index) => {
				return (multiple ? true : index === 0);
			}
		);

		const emptyOption = {
			label: this.strings.chooseAnOption,
			value: ''
		};

		const newOptions = [
			...options
		].map(
			option => this._markSelectedOption(option, valueArray)
		).concat(
			fixedOptions.map(
				(option, index) => {
					return {
						...this._markSelectedOption(option, valueArray),
						separator: index === 0
					};
				}
			)
		).filter(
			({value}) => value !== ''
		);

		return {
			...state,
			options: [emptyOption, ...newOptions],
			value: valueArray
		};
	}

	_markSelectedOption(option, valueArray) {
		const {multiple} = this;

		return {
			...option,
			active: valueArray.includes(option.value),
			checked: multiple && valueArray.includes(option.value),
			type: multiple ? 'checkbox' : 'item'
		};
	}

	_getArrayValue(value) {
		let newValue = value || '';

		if (!Array.isArray(newValue)) {
			newValue = [newValue];
		}

		return newValue;
	}

	_handleDocumentClicked({target}) {
		const {base} = this.refs;
		const {dropdown} = base.refs;
		const {menu} = dropdown.refs.portal.refs;
		const {expanded} = this;

		if (expanded && !this.element.contains(target) && !dropdown.element.contains(target) && !menu.contains(target)) {
			this.setState({expanded: false});
		}
	}

	_isEmptyArray(array) {
		return array.some(value => value !== '') === false;
	}

	addValue(value) {
		const currentValue = this._getArrayValue(this.value);
		const newValue = [...currentValue, value];

		this.setState(
			{
				value: newValue
			}
		);

		this.emit(
			'fieldEdited',
			{
				fieldInstance: this,
				value: newValue
			}
		);
	}

	deleteValue(value) {
		const currentValue = this._getArrayValue(this.value);
		const newValue = currentValue.filter(v => v !== value);

		this.setState(
			{
				expanded: false,
				value: newValue
			},
			() => this.emit(
				'fieldEdited',
				{
					fieldInstance: this,
					value: newValue
				}
			)
		);
	}

	setValue(value) {
		const newValue = [value];

		this.setState(
			{
				value: newValue
			},
			() => this.emit(
				'fieldEdited',
				{
					fieldInstance: this,
					value: newValue
				}
			)
		);
	}

	_handleItemClicked(event) {
		const {multiple} = this;
		const currentValue = this._getArrayValue(this.value);

		if (multiple) {
			if (currentValue.includes(event.data.item.value)) {
				this.deleteValue(event.data.item.value);
			}
			else {
				this.addValue(event.data.item.value);
			}
		}
		else {
			this.setValue(event.data.item.value);
		}

		event.preventDefault();

		this.setState(
			{
				expanded: multiple
			}
		);
	}

	_handleLabelClosed({target, preventDefault, stopPropagation}) {
		const {value} = target.data;

		preventDefault();
		stopPropagation();

		this.deleteValue(value);
	}

	_handleClick() {
		if (!this.readOnly) {
			this.setState(
				{
					expanded: !this.expanded
				}
			);
		}
	}
}

Soy.register(Select, templates);

export default Select;