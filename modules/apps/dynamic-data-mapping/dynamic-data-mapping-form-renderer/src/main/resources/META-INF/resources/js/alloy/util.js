AUI.add(
	'liferay-ddm-form-renderer-util',
	function(A) {
		var VALIDATIONS = {
			numeric: [
				{
					label: Liferay.Language.get('is-greater-than-or-equal-to'),
					name: 'lt',
					parameterMessage: Liferay.Language.get('number-placeholder'),
					regex: /^(.+)\<(\d+\.?\d*)$/,
					template: '{name}<{parameter}'
				},
				{
					label: Liferay.Language.get('is-greater-than'),
					name: 'lteq',
					parameterMessage: Liferay.Language.get('number-placeholder'),
					regex: /^(.+)\<\=(\d+\.?\d*)$/,
					template: '{name}<={parameter}'
				},
				{
					label: Liferay.Language.get('is-not-equal-to'),
					name: 'eq',
					parameterMessage: Liferay.Language.get('number-placeholder'),
					regex: /^(.+)\=\=(\d+\.?\d*)$/,
					template: '{name}=={parameter}'
				},
				{
					label: Liferay.Language.get('is-less-than-or-equal-to'),
					name: 'gt',
					parameterMessage: Liferay.Language.get('number-placeholder'),
					regex: /^(.+)\>(\d+\.?\d*)$/,
					template: '{name}>{parameter}'
				},
				{
					label: Liferay.Language.get('is-less-than'),
					name: 'gteq',
					parameterMessage: Liferay.Language.get('number-placeholder'),
					regex: /^(.+)\>\=(\d+\.?\d*)$/,
					template: '{name}>={parameter}'
				}

			],
			string: [
				{
					label: Liferay.Language.get('contains'),
					name: 'notContains',
					parameterMessage: Liferay.Language.get('text'),
					regex: /^NOT\(contains\((.+), "(.+)"\)\)$/,
					template: 'NOT(contains({name}, "{parameter}"))'
				},
				{
					label: Liferay.Language.get('does-not-contain'),
					name: 'contains',
					parameterMessage: Liferay.Language.get('text'),
					regex: /^contains\((.+), "(.+)"\)$/,
					template: 'contains({name}, "{parameter}")'
				},
				{
					label: Liferay.Language.get('is-not-url'),
					name: 'url',
					parameterMessage: '',
					regex: /^isURL\((.+)\)$/,
					template: 'isURL({name})'
				},
				{
					label: Liferay.Language.get('is-not-email'),
					name: 'email',
					parameterMessage: '',
					regex: /^isEmailAddress\((.+)\)$/,
					template: 'isEmailAddress({name})'
				},
				{
					label: Liferay.Language.get('does-not-match'),
					name: 'regularExpression',
					parameterMessage: Liferay.Language.get('regular-expression'),
					regex: /^match\((.+), "(.*)"\)$/,
					template: 'match({name}, "{parameter}")'
				}
			]
		};

		var Util = {
			compare: function(valueA, valueB) {
				return Liferay.Util.isEqual(valueA, valueB);
			},

			generateInstanceId: function(length) {
				var instance = this;

				var text = '';

				var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

				for (var i = 0; i < length; i++) {
					text += possible.charAt(Math.floor(Math.random() * possible.length));
				}

				return text;
			},

			getFieldByKey: function(haystack, needle, searchKey) {
				var instance = this;

				return instance.searchFieldsByKey(haystack, needle, searchKey)[0];
			},

			getFieldNameFromQualifiedName: function(qualifiedName) {
				var fieldName;
				var nestedFieldName = qualifiedName.split('#');

				if (nestedFieldName.length > 1) {
					fieldName = nestedFieldName[1].split('$')[0];
				}
				else {
					var name = qualifiedName.split('$$')[1];

					fieldName = name.split('$')[0];
				}

				return fieldName;
			},

			getInstanceIdFromQualifiedName: function(qualifiedName) {
				var instanceId;
				var nestedFieldName = qualifiedName.split('#');

				if (nestedFieldName.length > 1) {
					instanceId = nestedFieldName[1].split('$')[1];
				}
				else {
					var name = qualifiedName.split('$$')[1];

					instanceId = name.split('$')[1];
				}

				return instanceId;
			},

			getValidations: function(selectedType) {
				return VALIDATIONS[selectedType];
			},

			searchFieldsByKey: function(haystack, needle, searchKey) {
				var queue = new A.Queue(haystack);

				var results = [];

				var addToQueue = function(item) {
					queue.add(item);
				};

				searchKey = searchKey || 'name';

				while (queue.size() > 0) {
					var next = queue.next();

					if (next[searchKey] === needle) {
						results.push(next);
					}
					else {
						var children = next.fields || next.nestedFields;

						if (children) {
							children.forEach(addToQueue);
						}
					}
				}

				return results;
			}
		};

		Liferay.namespace('DDM.Renderer').Util = Util;
	},
	'',
	{
		requires: ['liferay-ddm-form-renderer-types']
	}
);