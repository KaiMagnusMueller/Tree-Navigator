export function updateRecentSearches() {
    //TODO: is it possible to let a store update the plugindata on its own?
    parent.postMessage(
        {
            pluginMessage: {
                type: 'update-recent-searches',
                parameters: $recentSearches,
            },
        },
        '*'
    );
}