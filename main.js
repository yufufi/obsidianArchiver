module.exports = {
    sidebarButton: function(app) {
        let buttonEl = document.createElement('button');
        buttonEl.textContent = 'Archive File';
        buttonEl.onclick = async () => {
            const currentFile = app.workspace.getActiveFile();
            if (!currentFile) return;

            const oldPath = currentFile.path;
            const newPath = `/40.Archive${oldPath}`;

            try {
                // await app.vault.createFolder('/40.Archive');
                await app.vault.rename(oldPath, newPath);

                let file = app.metadataCache.getFirstLinkpathDest(oldPath);
                if (!file) return;

                const frontmatter = app.metadataCache.getFileCache(file)?.frontmatter || {};
                const tags = new Set(frontmatter.tags || []);
                tags.add('archive');

                await app.vault.modify(file, {
                    ...frontmatter,
                    tags: Array.from(tags)
                });

                app.workspace.trigger('file-change', file);
                app.workspace.activeLeaf.openFile(file);
            } catch (error) {
                console.error('Error archiving file:', error);
            }
        };

        let containerEl = document.createElement('div');
        containerEl.appendChild(buttonEl);

        app.workspace.leftSplit.containerEl.appendChild(containerEl);
    }
};
