export function saveRecentSearches(recentSearches) {
	//TODO: is it possible to let a store update the plugindata on its own?
	parent.postMessage(
		{
			pluginMessage: {
				type: 'update-recent-searches',
				parameters: recentSearches,
			},
		},
		'*'
	);
}

export function saveFilterRanking(filterList) {
	//TODO: is it possible to let a store update the plugindata on its own?
	let _filterList = [];
	filterList.forEach((element) => {
		_filterList.push(_objectWithoutProperties(element, ['checked', 'sticky', 'name']));
	});
	parent.postMessage(
		{
			pluginMessage: {
				type: 'update-filter-ranking',
				parameters: _filterList,
			},
		},
		'*'
	);
	console.log('save filters');
}

function _objectWithoutProperties(obj, keys) {
	var target = {};
	for (var i in obj) {
		if (keys.indexOf(i) >= 0) continue;
		if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
		target[i] = obj[i];
	}
	return target;
}

export function saveSettings(settings) {
	console.log(settings);
	parent.postMessage(
		{
			pluginMessage: {
				type: 'update-settings',
				parameters: settings,
			},
		},
		'*'
	);
	console.log('save settings');
}
