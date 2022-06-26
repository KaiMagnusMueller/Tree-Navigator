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
    parent.postMessage(
        {
            pluginMessage: {
                type: 'update-filter-ranking',
                parameters: filterList,
            },
        },
        '*'
    );
}