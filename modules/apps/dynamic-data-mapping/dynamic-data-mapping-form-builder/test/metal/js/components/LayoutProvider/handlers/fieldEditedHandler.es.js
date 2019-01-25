import {
	getFieldProperty,
	getFieldValue,
	renameFieldInsideExpression,
	updateFocusedFieldDataType,
	updateFocusedFieldLabel,
	updateFocusedFieldName,
	updateRulesFieldName
} from 'source/components/LayoutProvider/handlers/fieldEditedHandler.es';
import mockPages from 'mock/mockPages.es';

const focusedField = {
	fieldName: 'oldFieldName',
	label: 'Old Field Label',
	settingsContext: {
		pages: [
			{
				rows: [
					{
						columns: [
							{
								fields: [
									{
										fieldName: 'name',
										value: 'oldFieldName'
									},
									{
										fieldName: 'label',
										value: 'Old Field Label'
									},
									{
										fieldName: 'readOnly',
										value: false
									},
									{
										fieldName: 'dataType',
										value: 'oldDataType'
									},
									{
										fieldName: 'validation',
										validation: {
											dataType: 'oldDataType',
											fieldName: 'oldFieldName'
										},
										value: {
											expression: 'isEmailAddress(oldFieldName)'
										}
									}
								]
							}
						]
					}
				]
			}
		]
	}
};

