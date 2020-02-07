/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * The contents of this file are subject to the terms of the Liferay Enterprise
 * Subscription License ("License"). You may not use this file except in
 * compliance with the License. You can obtain a copy of the License by
 * contacting Liferay, Inc. See the License for the specific language governing
 * permissions and limitations under the License, including but not limited to
 * distribution rights of the Software.
 */

import React, {useCallback, useContext, useEffect, useMemo} from 'react';

import PromisesResolver from '../../../../../shared/components/promises-resolver/PromisesResolver.es';
import ToolbarWithSelection from '../../../../../shared/components/toolbar-with-selection/ToolbarWithSelection.es';
import {ModalContext} from '../../ModalContext.es';

const Header = ({items, totalCount}) => {
	const {bulkModal, setBulkModal} = useContext(ModalContext);

	const {selectAll, selectedTasks} = bulkModal;

	const selectedOnPage = useMemo(
		() =>
			selectedTasks.filter(item => items.find(({id}) => id === item.id)),
		[items, selectedTasks]
	);

	const allPageSelected =
		items.length > 0 && items.length === selectedOnPage.length;

	const checkbox = {
		checked: allPageSelected || selectAll,
		indeterminate:
			selectedOnPage.length > 0 && !allPageSelected && !selectAll
	};

	const remainingItems = useMemo(() => {
		return items.filter(
			item => !selectedTasks.find(({id}) => item.id === id)
		);
	}, [items, selectedTasks]);
	const toolbarActive = useMemo(() => selectedTasks.length > 0, [
		selectedTasks
	]);

	useEffect(() => {
		if (selectAll && remainingItems.length > 0) {
			setBulkModal({
				...bulkModal,
				selectedTasks: items
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [items]);

	const handleClear = () => {
		setBulkModal({...bulkModal, selectAll: false, selectedTasks: []});
	};

	const handleCheck = useCallback(
		checked => () => {
			const updatedItems = checked
				? [...selectedTasks, ...remainingItems]
				: selectedTasks.filter(
						item => !items.find(({id}) => item.id === id)
				  );

			setBulkModal({
				...bulkModal,
				selectAll: totalCount > 0 && totalCount === updatedItems.length,
				selectedTasks: updatedItems
			});
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[items, selectAll, selectedTasks]
	);

	return (
		<PromisesResolver.Resolved>
			<ToolbarWithSelection
				{...checkbox}
				active={toolbarActive}
				handleCheck={handleCheck(
					!checkbox.indeterminate && !selectAll && !allPageSelected
				)}
				handleClear={handleClear}
				handleSelectAll={() => {
					setBulkModal({
						...bulkModal,
						selectAll: true,
						selectedTasks: items
					});
				}}
				selectAll={selectAll}
				selectedCount={selectedTasks.length}
				totalCount={totalCount}
			/>
		</PromisesResolver.Resolved>
	);
};

export {Header};
