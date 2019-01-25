import {FormSupport} from '../../Form/index.es';
import {PagesVisitor, RulesVisitor} from '../../../util/visitors.es';
import {generateFieldName, normalizeFieldName} from '../../../util/fieldSupport.es';
import Token from '../../../expressions/Token.es';
import Tokenizer from '../../../expressions/Tokenizer.es';

export const getFieldValue = (pages, fieldName) => {
	return getFieldProperty(pages, fieldName, 'value');
};

export const getFieldProperty = (pages, fieldName, propertyName) => {
	const visitor = new PagesVisitor(pages);
	let propertyValue;

	visitor.mapFields(
		field => {
			if (field.fieldName === fieldName) {
				propertyValue = field[propertyName];
			}
		}
	);

	return propertyValue;
};

export const renameFieldInsideExpression = (expression, fieldName, newFieldName) => {
	const tokens = Tokenizer.tokenize(expression);

	return Tokenizer.stringifyTokens(
		tokens.map(
			token => {
				if (token.type === Token.VARIABLE && token.value === fieldName) {
					token = new Token(Token.VARIABLE, newFieldName);
				}

				return token;
			}
		)
	);
};

export const updateRulesFieldName = (rules, fieldName, newFieldName) => {
	const visitor = new RulesVisitor(rules);

	rules = visitor.mapActions(
		action => {
			if (action.target === fieldName) {
				action = {
					...action,
					target: newFieldName
				};
			}
			if (action.action === 'calculate') {
				action = {
					...action,
					expression: renameFieldInsideExpression(action.expression, fieldName, newFieldName)
				};
			}

			return action;
		}
	);

	visitor.setRules(rules);

	return visitor.mapConditions(
		condition => {
			return {
				...condition,
				operands: condition.operands.map(
					operand => {
						if (operand.type === 'field' && operand.value === fieldName) {
							operand = {
								...operand,
								value: newFieldName
							};
						}

						return operand;
					}
				)
			};
		}
	);
};

const updateFieldValidationProperty = (pages, fieldName, propertyName, propertyValue) => {
	const visitor = new PagesVisitor(pages);

	return visitor.mapFields(
		field => {
			if (field.fieldName === 'validation' && field.value) {
				let expression = field.value.expression;

				if (propertyName === 'fieldName') {
					expression = expression.replace(fieldName, propertyValue);
				}

				field = {
					...field,
					validation: {
						...field.validation,
						[propertyName]: propertyValue
					},
					value: {
						...field.value,
						expression
					}
				};
			}

			return field;
		}
	);
};

const shouldAutoGenerateName = focusedField => {
	const {fieldName, label} = focusedField;

	return fieldName === normalizeFieldName(label);
};

export const updateSettingsContextProperty = (state, settingsContext, propertyName, propertyValue) => {
	const {locale} = state;
	const visitor = new PagesVisitor(settingsContext.pages);

	return {
		...settingsContext,
		pages: visitor.mapFields(
			field => {
				if (propertyName === field.fieldName) {
					field = {
						...field,
						value: propertyValue
					};

					if (field.localizable) {
						field.localizedValue = {
							...field.localizedValue,
							[locale]: propertyValue
						};
					}
				}

				return field;
			}
		)
	};
};

export const updateFocusedFieldName = (state, focusedField, value) => {
	const {fieldName} = focusedField;
	const normalizedFieldName = normalizeFieldName(value);

	if (normalizedFieldName !== fieldName) {
		const {pages} = state;
		let newFieldName = generateFieldName(pages, value);

		if (normalizedFieldName === '') {
			newFieldName = fieldName;
		}

		let {settingsContext} = focusedField;

		settingsContext = {
			...settingsContext,
			pages: updateFieldValidationProperty(settingsContext.pages, fieldName, 'fieldName', newFieldName)
		};

		focusedField = {
			...focusedField,
			fieldName: newFieldName,
			settingsContext: updateSettingsContextProperty(state, settingsContext, 'name', newFieldName)
		};
	}

	return focusedField;
};

export const updateFocusedFieldDataType = (state, focusedField, value) => {
	let {settingsContext} = focusedField;

	settingsContext = {
		...settingsContext,
		pages: updateFieldValidationProperty(settingsContext.pages, focusedField.fieldName, 'dataType', value)
	};

	return {
		...focusedField,
		dataType: value,
		settingsContext: updateSettingsContextProperty(state, settingsContext, 'dataType', value)
	};
};

export const updateFocusedFieldLabel = (state, focusedField, value) => {
	let {fieldName, settingsContext} = focusedField;

	if (shouldAutoGenerateName(focusedField)) {
		const updates = updateFocusedFieldName(state, focusedField, value);

		fieldName = updates.fieldName;
		settingsContext = updates.settingsContext;
	}

	return {
		...focusedField,
		fieldName,
		label: value,
		settingsContext: updateSettingsContextProperty(state, settingsContext, 'label', value)
	};
};

export const updateFocusedFieldProperty = (state, focusedField, propertyName, propertyValue) => {
	return {
		...focusedField,
		[propertyName]: propertyValue,
		settingsContext: updateSettingsContextProperty(state, focusedField.settingsContext, propertyName, propertyValue)
	};
};

export const updateFocusedField = (state, fieldName, value) => {
	let {focusedField} = state;

	if (fieldName === 'dataType') {
		focusedField = {
			...focusedField,
			...updateFocusedFieldDataType(state, focusedField, value)
		};
	}
	else if (fieldName === 'label') {
		focusedField = {
			...focusedField,
			...updateFocusedFieldLabel(state, focusedField, value)
		};
	}
	else if (fieldName === 'name') {
		focusedField = {
			...focusedField,
			...updateFocusedFieldName(state, focusedField, value)
		};
	}
	else {
		focusedField = {
			...focusedField,
			...updateFocusedFieldProperty(state, focusedField, fieldName, value)
		};
	}

	return focusedField;
};

export const updatePages = (pages, oldFieldProperties, newFieldProperties) => {
	const {fieldName} = oldFieldProperties;

	return FormSupport.updateField(
		pages,
		fieldName,
		newFieldProperties
	);
};

export const updateRules = (rules, oldFieldProperties, newFieldProperties) => {
	const {fieldName} = oldFieldProperties;
	const newFieldName = newFieldProperties.fieldName;

	return updateRulesFieldName(rules, fieldName, newFieldName);
};

export const handleFieldEdited = (state, event) => {
	const {propertyName, propertyValue} = event;
	const {focusedField, pages, rules} = state;
	const updatedFocusedField = updateFocusedField(state, propertyName, propertyValue);

	return {
		focusedField: updatedFocusedField,
		pages: updatePages(pages, focusedField, updatedFocusedField),
		rules: updateRules(rules, focusedField, updatedFocusedField)
	};
};

export default handleFieldEdited;