describe(
	'fieldEditedHandler',
	() => {
		describe(
			'updateFocusedFieldName(state, focusedField, value)',
			() => {
				it(
					'should update the focused field "fieldName" property',
					() => {
						const state = {
							pages: mockPages
						};

						const newFocusedField = updateFocusedFieldName(state, focusedField, 'newName');

						expect(newFocusedField.fieldName).toEqual('newName');
					}
				);

				it(
					'should update the settingsContext of the focused field with the new field name',
					() => {
						const state = {
							pages: mockPages
						};

						const newFocusedField = updateFocusedFieldName(state, focusedField, 'newName');

						expect(getFieldValue(newFocusedField.settingsContext.pages, 'name')).toEqual('newName');
					}
				);

				it(
					'should update the validation expression of the validation field of the settingsContext with the new field name',
					() => {
						const state = {
							pages: mockPages
						};

						const newFocusedField = updateFocusedFieldName(state, focusedField, 'newName');

						expect(getFieldValue(newFocusedField.settingsContext.pages, 'validation').expression).toEqual('isEmailAddress(newName)');
						expect(getFieldProperty(newFocusedField.settingsContext.pages, 'validation', 'validation').fieldName).toEqual('newName');
					}
				);
			}
		);

		describe(
			'updateFocusedFieldDataType(state, focusedField, value)',
			() => {
				it(
					'should update the focused field "dataType" property',
					() => {
						const state = {
							pages: mockPages
						};

						const newFocusedField = updateFocusedFieldDataType(state, focusedField, 'newDataType');

						expect(newFocusedField.dataType).toEqual('newDataType');
					}
				);

				it(
					'should update the settingsContext of the focused field with the new dataType',
					() => {
						const state = {
							pages: mockPages
						};

						const newFocusedField = updateFocusedFieldDataType(state, focusedField, 'newDataType');

						expect(getFieldValue(newFocusedField.settingsContext.pages, 'dataType')).toEqual('newDataType');
					}
				);

				it(
					'should update the validation expression of the validation field of the settingsContext with the new dataType',
					() => {
						const state = {
							pages: mockPages
						};

						const newFocusedField = updateFocusedFieldDataType(state, focusedField, 'newDataType');

						expect(getFieldProperty(newFocusedField.settingsContext.pages, 'validation', 'validation').dataType).toEqual('newDataType');
					}
				);
			}
		);

		describe(
			'updateFocusedFieldLabel(state, focusedField, value)',
			() => {
				it(
					'should update the focused field "label" property',
					() => {
						const state = {
							pages: mockPages
						};

						const newFocusedField = updateFocusedFieldLabel(state, focusedField, 'New Label');

						expect(newFocusedField.label).toEqual('New Label');
					}
				);

				it(
					'should update the settingsContext of the focused field with the new field label',
					() => {
						const state = {
							pages: mockPages
						};

						const newFocusedField = updateFocusedFieldLabel(state, focusedField, 'New Label');

						expect(getFieldValue(newFocusedField.settingsContext.pages, 'label')).toEqual('New Label');
					}
				);

				it(
					'should automatically update the field name if it was auto generated from its label',
					() => {
						const mockFocusedField = {
							...focusedField,
							fieldName: 'GeneratedFieldName',
							label: 'Generated Field Name'
						};

						const state = {
							pages: mockPages
						};

						const newFocusedField = updateFocusedFieldLabel(state, mockFocusedField, 'New Label');

						expect(newFocusedField.fieldName).toEqual('NewLabel');
						expect(getFieldValue(newFocusedField.settingsContext.pages, 'name')).toEqual('NewLabel');
					}
				);

				it(
					'should not automatically update the field name if it was not auto generated from its label',
					() => {
						const state = {
							pages: mockPages
						};

						const newFocusedField = updateFocusedFieldLabel(state, focusedField, 'New Label');

						expect(newFocusedField.fieldName).toEqual('oldFieldName');
						expect(getFieldValue(newFocusedField.settingsContext.pages, 'name')).toEqual('oldFieldName');
					}
				);
			}
		);

		describe(
			'renameFieldInsideExpression(expression, fieldName, newFieldName)',
			() => {
				it(
					'should rename a field name used inside an expression',
					() => {
						const expression = '2*[FieldName1]+sum([FieldName2])';

						expect(renameFieldInsideExpression(expression, 'FieldName1', 'NewFieldName')).toEqual('2*[NewFieldName]+sum([FieldName2])');
						expect(renameFieldInsideExpression(expression, 'FieldName2', 'NewFieldName')).toEqual('2*[FieldName1]+sum([NewFieldName])');
					}
				);
			}
		);

		describe(
			'updateRulesFieldName(rules, fieldName, newFieldName)',
			() => {
				it(
					'should rename a field name used inside a rule condition operand of type "field"',
					() => {
						const rules = [
							{
								actions: [],
								conditions: [
									{
										operands: [
											{
												type: 'field',
												value: 'FieldName1'
											}
										]
									},
									{
										operands: [
											{
												type: 'field',
												value: 'FieldName2'
											},
											{
												type: 'value',
												value: 'FieldName1'
											}
										]
									}
								]
							}
						];

						const updatedRules = updateRulesFieldName(rules, 'FieldName1', 'NewFieldName');

						expect(updatedRules[0].conditions[0].operands[0].value).toEqual('NewFieldName');
						expect(updatedRules[0].conditions[1].operands[1].value).toEqual('FieldName1');
					}
				);

				it(
					'should rename a field name used inside a rule action target',
					() => {
						const rules = [
							{
								actions: [
									{
										target: 'FieldName1'
									},
									{
										target: 'FieldName2'
									}
								],
								conditions: []
							}
						];

						const updatedRules = updateRulesFieldName(rules, 'FieldName1', 'NewFieldName');

						expect(updatedRules[0].actions[0].target).toEqual('NewFieldName');
						expect(updatedRules[0].actions[1].target).toEqual('FieldName2');
					}
				);

				it(
					'should rename a field name used inside an expression of rule of type "calculate"',
					() => {
						const rules = [
							{
								actions: [
									{
										action: 'calculate',
										expression: '2*[FieldName2]',
										target: 'FieldName1'
									},
									{
										target: 'FieldName2'
									}
								],
								conditions: []
							}
						];

						const updatedRules = updateRulesFieldName(rules, 'FieldName2', 'NewFieldName');

						expect(updatedRules[0].actions[0].expression).toEqual('2*[NewFieldName]');
						expect(updatedRules[0].actions[1].target).toEqual('NewFieldName');
					}
				);
			}
		);
	}
);