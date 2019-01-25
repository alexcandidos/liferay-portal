import {findFieldByName} from '../components/Form/FormSupport.es';
import {PagesVisitor} from './visitors.es';

export const formatFieldName = (instanceId, locale, value) => {
	return `ddm$$${value}$${instanceId}$0$$${locale}`;
};

export const generateFieldName = (pages, desiredName) => {
	let counter = 0;
	let name = normalizeFieldName(desiredName);

	let existingField = findFieldByName(pages, name);

	while (existingField) {
		if (counter > 0) {
			name = normalizeFieldName(desiredName) + counter;
		}

		existingField = findFieldByName(pages, name);

		counter++;
	}

	return normalizeFieldName(name);
};

export const generateInstanceId = length => {
	let text = '';

	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
};

/**
 * Checks if a given character is valid for use in a field name.
 * @param {string} character
 * @return {Boolean} Returns true if the character is invalid.
 */
function isInvalidFieldNameCharacter(character) {
	return /[~`!@#$%^&*(){}[\];:"'<,.>?/\-+=]/g.test(character);
}

/**
 * Find a field label based on fieldName
 * @param {string} fieldName
 * @return {string} The field name normalized.
 */
export function normalizeFieldName(fieldName) {
	let nextUpperCase = false;
	let normalizedFieldName = '';

	fieldName = fieldName.trim();

	for (let i = 0; i < fieldName.length; i++) {
		let item = fieldName[i];

		if (item === ' ') {
			nextUpperCase = true;

			continue;
		}
		else if (isInvalidFieldNameCharacter(item)) {
			continue;
		}

		if (nextUpperCase) {
			item = item.toUpperCase();

			nextUpperCase = false;
		}

		normalizedFieldName += item;
	}

	if (/^\d/.test(normalizedFieldName)) {
		normalizedFieldName = `_${normalizedFieldName}`;
	}

	return normalizedFieldName;
}

/**
 * Makes sure fields have its settings form filled up with some default values.
 */

export const normalizeSettingsContextPages = (pages, namespace, fieldType, generatedFieldName) => {
	const translationManager = Liferay.component(`${namespace}translationManager`);
	const visitor = new PagesVisitor(pages);

	return visitor.mapFields(
		field => {
			const {fieldName} = field;

			if (fieldName === 'name') {
				field = {
					...field,
					value: generatedFieldName,
					visible: true
				};
			}
			else if (fieldName === 'label') {
				field = {
					...field,
					localizedValue: {
						...field.localizedValue,
						[translationManager.get('editingLocale')]: fieldType.label
					},
					type: 'text',
					value: fieldType.label
				};
			}
			else if (fieldName === 'type') {
				field = {
					...field,
					value: fieldType.name
				};
			}
			else if (fieldName === 'validation') {
				field = {
					...field,
					validation: {
						...field.validation,
						fieldName: generatedFieldName
					}
				};
			}
			return {
				...field
			};
		}
	);
};

/**
 * Converts the settings Form of a field into an object of field properties.
 */

export const getFieldPropertiesFromSettingsContext = settingsContext => {
	const properties = {};
	const visitor = new PagesVisitor(settingsContext.pages);

	visitor.mapFields(
		({fieldName, value}) => {
			properties[fieldName] = value;
		}
	);

	return properties;
};